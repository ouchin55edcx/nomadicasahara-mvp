"use server";

import {randomInt} from "node:crypto";
import {parseOfferId} from "@/lib/tour-catalog";
import {bookingRequestSchema} from "@/lib/validations/booking";

export async function submitBookingRequest(input: unknown) {
  if (!input || typeof input !== "object" || !("offerId" in input)) return {ok: false as const, error: "serverError"};
  const payload = input as Record<string, unknown>;
  if (typeof payload.offerId !== "string" || !parseOfferId(payload.offerId)) return {ok: false as const, error: "serverError"};
  const result = bookingRequestSchema.safeParse(payload.form);
  if (!result.success) return {ok: false as const, error: result.error.issues[0]?.message ?? "serverError"};
  const now = new Date();
  const stamp = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}${String(now.getUTCDate()).padStart(2, "0")}`;
  const reference = `TV-${stamp}-${String(randomInt(0, 10000)).padStart(4, "0")}`;
  return {ok: true as const, reference};
}
