import type {MetadataRoute} from "next";

import {catalogConfigs, products} from "@/data/catalog";
import {allContent} from "@/data/landing/all";
import {routing} from "@/i18n/routing";
import {absoluteUrl, languageAlternates} from "@/lib/seo/metadata";

const TOURS = [
  {citySlug: "marrakech-tours", tourSlug: "agafay-quad"},
  {citySlug: "marrakech-tours", tourSlug: "marrakech-essaouira"},
  {citySlug: "essaouira-tours", tourSlug: "essaouira-kitesurf"},
];

const STATIC_PATHS = ["/", "/about"];

function entry(pathname: string, priority: number, changeFrequency: "daily" | "weekly" | "monthly") {
  const alternates = {
    languages: Object.fromEntries(
      Object.entries(languageAlternates(pathname)).map(([locale, url]) => [locale, url]),
    ),
  };

  return routing.locales.map((locale) => ({
    url: absoluteUrl(locale, pathname),
    lastModified: allContent.seo.updatedAt,
    changeFrequency,
    priority,
    alternates,
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const hotels = products.filter((product) => product.type === "hotel");

  return [
    ...STATIC_PATHS.flatMap((pathname) => entry(pathname, 1, "weekly")),
    ...Object.values(catalogConfigs).flatMap((config) =>
      entry(config.path, 0.8, "weekly"),
    ),
    ...hotels.flatMap((hotel) => entry(`/hoteles/${hotel.id}`, 0.7, "weekly")),
    ...TOURS.flatMap(({citySlug, tourSlug}) => entry(`/${citySlug}/${tourSlug}`, 0.7, "monthly")),
    ...TOURS.flatMap(({citySlug, tourSlug}) =>
      entry(`/${citySlug}/${tourSlug}/resumen`, 0.4, "monthly"),
    ),
  ];
}
