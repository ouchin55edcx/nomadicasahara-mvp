import type {Locale} from "@/i18n/routing";

export type L10n = Record<Locale, string>;
export type Tier = "economic" | "standard" | "premium";
export type DetailLayout = "day-tour" | "multi-day" | "wellness" | "service";
export type PriceUnit = "person" | "vehicle" | "group" | "ticket";
export type MealType = "breakfast" | "lunch" | "dinner";

export type Feature = {
  id: string;
  label: L10n;
  tiers: Record<Tier, boolean | L10n>;
};

export type Step = {
  time?: string;
  title: L10n;
  text: L10n;
  duration?: L10n;
  onlyTiers?: Tier[];
};

export type Day = {
  day: number;
  title: L10n;
  from: L10n;
  to: L10n;
  text: L10n;
  highlights: L10n[];
  overnight?: L10n;
  meals?: MealType[];
};

export type Stay = {nights: number[]; name: L10n; type: L10n; board: L10n};

export type Pricing =
  | {kind: "offers"; unit: PriceUnit; tiers: Record<Tier, number>; features: Feature[]; tierSummary: Record<Tier, L10n>}
  | {kind: "single"; unit: PriceUnit; amount: number}
  | {kind: "quote"};

export type TourFaq = {q: L10n; a: L10n};

export type TourDetails = {
  layout: DetailLayout;
  places?: {id: string; name: L10n}[];
  leadTitle?: L10n;
  highlights: L10n[];
  overview: L10n[];
  steps?: Step[];
  days?: Day[];
  included: L10n[];
  notIncluded: L10n[];
  meeting?: L10n;
  bring?: L10n[];
  goodToKnow?: L10n[];
  faqs: TourFaq[];
};

export type TourRecord = {
  id: string;
  slug: string;
  title: L10n;
  category: L10n;
  summary: L10n;
  image: string;
  destination: L10n;
  startPlace?: L10n;
  duration: L10n;
  durationDays?: number;
  durationNights?: number;
  recommendedTier?: Tier;
  stays?: Record<Tier, Stay[]>;
  transferAddon?: boolean;
  pricing: Pricing;
  details: TourDetails;
};
