import {notFound, permanentRedirect} from "next/navigation";
import {routing, type Locale} from "@/i18n/routing";
import {getTierForSlug} from "@/lib/tour-catalog";
import {localizedTourPath} from "@/lib/hrefs";
import type {Tier, TourRecord} from "@/types/tour-catalog";

export function isLocale(value: string): value is Locale {
  return routing.locales.some((locale) => locale === value);
}

export function resolveTier(slug: string, locale: Locale, tour: TourRecord): Tier {
  const tier = getTierForSlug(locale, slug);
  if (tier) return tier;
  const equivalent = routing.locales.map((candidate) => getTierForSlug(candidate, slug)).find((candidate) => candidate !== undefined);
  if (equivalent && tour.pricing.kind === "offers") permanentRedirect(localizedTourPath(locale, tour, "tier", equivalent));
  notFound();
}
