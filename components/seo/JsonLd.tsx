import type { FaqItem } from "@/content/landing/types";

export const siteUrl = "https://nomadicasahara.com";

type Json = Record<string, unknown>;

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export default function JsonLd({ data }: { data: Json | Json[] }) {
  const payload = Array.isArray(data) ? { "@context": "https://schema.org", "@graph": data } : data;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function breadcrumbListSchema(
  items: { name: string; path: string }[],
): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqPageSchema(faq: FaqItem[]): Json {
  return {
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function organizationSchema(): Json {
  return {
    "@type": "TravelAgency",
    "@id": absoluteUrl("/#organization"),
    name: "Nomadica Sahara",
    url: siteUrl,
    telephone: "+34 913300732",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Madrid",
      addressCountry: "ES",
    },
    areaServed: ["ES", "PT", "MA"],
  };
}

export function webPageSchema(input: {
  path: string;
  name: string;
  description: string;
  updatedAt: string;
}): Json {
  return {
    "@type": "WebPage",
    "@id": absoluteUrl(`${input.path}#webpage`),
    url: absoluteUrl(input.path),
    name: input.name,
    description: input.description,
    isPartOf: { "@id": absoluteUrl("/#website") },
    inLanguage: "es-ES",
    dateModified: input.updatedAt,
  };
}
