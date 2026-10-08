import type {L10n, Tier, TourRecord} from "@/types/tour-catalog";
import {allTourRecords} from "@/data/static/tour-catalog";
import {resolveTour} from "@/lib/tour-route";
import {notFound} from "next/navigation";

const locales = ["en", "es", "pt"] as const;
const l10n = (value: unknown): L10n => Object.fromEntries(locales.map((locale) => [locale, String(value || "")])) as L10n;

export function trekToTour(trek: any): TourRecord {
  const content = trek;
  const itinerary = Array.isArray(content.itinerary_steps) ? content.itinerary_steps : [];
  const durationDays = Math.max(1, Number(content.duration_days || 1));
  const days = Array.from({length: durationDays}, (_, index) => {
    const items = itinerary.filter((item: any) => Number(item.day || 1) === index + 1);
    return {day: index + 1, title: l10n(items[0]?.title || `Day ${index + 1}`), from: l10n(items[0]?.from || content.start_location || "Marrakech"), to: l10n(items.at(-1)?.to || items.at(-1)?.location || content.start_location || "Marrakech"), text: l10n(items.map((item: any) => item.description || item.title).filter(Boolean).join(". ")), highlights: items.map((item: any) => l10n(item.title || item.name)).filter((item: L10n) => item.en), overnight: items.some((item: any) => item.type === "hotel") ? l10n(items.find((item: any) => item.type === "hotel")?.hotel_name || items.find((item: any) => item.type === "hotel")?.title) : undefined};
  });
  const steps = itinerary.map((item: any) => ({time: item.time || undefined, title: l10n(item.title || item.name || item.location || "Trek stop"), text: l10n(item.description || item.notes || item.title || ""), duration: item.duration ? l10n(item.duration) : undefined}));
  const overview = String(content.about || content.description || "").split(/\n+/).filter(Boolean).map(l10n);
  const formOffers = Array.isArray(content.offers) ? content.offers : [];
  const offerPricing = ["offers", "with_offers"].includes(content.offer_type) && formOffers.length > 0;
  const first = formOffers[0] || {};
  const second = formOffers[1] || first;
  const third = formOffers[2] || second;
  const offerPrice = (offer: any) => Number(offer.price_adult ?? offer.price_per_adult ?? content.price_per_adult ?? 0);
  const tiers: Record<Tier, number> = {economic: offerPrice(first), standard: offerPrice(second), premium: offerPrice(third)};
  const tierSummary = {economic: l10n(first.title || first.name || "Economic selection"), standard: l10n(second.title || second.name || "Recommended selection"), premium: l10n(third.title || third.name || "Premium selection")};
  const tierNames = tierSummary;
  const assignmentRows = content.offer_assignments?.included || [];
  const features = (Array.isArray(content.included) ? content.included : []).filter(Boolean).map((label: string, index: number) => {
    const assigned = assignmentRows[index] || ["*"];
    const includedIn = (offerId: string) => assigned.includes("*") || assigned.includes(offerId);
    return {id: `included-${index}`, label: l10n(label), tiers: {economic: includedIn(first.id || "economic"), standard: includedIn(second.id || "recommended"), premium: includedIn(second.id || "recommended")}};
  });
  const title = l10n(trek.title || "Untitled trek");
  const summary = l10n(trek.seo?.meta_description || overview[0]?.en || trek.title);
  const category = l10n(trek.category_name || "Trek");
  return {
    id: trek.id, slug: trek.slug, title, category, summary, image: trek.cover_image || "/images/tour-agafay.jpg",
    destination: l10n(content.pickup_area_city || content.start_location || "Morocco"), startPlace: l10n(content.start_location || content.pickup_area_city || "Morocco"),
    duration: l10n(content.duration_custom || content.duration || `${durationDays} days`), durationDays: durationDays > 1 ? durationDays : undefined, durationNights: durationDays > 1 ? durationDays - 1 : undefined,
    recommendedTier: "standard", seo: {title: trek.seo?.meta_title || trek.title, description: trek.seo?.meta_description || summary.en},
    pricing: offerPricing ? {kind: "offers", unit: "person", tiers, features, tierSummary, tierNames} : {kind: "single", unit: "person", amount: Number(content.price_per_adult || 0)},
    details: {layout: durationDays > 1 ? "multi-day" : "day-tour", highlights: (Array.isArray(content.highlights) ? content.highlights : []).filter(Boolean).map(l10n), overview: overview.length ? overview : [summary], ...(durationDays > 1 ? {days} : {steps}), included: (Array.isArray(content.included) ? content.included : []).filter(Boolean).map(l10n), notIncluded: (Array.isArray(content.not_included) ? content.not_included : []).filter(Boolean).map(l10n), meeting: l10n(content.start_location || ""), bring: [], goodToKnow: [content.pickup_note, content.pickup_important_info].filter(Boolean).map(l10n), faqs: []},
  } as TourRecord;
}

export async function loadTourBySlug(slug: string): Promise<TourRecord> {
  try {
    const base = (process.env.API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
    const response = await fetch(`${base}/API/V1/treks/public/${encodeURIComponent(slug)}`, {cache: "no-store"});
    if (response.ok) {
      const result = await response.json();
      if (result?.trek) return trekToTour(result.trek);
    }
  } catch { /* Keep static tour pages available when the trek API is unreachable. */ }
  const staticTour = allTourRecords.find((tour) => tour.slug === slug);
  if (staticTour) return staticTour;
  return notFound();
}
