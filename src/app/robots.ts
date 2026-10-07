import type {MetadataRoute} from "next";

import {siteUrl} from "@/lib/seo/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Partner portal and customer account areas are never indexed.
        disallow: [
          "/*/partner/",
          "/*/book/",
          "/*/reservar/",
          "/*/dashboard/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
