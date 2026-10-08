import {allTourRecords} from "@/data/static/tour-catalog";
import type {Locale} from "@/i18n/routing";
import type {Pricing, Tier, TourRecord} from "@/types/tour-catalog";

export const offerSlugs: Record<Locale, Record<Tier, string>> = {
  en: {economic: "economic", standard: "standard", premium: "premium"},
  es: {economic: "economico", standard: "estandar", premium: "premium"},
  pt: {economic: "economico", standard: "padrao", premium: "premium"},
};

export function buildOfferId(tour: TourRecord, tier?: Tier): string {
  if (tour.pricing.kind === "quote") throw new Error("Quote-only tours cannot be booked directly.");
  if (tour.pricing.kind === "offers" && !tier) throw new Error("An offer tier is required for this tour.");
  if (tour.pricing.kind === "single" && tier) throw new Error("Single-price tours do not have offer tiers.");
  return `${tour.id}--${tour.pricing.kind === "single" ? "base" : tier}`;
}

export type ParsedOfferId = {tour: TourRecord; tier: Tier | "base"; price: number; pricing: Exclude<Pricing, {kind: "quote"}>};

export function getTourById(id: string): TourRecord | undefined {
  return allTourRecords.find((tour) => tour.id === id);
}

export function getAirportTransferPrices(): Record<Tier, number> {
  const transfer = getTourById("marrakech-airport-transfer");
  if (!transfer || transfer.pricing.kind !== "offers") throw new Error("The Marrakech airport transfer tiers are required to price circuit add-ons.");
  return transfer.pricing.tiers;
}

export function getTierForSlug(locale: Locale, slug: string): Tier | undefined {
  return (Object.keys(offerSlugs[locale]) as Tier[]).find((tier) => offerSlugs[locale][tier] === slug);
}

export function getOfferPrice(tour: TourRecord, tier?: Tier): number | undefined {
  if (tour.pricing.kind === "single") return tour.pricing.amount;
  return tour.pricing.kind === "offers" && tier ? tour.pricing.tiers[tier] : undefined;
}
