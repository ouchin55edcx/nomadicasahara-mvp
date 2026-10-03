import type { MetadataRoute } from "next";

import { siteUrl } from "@/components/seo/JsonLd";
import { allContent } from "@/content/landing/all";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: allContent.seo.updatedAt,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
