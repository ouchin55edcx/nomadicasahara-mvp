"use server";

import type {TourRecord, L10n, Tier} from "@/types/tour-catalog";

const apiBaseUrl = () => (process.env.API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
const localized = (value: unknown): L10n => {
  const text = String(value ?? "");
  return {en: text, es: text, pt: text};
};

export type PublicProduct = TourRecord & {
  productType: string;
  featured: boolean;
  discount: number | null;
  productCategory: string;
  location: string;
  currency: string;
  rating: number | null;
  reviewCount: number;
  gallery: string[];
};

type ProductRow = {
  id: string;
  type: string;
  title: string;
  slug: string;
  location: string;
  destination: string;
  image: string;
  gallery?: string[];
  pricing_options?: unknown;
  price: number | string;
  currency?: string;
  rating?: number | string | null;
  review_count?: number | null;
  description?: string | null;
  duration?: string | null;
  duration_hours?: number | string | null;
  category?: string | null;
  discount?: number | string | null;
  featured?: boolean;
  meeting_point?: string | null;
  pickup_included?: boolean;
  hotel_facilities?: string[];
  menu_type?: string | null;
  show_included?: boolean;
  treatment_duration?: string | null;
  treatment?: string | null;
  time?: string | null;
  private_group_size?: string | null;
  itinerary?: unknown;
};

function toTour(row: ProductRow): PublicProduct {
  const title = String(row.title || "Untitled experience");
  const summary = String(row.description || title);
  const duration = String(row.duration || (row.duration_hours ? `${row.duration_hours} hours` : ""));
  const numericRating = row.rating == null ? null : Number(row.rating);
  const rawItinerary = Array.isArray(row.itinerary)
    ? row.itinerary
    : row.itinerary && typeof row.itinerary === "object" && Array.isArray((row.itinerary as {steps?: unknown[]}).steps)
      ? (row.itinerary as {steps: unknown[]}).steps
      : [];
  const steps = rawItinerary.map((raw) => {
    const item = raw as Record<string, unknown>;
    return {
      ...(item.time ? {time: String(item.time)} : {}),
      title: localized(item.title || item.name || item.location || "Experience"),
      text: localized(item.description || item.notes || item.title || ""),
      ...(item.duration ? {duration: localized(item.duration)} : {}),
    };
  });
  const type = String(row.type || "activity");
  const options = row.pricing_options && typeof row.pricing_options === "object"
    ? row.pricing_options as {unit?: string; tiers?: Partial<Record<"economic" | "standard" | "premium", number | string>>; tierSummary?: Partial<Record<"economic" | "standard" | "premium", string>>}
    : null;
  const tierNames = ["economic", "standard", "premium"] as const satisfies readonly Tier[];
  const validTiers = options?.tiers && tierNames.every((tier) => Number.isFinite(Number(options.tiers?.[tier])) && Number(options.tiers?.[tier]) >= 0);
  const pricing = validTiers
    ? {
        kind: "offers" as const,
        unit: (["person", "vehicle", "group", "ticket"].includes(options?.unit || "") ? options?.unit : "person") as "person" | "vehicle" | "group" | "ticket",
        tiers: Object.fromEntries(tierNames.map((tier) => [tier, Number(options?.tiers?.[tier])])) as Record<typeof tierNames[number], number>,
        features: [],
        tierSummary: Object.fromEntries(tierNames.map((tier) => [tier, localized(options?.tierSummary?.[tier] || tier)])) as Record<typeof tierNames[number], L10n>,
      }
    : {kind: "single" as const, unit: type === "private-tour" ? "vehicle" as const : type === "hotel" ? "group" as const : "person" as const, amount: Number(row.price || 0)};
  const detailBits = [row.menu_type, row.treatment, row.treatment_duration, row.meeting_point, row.time, row.private_group_size]
    .filter(Boolean).map((value) => localized(value));

  return {
    id: row.slug,
    slug: row.slug,
    title: localized(title),
    category: localized(row.category || type),
    summary: localized(summary),
    image: row.image || "/images/hero.jpg",
    destination: localized(row.destination || row.location || "Marrakech"),
    startPlace: localized(row.location || row.destination || "Marrakech"),
    duration: localized(duration),
    ...(Number(row.duration_hours) >= 24 ? {durationDays: Math.ceil(Number(row.duration_hours) / 24)} : {}),
    pricing,
    details: {
      layout: type === "hammam" ? "wellness" : type === "hotel" ? "service" : "day-tour",
      highlights: detailBits,
      overview: [localized(summary)],
      ...(steps.length ? {steps} : {}),
      included: row.pickup_included ? [localized("Pickup included")] : [],
      notIncluded: [],
      ...(row.location ? {meeting: localized(row.meeting_point || row.location)} : {}),
      bring: [],
      goodToKnow: (row.hotel_facilities || []).map(localized),
      faqs: [],
    },
    productType: type,
    featured: Boolean(row.featured),
    discount: row.discount == null ? null : Number(row.discount),
    productCategory: String(row.category || ""),
    location: String(row.location || ""),
    rating: numericRating,
    reviewCount: Number(row.review_count || 0),
    currency: String(row.currency || "EUR"),
    gallery: Array.isArray(row.gallery) ? row.gallery.filter((url): url is string => typeof url === "string" && Boolean(url.trim())) : [],
  };
}

export async function getPublicProducts(): Promise<PublicProduct[]> {
  try {
    const response = await fetch(`${apiBaseUrl()}/API/V1/products`, {cache: "no-store"});
    if (!response.ok) return [];
    const result = await response.json();
    return Array.isArray(result?.products) ? result.products.map(toTour) : [];
  } catch {
    return [];
  }
}

export async function getPublicProductBySlug(slug: string): Promise<PublicProduct | null> {
  try {
    const response = await fetch(`${apiBaseUrl()}/API/V1/products/${encodeURIComponent(slug)}`, {cache: "no-store"});
    if (!response.ok) return null;
    const result = await response.json();
    return result?.product ? toTour(result.product) : null;
  } catch {
    return null;
  }
}
