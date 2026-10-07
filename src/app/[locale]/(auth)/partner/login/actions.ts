"use server";

import {cookies, headers} from "next/headers";
import {redirect} from "next/navigation";
import {getLocale} from "next-intl/server";
import {routing} from "@/i18n/routing";
import {loginStep1Schema} from "@/lib/validations/partner";

export type AuthState = {error?: string; twoFactorRequired?: boolean} | null;
type CookieStore = Awaited<ReturnType<typeof cookies>>;
type CookieOptions = {expires?: Date; httpOnly?: boolean; maxAge?: number; path?: string; sameSite?: "lax" | "strict" | "none"; secure?: boolean};

function persistAuthCookies(response: Response, store: CookieStore) {
  const headers = response.headers as Headers & {getSetCookie?: () => string[]};
  for (const header of headers.getSetCookie?.() ?? []) {
    const [pair, ...attributes] = header.split(";");
    const separator = pair.indexOf("=");
    if (separator <= 0) continue;
    const name = pair.slice(0, separator).trim();
    const value = pair.slice(separator + 1).trim();
    const options: CookieOptions = {};
    for (const attribute of attributes) {
      const [rawKey, ...rawValue] = attribute.trim().split("=");
      const key = rawKey.toLowerCase();
      const value = rawValue.join("=").trim();
      if (key === "httponly") options.httpOnly = true;
      else if (key === "secure") options.secure = true;
      else if (key === "path") options.path = value;
      else if (key === "max-age") options.maxAge = Number.parseInt(value, 10);
      else if (key === "expires") { const expires = new Date(value); if (!Number.isNaN(expires.getTime())) options.expires = expires; }
      else if (key === "samesite" && ["lax", "strict", "none"].includes(value.toLowerCase())) options.sameSite = value.toLowerCase() as CookieOptions["sameSite"];
    }
    store.set(name, value, options);
  }
}

const apiUrl = () => (process.env.API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
const origin = () => process.env.FRONTEND_URL || "http://localhost:3000";
async function requestAuth(path: string, body?: unknown) {
  const store = await cookies();
  const incomingHeaders = await headers();
  const cookieHeader = store.getAll().map(({name, value}) => `${name}=${value}`).join("; ");
  const forwardedFor = incomingHeaders.get("x-forwarded-for") || incomingHeaders.get("x-real-ip");
  return fetch(`${apiUrl()}/API/V1/auth/${path}`, {
    method: "POST", cache: "no-store",
    headers: {"Content-Type": "application/json", Origin: origin(), Cookie: cookieHeader, ...(forwardedFor ? {"x-forwarded-for": forwardedFor} : {})},
    ...(body === undefined ? {} : {body: JSON.stringify(body)}),
  });
}
async function saveSession(response: Response) { persistAuthCookies(response, await cookies()); }
async function goToOverview(): Promise<never> { const locale = (await getLocale()) ?? routing.defaultLocale; redirect(`/${locale}/partner/overview`); }

export async function verifyCredentials(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginStep1Schema.safeParse({email: formData.get("email"), password: formData.get("password")});
  if (!parsed.success) return {error: parsed.error.issues[0].message};
  let response: Response;
  try { response = await requestAuth("sign-in/email", parsed.data); }
  catch { return {error: "Unable to reach the login service. Please try again."}; }
  const result = await response.json().catch(() => null);
  if (!response.ok) return {error: result?.message || "Email or password is incorrect."};
  await saveSession(response);
  if (result?.twoFactorRedirect) return {twoFactorRequired: true};
  return goToOverview();
}

export async function verifyPartnerTotp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const code = String(formData.get("code") || "").replace(/\s/g, "");
  if (!/^\d{6}$/.test(code)) return {error: "Enter the 6-digit code from your authenticator app."};
  let response: Response;
  try { response = await requestAuth("two-factor/verify-totp", {code}); }
  catch { return {error: "Unable to reach the login service. Please try again."}; }
  const result = await response.json().catch(() => null);
  if (!response.ok) return {error: result?.message || "That authenticator code is invalid."};
  await saveSession(response);
  return goToOverview();
}

export async function logout(): Promise<void> {
  const store = await cookies();
  try { const response = await requestAuth("sign-out"); persistAuthCookies(response, store); } catch { /* Local cookies are cleared below. */ }
  for (const {name} of store.getAll()) if (name === "partner_session" || name.includes("better-auth") || name.startsWith("neon-auth") || name.startsWith("__Secure-")) store.delete(name);
  const locale = (await getLocale()) ?? routing.defaultLocale;
  redirect(`/${locale}/partner/login`);
}

export async function getTwoFactorStatus(): Promise<{enabled: boolean} | {error: string}> {
  try {
    const store = await cookies();
    const cookieHeader = store.getAll().map(({name, value}) => `${name}=${value}`).join("; ");
    const response = await fetch(`${apiUrl()}/API/V1/auth/get-session`, {headers: {Cookie: cookieHeader, Origin: origin()}, cache: "no-store"});
    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.user) return {error: "Your session has expired. Sign in again."};
    return {enabled: Boolean(data.user.twoFactorEnabled)};
  } catch { return {error: "Unable to load your security settings."}; }
}

export async function enableTwoFactor(password: string): Promise<{totpURI: string; backupCodes: string[]} | {error: string}> {
  try {
    const response = await requestAuth("two-factor/enable", {password});
    const data = await response.json().catch(() => null);
    if (!response.ok) return {error: data?.message || "Unable to start authenticator setup."};
    await saveSession(response);
    return data;
  } catch { return {error: "Unable to reach the security service."}; }
}

export async function confirmTwoFactor(code: string): Promise<{success: true} | {error: string}> {
  if (!/^\d{6}$/.test(code)) return {error: "Enter a valid 6-digit authenticator code."};
  try {
    const response = await requestAuth("two-factor/verify-totp", {code});
    const data = await response.json().catch(() => null);
    if (!response.ok) return {error: data?.message || "That authenticator code is invalid."};
    await saveSession(response);
    return {success: true};
  } catch { return {error: "Unable to reach the security service."}; }
}

export async function disableTwoFactor(password: string): Promise<{success: true} | {error: string}> {
  try {
    const response = await requestAuth("two-factor/disable", {password});
    const data = await response.json().catch(() => null);
    if (!response.ok) return {error: data?.message || "Unable to disable two-step verification."};
    await saveSession(response);
    return {success: true};
  } catch { return {error: "Unable to reach the security service."}; }
}
