import type {Locale} from "@/i18n/routing";
import {cities, cityFromAnySlug, categories, categoryFromAnySlug, type TourCategory, type TourCity} from "@/data/tour-taxonomy";
import {buildOfferId, getTierForSlug, offerSlugs} from "@/lib/tour-catalog";
import type {Tier, TourRecord} from "@/types/tour-catalog";

export type {TourCategory, TourCity};
export type CategoryHref = {pathname: "/tours/category/[category]"; params: {category: string}};
export type DestinationHref = {pathname: "/tours/city/[city]"; params: {city: string}};
export type TourIndexHref = {pathname: "/tours"};

export type TourDetailHref = {pathname: "/tours/[slug]"; params: {slug: string}};
export type OffersHref = {pathname: "/tours/[slug]/offers"; params: {slug: string}};
export type OfferDetailHref = {pathname: "/tours/[slug]/offers/[offer]"; params: {slug: string; offer: string}};
export type BookingHref = {pathname: "/book/[offerId]"; params: {offerId: string}};
export type ConfirmationHref = {pathname: "/book/[offerId]/confirmation"; params: {offerId: string}};

export function tourHref(tour: TourRecord): TourDetailHref | OffersHref {
  return tour.pricing.kind === "offers"
    ? {pathname: "/tours/[slug]/offers", params: {slug: tour.slug}}
    : {pathname: "/tours/[slug]", params: {slug: tour.slug}};
}

export function categoryHref(category: TourCategory, locale: Locale): CategoryHref {
  return {pathname: "/tours/category/[category]", params: {category: categories[category].slug[locale]}};
}

export function destinationHref(city: TourCity, locale: Locale): DestinationHref {
  return {pathname: "/tours/city/[city]", params: {city: cities[city].slug[locale]}};
}

export function bookHref(tour: TourRecord, tier?: Tier) {
  return {pathname: "/book/[offerId]", params: {offerId: buildOfferId(tour, tier)}} as const;
}

export function confirmationHref(offerId: string): ConfirmationHref {
  return {pathname: "/book/[offerId]/confirmation", params: {offerId}};
}

export function offerHref(tour: TourRecord, tier: Tier, locale: Locale): OfferDetailHref {
  return {pathname: "/tours/[slug]/offers/[offer]", params: {slug: tour.slug, offer: offerSlugs[locale][tier]}};
}

export function localizedTourPath(locale: Locale, tour: TourRecord, mode: "detail" | "offers" | "tier", tier?: Tier): string {
  const root = locale === "es" ? "excursiones" : locale === "pt" ? "passeios" : "tours";
  const offersSegment = locale === "en" ? "offers" : "ofertas";
  const base = `/${locale}/${root}/${tour.slug}`;
  if (mode === "detail") return base;
  if (mode === "offers") return `${base}/${offersSegment}`;
  if (!tier) throw new Error("A tier is required to build a tier URL.");
  return `${base}/${offersSegment}/${offerSlugs[locale][tier]}`;
}

export function localizedCategoryPath(locale: Locale, category: TourCategory): string {
  const base = locale === "es" ? "/excursiones/categoria" : locale === "pt" ? "/passeios/categoria" : "/tours/category";
  return `/${locale}${base}/${categories[category].slug[locale]}`;
}

export function localizedCityPath(locale: Locale, city: TourCity): string {
  const base = locale === "es" ? "/excursiones/destino" : locale === "pt" ? "/passeios/cidade" : "/tours/city";
  return `/${locale}${base}/${cities[city].slug[locale]}`;
}

export function localizedToursPath(locale: Locale): string {
  return `/${locale}${locale === "es" ? "/excursiones" : locale === "pt" ? "/passeios" : "/tours"}`;
}

export function hrefForLocaleSwitch(pathname: string, routeParams: Record<string, string | string[]>, from: Locale, to: Locale) {
  const params: Record<string, string> = {};
  const keys = [...pathname.matchAll(/\[([^\]]+)\]/g)].map((match) => match[1]);
  for (const key of keys) {
    const value = routeParams[key];
    if (value !== undefined) params[key] = Array.isArray(value) ? value.join("/") : value;
  }
  if (pathname === "/tours/category/[category]" && params.category) {
    const category = categoryFromAnySlug(params.category);
    if (category) params.category = categories[category].slug[to];
  }
  if (pathname === "/tours/city/[city]" && params.city) {
    const city = cityFromAnySlug(params.city);
    if (city) params.city = cities[city].slug[to];
  }
  if (pathname === "/tours/[slug]/offers/[offer]" && params.offer) {
    const tier = getTierForSlug(from, params.offer) ?? (Object.keys(offerSlugs[from]) as Tier[]).find((candidate) => offerSlugs.en[candidate] === params.offer || offerSlugs.es[candidate] === params.offer || offerSlugs.pt[candidate] === params.offer);
    if (tier) params.offer = offerSlugs[to][tier];
  }
  return keys.length ? {pathname, params} : pathname;
}
