import type {MetadataRoute} from "next";

import {allTourRecords} from "@/data/static/tour-catalog";
import {categories, cities, type TourCategory, type TourCity} from "@/data/tour-taxonomy";
import {routing, type Locale} from "@/i18n/routing";
import {siteUrl} from "@/lib/seo/metadata";
import {localizedCategoryPath, localizedCityPath, localizedTourPath} from "@/lib/hrefs";

const locales: readonly Locale[] = routing.locales;
const infoPaths: Record<string, Record<Locale, string>> = {
  about: {en: "/about", es: "/sobre-nosotros", pt: "/sobre"},
  contact: {en: "/contact", es: "/contacto", pt: "/contacto"},
  help: {en: "/help", es: "/ayuda", pt: "/ajuda"},
  terms: {en: "/terms", es: "/condiciones", pt: "/termos"},
  privacy: {en: "/privacy", es: "/privacidad", pt: "/privacidade"},
};
const modified = new Date("2026-10-05");

function localizedEntries(paths: Record<Locale, string>, priority: number, changeFrequency: "daily" | "weekly" | "monthly") {
  const urlFor = (locale: Locale) => paths[locale].startsWith(`/${locale}/`) || paths[locale] === `/${locale}`
    ? `${siteUrl}${paths[locale]}`
    : `${siteUrl}/${locale}${paths[locale]}`;
  const alternates = Object.fromEntries(locales.map((locale) => [locale, urlFor(locale)]));
  return locales.map((locale) => ({
    url: alternates[locale],
    lastModified: modified,
    changeFrequency,
    priority,
    alternates: {languages: alternates},
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = [
    localizedEntries({en: "/", es: "/", pt: "/"}, 1, "weekly"),
    localizedEntries({en: "/tours", es: "/excursiones", pt: "/passeios"}, 0.9, "daily"),
    ...Object.keys(infoPaths).map((key) => localizedEntries(infoPaths[key], 0.5, "monthly")),
  ].flat();

  const categoryEntries = (Object.keys(categories) as TourCategory[]).flatMap((category) => {
    const paths = Object.fromEntries(locales.map((locale) => [locale, localizedCategoryPath(locale, category)])) as Record<Locale, string>;
    return localizedEntries(paths, 0.8, "weekly");
  });
  const cityEntries = (Object.keys(cities) as TourCity[]).flatMap((city) => {
    const paths = Object.fromEntries(locales.map((locale) => [locale, localizedCityPath(locale, city)])) as Record<Locale, string>;
    return localizedEntries(paths, 0.75, "weekly");
  });
  const tourEntries = allTourRecords.flatMap((tour) => {
    const mode = tour.pricing.kind === "offers" ? "offers" : "detail";
    const paths = Object.fromEntries(locales.map((locale) => [locale, localizedTourPath(locale, tour, mode)])) as Record<Locale, string>;
    return localizedEntries(paths, tour.pricing.kind === "offers" ? 0.75 : 0.65, "weekly");
  });

  return [...staticEntries, ...categoryEntries, ...cityEntries, ...tourEntries];
}
