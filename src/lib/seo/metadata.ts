import type {Metadata} from "next";

import {routing, type Locale} from "@/i18n/routing";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://nomadicasahara.com"
).replace(/\/+$/, "");

export function localePath(locale: string, pathname = "") {
  const clean = pathname === "/" ? "" : pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `/${locale}${clean}` as const;
}

export function absoluteUrl(locale: string, pathname = "") {
  return `${siteUrl}${localePath(locale, pathname)}`;
}

function localizedPathname(locale: string, pathname = "") {
  const route = routing.pathnames[pathname as keyof typeof routing.pathnames];
  if (!route) return pathname;
  if (typeof route === "string") return route;
  return (route as Record<string, string>)[locale] ?? pathname;
}

/**
 * hreflang map for one locale-independent pathname, e.g.
 * { es: "https://…/es/excursiones", en: "…/en/tours", pt: "…/pt/passeios" }
 */
export function languageAlternates(pathname = "") {
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, absoluteUrl(locale, localizedPathname(locale, pathname))]),
  );
}

/** Canonical + hreflang + OG in one call, so no page forgets the alternates. */
export function pageMetadata({
  locale,
  pathname,
  title,
  description,
  image = "/images/hero.jpg",
  noindex = false,
}: {
  locale: string;
  pathname?: string;
  title: string;
  description: string;
  image?: string;
  noindex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(locale, localizedPathname(locale, pathname)),
      languages: languageAlternates(pathname),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(locale, localizedPathname(locale, pathname)),
      siteName: "Nomadica Sahara",
      locale: ogLocale(locale as Locale),
      type: "website",
      images: [{url: image, alt: title}],
    },
    ...(noindex ? {robots: {index: false, follow: false}} : {}),
  };
}

/** BCP-47 tags for hreflang / og:locale. */
export function ogLocale(locale: Locale) {
  return locale === "en" ? "en_US" : locale === "pt" ? "pt_PT" : "es_ES";
}
