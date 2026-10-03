"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginStep1Schema, loginStep2Schema } from "@/lib/validations/partner";

/* TODO(deploy): sustituir estas actions mock por Supabase Auth
   — signInWithPassword() en verifyCredentials
   — verifyOtp({ type: 'sms' | 'email' }, token) en verifyCode
   — session JWT en la cookie partner_session                          */

export type AuthState = { error?: string } | null;

export async function verifyCredentials(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = loginStep1Schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Mock: cualquier credencial no vacía con email válido es aceptada.
  return null;
}

export async function verifyCode(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginStep2Schema.safeParse({ code: formData.get("code") });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const store = await cookies();
  store.set("partner_session", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete("partner_session");
  redirect("/partner/login");
}
