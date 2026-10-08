"use server";

import {bookingRequestSchema} from "@/lib/validations/booking";

export async function submitBookingRequest(input: unknown) {
  if (!input || typeof input !== "object" || !("offerId" in input) || !("locale" in input)) return {ok: false as const, error: "serverError"};
  const payload = input as Record<string, unknown>;
  const result = bookingRequestSchema.safeParse(payload.form);
  if (!result.success) return {ok: false as const, error: result.error.issues[0]?.message ?? "serverError"};
  if (typeof payload.offerId !== "string" || !["es", "en", "pt"].includes(String(payload.locale))) return {ok: false as const, error: "serverError"};
  try {
    const base = (process.env.API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
    const response = await fetch(`${base}/API/V1/bookings`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({offerId: payload.offerId, locale: payload.locale, form: result.data}),
      cache: "no-store",
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || typeof data?.checkoutUrl !== "string") return {ok: false as const, error: data?.error || "serverError"};
    return {ok: true as const, checkoutUrl: data.checkoutUrl};
  } catch {
    return {ok: false as const, error: "serverError"};
  }
}

export async function getBookingConfirmation(reference: string, offerId: string) {
  if (!/^NS-\d{8}-[A-F0-9]{18}$/.test(reference) || typeof offerId !== "string") return null;
  const match = /^(.*)--(base|economic|standard|premium)$/.exec(offerId);
  if (!match) return null;
  try {
    const base = (process.env.API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
    const response = await fetch(`${base}/API/V1/bookings/${encodeURIComponent(reference)}`, {cache: "no-store"});
    const data = await response.json().catch(() => null);
    const booking = data?.booking;
    if (!response.ok || !booking || booking.product_slug !== match[1] || booking.offer_tier !== match[2]) return null;
    return booking as {
      reference: string;
      product_slug: string;
      product_title: string;
      offer_tier: "base" | "economic" | "standard" | "premium";
      unit_price: number | string;
      currency: string;
      total: number | string;
      booking_date: string;
      travelers: number;
      status: string;
      payment_status: string;
      ticket_code: string | null;
      ticket_email_sent: boolean;
      tickets: {ticket_number: number; ticket_code: string}[];
      cancellation_policy: string;
    };
  } catch {
    return null;
  }
}
