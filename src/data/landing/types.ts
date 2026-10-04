export type Tile = {
  title: string;
  description: string;
  /** Optional: tiles without an href render as plain cards, not links. */
  href?: string;
  image?: string;
  alt?: string;
  icon?:
    | "pool"
    | "spa"
    | "family"
    | "adults"
    | "star"
    | "riad"
    | "wave"
    | "tent"
    | "car"
    | "chat"
    | "guide"
    | "hotel"
    | "lotus"
    | "shield"
    | "tag"
    | "users"
    | "wallet";
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type QuickFact = {
  label: string;
  value: string;
};

export type TrustItem = {
  title: string;
  description: string;
};

export type SeoSection = {
  heading: string;
  body: string[];
};

export type SeoBlock = {
  heading: string;
  intro: string;
  sections: SeoSection[];
};

export type PageContent = {
  slug: string;
  seo: {
    title: string;
    description: string;
    canonical: string;
    keywords: string;
    ogImage: string;
    updatedAt: string;
  };
  quickFacts: QuickFact[];
  trust: TrustItem[];
  faq: FaqItem[];
  seoText: SeoBlock;
  cta: {
    title: string;
    body: string;
    ctaLabel: string;
  };
  stickyCta: {
    label: string;
    priceFrom?: number;
  };
};

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}
