/* ------------------------------------------------------------------ *
 *  Nomadica Sahara · Shared formatters
 *  Single source of truth for dates, money and pax summaries.
 * ------------------------------------------------------------------ */

const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit",
  month: "short",
});

const moneyFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

/** `2026-10-12` → `12 oct 2026`. Timezone-safe (fixed at 12:00 UTC). */
export function formatBookingDate(iso: string): string {
  return dateFormatter.format(new Date(`${iso}T12:00:00Z`));
}

/** `2026-10-12` → `12 oct`. */
export function formatShortDate(iso: string): string {
  return shortDateFormatter.format(new Date(`${iso}T12:00:00Z`));
}

/** Activity date + time: `12 oct 2026 · 06:00`. */
export function formatActivity(iso: string, time: string): string {
  return `${formatBookingDate(iso)} · ${time}`;
}

export function formatMoney(value: number): string {
  return moneyFormatter.format(value);
}

/** `2 adultos, 1 niño` — used for the pax summary. */
export function formatPax(adults: number, children: number): string {
  const adultPart = `${adults} ${adults === 1 ? "adulto" : "adultos"}`;
  if (!children) return adultPart;
  return `${adultPart}, ${children} ${children === 1 ? "niño" : "niños"}`;
}

/** Initials for avatars: `Youssef El Amrani` → `YE`. */
export function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
