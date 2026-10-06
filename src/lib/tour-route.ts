import {existsSync} from "node:fs";
import path from "node:path";
import {notFound, permanentRedirect} from "next/navigation";
import {routing, type Locale} from "@/i18n/routing";
import {allTourRecords} from "@/data/static/tour-catalog";
import {getTierForSlug} from "@/lib/tour-catalog";
import {localizedTourPath} from "@/lib/hrefs";
import type {Tier, TourRecord} from "@/types/tour-catalog";

export function isLocale(value: string): value is Locale {
  return routing.locales.some((locale) => locale === value);
}

export function getTourPhotos(id: string): string[] {
  return Array.from({length: 6}, (_, index) => index + 1)
    .map((number) => `/images/tours/${id}/${number}.jpg`)
    .filter((src) => existsSync(path.join(process.cwd(), "public", src.slice(1))));
}

export function resolveTour(slug: string): TourRecord {
  const tour = allTourRecords.find((item) => item.slug === slug);
  if (!tour) notFound();
  return tour;
}

export function resolveTier(slug: string, locale: Locale, tour: TourRecord): Tier {
  const tier = getTierForSlug(locale, slug);
  if (tier) return tier;
  const equivalent = routing.locales.map((candidate) => getTierForSlug(candidate, slug)).find((candidate) => candidate !== undefined);
  if (equivalent && tour.pricing.kind === "offers") permanentRedirect(localizedTourPath(locale, tour, "tier", equivalent));
  notFound();
}
