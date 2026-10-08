"use server";

import {cookies} from "next/headers";
import {getLocale} from "next-intl/server";
import {redirect} from "next/navigation";
import {routing} from "@/i18n/routing";
import type {AuthUser} from "@/lib/auth";

const apiBaseUrl = () => (process.env.API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

export async function getPartnerProfile(): Promise<AuthUser> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map(({name, value}) => `${name}=${value}`).join("; ");

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl()}/API/V1/profile`, {
      headers: {
        Cookie: cookieHeader,
        Origin: process.env.FRONTEND_URL || "http://localhost:3000",
      },
      cache: "no-store",
    });
  } catch {
    throw new Error("Unable to reach the partner service.");
  }

  const result = await response.json().catch(() => null);
  if (response.status === 401 || response.status === 403) {
    const locale = (await getLocale()) ?? routing.defaultLocale;
    redirect(`/${locale}/partner/login`);
  }
  if (!response.ok || !result?.user) {
    throw new Error(result?.message || "Unable to load partner information.");
  }

  return result.user as AuthUser;
}

export async function updateProfile(..._args: any[]) { return {success: "Demo profile saved."}; }
