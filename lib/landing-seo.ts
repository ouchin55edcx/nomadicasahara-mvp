import type { Metadata } from "next";

import { siteUrl } from "@/components/seo/JsonLd";

export type LandingMetaInput = {
  title: string;
  description: string;
  path: string;
  image: string;
  keywords: string;
  updatedAt: string;
};

/**
 * Metadata shared by every landing page: unique title/description, canonical,
 * Open Graph, Twitter card and hreflang for es/pt/en.
 * The pt/en alternates point to the same path until the next-intl locale
 * routes are in place; `x-default` always resolves to the Spanish page.
 */
export function landingMetadata({
  title,
  description,
  path,
  image,
  keywords,
  updatedAt,
}: LandingMetaInput): Metadata {
  const url = `${siteUrl}${path === "/" ? "" : path}`;
  const imageUrl = `${siteUrl}${image}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
      languages: {
        "es-ES": url,
        "pt-PT": url,
        en: url,
        "x-default": url,
      },
    },
    openGraph: {
      type: "website",
      locale: "es_ES",
      alternateLocale: ["pt_PT", "en"],
      url,
      title,
      description,
      siteName: "Nomadica Sahara",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    other: {
      "article:modified_time": updatedAt,
    },
  };
}