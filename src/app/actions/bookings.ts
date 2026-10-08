"use server";

import {cookies} from "next/headers";

const apiBaseUrl = () => (process.env.API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

async function partnerRequest(path: string, method: string, body?: unknown) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map(({name, value}) => `${name}=${value}`).join("; ");
  return fetch(`${apiBaseUrl()}${path}`, {
    method,
    headers: {
      Cookie: cookieHeader,
      Origin: process.env.FRONTEND_URL || "http://localhost:3000",
      ...(body ? {"Content-Type": "application/json"} : {}),
    },
    ...(body ? {body: JSON.stringify(body)} : {}),
    cache: "no-store",
  });
}

export async function getAllBookings(offset = 0, limit = 50) {
  try {
    const response = await partnerRequest(`/API/V1/bookings/partner?offset=${offset}&limit=${limit}`, "GET");
    if (!response.ok) return [];
    const result = await response.json();
    return Array.isArray(result?.bookings) ? result.bookings : [];
  } catch {
    return [];
  }
}

export async function getActiveGuides() {
  return [];
}

export async function updateBookingStatus(id: string, status: string) {
  try {
    const response = await partnerRequest(`/API/V1/bookings/partner/${encodeURIComponent(id)}/status`, "PATCH", {status});
    const result = await response.json().catch(() => null);
    return response.ok ? {success: true as const} : {error: result?.message || "Unable to update booking."};
  } catch {
    return {error: "Unable to reach the booking service."};
  }
}

export async function markBookingPaid(id: string) {
  try {
    const response = await partnerRequest(`/API/V1/bookings/partner/${encodeURIComponent(id)}/payment`, "PATCH", {});
    const result = await response.json().catch(() => null);
    return response.ok ? {success: true as const} : {error: result?.message || "Unable to update booking payment."};
  } catch {
    return {error: "Unable to reach the booking service."};
  }
}

export async function assignGuide(..._args: unknown[]) {
  return {error: "Guide assignment is not available for public booking requests."};
}

export async function autoAssignGuide(..._args: unknown[]) {
  return {error: "Guide assignment is not available for public booking requests."};
}
