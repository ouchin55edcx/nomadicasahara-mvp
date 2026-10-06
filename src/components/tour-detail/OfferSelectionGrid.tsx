"use client";

import {useState} from "react";
import {Check, ChevronRight} from "lucide-react";
import {Link} from "@/i18n/navigation";
import type {Tier} from "@/types/tour-catalog";
import type {BookingHref, OfferDetailHref} from "@/lib/hrefs";

type LocalizedText = {en: string; es: string; pt: string};
type Feature = {id: string; label: LocalizedText; tiers: Record<Tier, boolean | LocalizedText>};

export default function OfferSelectionGrid({
  locale,
  prices,
  summaries,
  features,
  labels,
  detailHrefs,
  bookingHrefs,
}: {
  locale: "en" | "es" | "pt";
  prices: Record<Tier, number>;
  summaries: Record<Tier, LocalizedText>;
  features: Feature[];
  labels: {economic: string; standard: string; premium: string; economicSelection: string; recommended: string; transportSection: string; experienceSection: string; priceUnit: string; viewDetails: string; book: string; yes: string};
  detailHrefs: Record<Tier, OfferDetailHref>;
  bookingHrefs: Record<Tier, BookingHref>;
}) {
  const [chosen, setChosen] = useState<"standard" | "premium">("standard");
  const price = (amount: number) => new Intl.NumberFormat(locale, {style: "currency", currency: "EUR", maximumFractionDigits: 0}).format(amount);
  const included = (tier: Tier) => features.filter((feature) => feature.tiers[tier] !== false);
  const isTransport = (feature: Feature) => /transport|vehicle|pickup|transfer/i.test(feature.id);
  const renderFeatures = (tier: Tier, items: Feature[]) => items.map((feature) => {
    const value = feature.tiers[tier];
    const description = typeof value === "boolean" ? labels.yes : value[locale];
    return <li key={feature.id} className="flex items-center gap-2.5 border-b border-[#E7E7E7] py-2.5 text-xs leading-4 text-[#303030] last:border-0"><Check className="h-3.5 w-3.5 shrink-0 text-[#67B500]"/><span className="min-w-0 flex-1"><b>{feature.label[locale]}</b>{description !== labels.yes ? ` · ${description}` : ""}</span><span className="shrink-0 text-[10px] font-semibold text-[#67B500]">{labels.yes}</span></li>;
  });
  const featureSection = (tier: Tier, title: string, items: Feature[]) => items.length ? <section className="border-t border-[#E6E6E6] px-3 py-3 sm:px-4"><h4 className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#555]">{title}</h4><ul>{renderFeatures(tier, items)}</ul></section> : null;
  const highlights = (tier: Tier) => included(tier).slice(0, 3);
  const packageContent = (tier: Tier) => {
    const enabled = included(tier);
    return <>
      <div className="px-3 py-3 sm:px-4"><p className="mb-2 text-xs leading-4 text-[#555]">{summaries[tier][locale]}</p><ul className="grid gap-1 sm:grid-cols-2">{highlights(tier).map((feature) => <li key={feature.id} className="flex min-h-7 items-center gap-1.5 border border-[#B7D8A2] px-2 py-1 text-[10px] leading-3 text-[#444]"><Check className="h-3 w-3 shrink-0 text-[#67B500]"/><span>{feature.label[locale]}</span></li>)}</ul>
        <div className="mt-3 grid grid-cols-2 gap-1.5"><Link href={detailHrefs[tier]} className="inline-flex min-h-9 items-center justify-center gap-1 border border-[#67B500] px-2 text-[10px] font-bold text-[#67B500] hover:bg-[#F4F9EE]">{labels.viewDetails}<ChevronRight className="h-3 w-3"/></Link><Link href={bookingHrefs[tier]} className="inline-flex min-h-9 items-center justify-center gap-1 bg-[#67B500] px-2 text-[10px] font-bold text-white hover:bg-[#006D41]">{labels.book}<ChevronRight className="h-3 w-3"/></Link></div>
      </div>
      {featureSection(tier, labels.transportSection, enabled.filter(isTransport))}
      {featureSection(tier, labels.experienceSection, enabled.filter((feature) => !isTransport(feature)))}
      <div className="mt-auto border-t border-[#E6E6E6] p-3 sm:px-4"><Link href={bookingHrefs[tier]} className="inline-flex min-h-10 w-full items-center justify-center gap-1 bg-[#67B500] px-3 text-xs font-bold text-white hover:bg-[#006D41]">{labels.book}<ChevronRight className="h-3.5 w-3.5"/></Link></div>
    </>;
  };

  return <section id="offers" className="scroll-mt-24 pb-10 pt-4">
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <article className="overflow-hidden border border-[#E2E2E2] bg-white shadow-sm">
        <div className="flex min-h-[62px] items-center justify-between gap-3 bg-[#F5F5F5] px-4 py-3"><h3 className="max-w-[17ch] text-sm font-bold leading-4 text-[#414141]">{labels.economicSelection}</h3><div className="text-right"><p className="text-[10px] text-[#777]">{labels.priceUnit}</p><p className="text-xl font-bold leading-6 text-[#67B500]">{price(prices.economic)}</p></div></div>
        {packageContent("economic")}
      </article>

      <article className="overflow-hidden border border-[#D9E8CF] bg-white shadow-sm">
        <div className="flex min-h-[62px] items-center justify-between gap-3 bg-[#E7F5D6] px-4 py-3"><div><h3 className="text-sm font-bold leading-4 text-[#414141]">{labels.recommended}</h3><div className="mt-2 flex gap-1.5">{(["standard", "premium"] as const).map((tier) => <button key={tier} type="button" aria-pressed={chosen === tier} onClick={() => setChosen(tier)} className={`min-h-7 border px-2.5 text-[10px] font-bold ${chosen === tier ? "border-[#006D41] bg-[#006D41] text-white" : "border-[#A7C895] bg-white text-[#006D41] hover:bg-[#F4F9EE]"}`}>{tier === "standard" ? labels.standard : labels.premium}</button>)}</div></div><div className="text-right"><p className="text-[10px] text-[#777]">{labels.priceUnit}</p><p className="text-xl font-bold leading-6 text-[#67B500]">{price(prices[chosen])}</p></div></div>
        {packageContent(chosen)}
      </article>
    </div>
  </section>;
}
