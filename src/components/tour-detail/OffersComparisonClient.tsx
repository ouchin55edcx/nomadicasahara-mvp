"use client";

import Image from "next/image";
import {useEffect, useMemo, useRef, useState} from "react";
import {useSearchParams} from "next/navigation";
import {BedDouble, BusFront, Check, ChevronDown, Minus, Plus, X} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Link, useRouter} from "@/i18n/navigation";
import {calculatePrice, formatPrice, type TransferTier} from "@/lib/pricing";
import type {BookingHref, OfferDetailHref} from "@/lib/hrefs";
import type {Locale} from "@/i18n/routing";
import type {Feature, Tier, TourRecord} from "@/types/tour-catalog";
import type {OfferQueryState} from "@/lib/tour-query";

const tiers: Tier[] = ["economic", "standard", "premium"];
type OfferTour = TourRecord & {pricing: Extract<TourRecord["pricing"], {kind: "offers"}>};
type Labels = {
  morocco: string; departsFrom: string; change: string; date: string; travelers: string; selectDate: string;
  totalFor: string; priceBreakdown: string; baseTour: string; arrivalTransfer: string; departureTransfer: string;
  differences: string; recommended: string; travelStyle: string; whereSleep: string; nights: string; board: string;
  included: string; transfers: string; arrivalLeg: string; departureLeg: string; none: string; details: string;
  book: string; yes: string; no: string; previous: string; next: string;
  guesthouse: string; priceUnit: string; groupUnit: string; ticketUnit: string; info: string; standardVehicle: string; premiumVehicle: string;
  arrivalDate: string; totalLabel: string; perPerson: string; destination: string; night: string;
  home: string; allTours: string;
};

function featureText(feature: Feature, tier: Tier, locale: Locale, yes: string, no: string) {
  const value = feature.tiers[tier];
  if (value === false) return {included: false, text: `${feature.label[locale]}: ${no}`};
  if (value === true) return {included: true, text: `${feature.label[locale]}: ${yes}`};
  return {included: true, text: `${feature.label[locale]}: ${value[locale]}`};
}

export default function OffersComparisonClient({tour, locale, slug, images, stayImages, transferPrices, initialState, detailHrefs, bookingHrefs, labels, tierLabels}: {
  tour: OfferTour; locale: Locale; slug: string; images: string[]; stayImages: Record<Tier, (string | null)[]>;
  transferPrices: Record<Tier, number>; initialState: OfferQueryState; detailHrefs: Record<Tier, OfferDetailHref>;
  bookingHrefs: Record<Tier, BookingHref>; labels: Labels; tierLabels: Record<Tier, string>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState(initialState);
  const [footerVisible, setFooterVisible] = useState(false);
  const visibleTiers: Tier[] = (tour.recommendedTier ?? "standard") === "economic" ? ["economic", "standard"] : ["economic", tour.recommendedTier ?? "standard"];
  const pricing = tour.pricing;
  const currentImage = images[0] || tour.image;
  const isCircuit = tour.details.layout === "multi-day";
  const today = new Date().toLocaleDateString("en-CA");

  useEffect(() => {
    const read = searchParams;
    const count = Number(read.get("travelers"));
    const next: OfferQueryState = {
      date: read.get("date") && /^\d{4}-\d{2}-\d{2}$/.test(read.get("date")!) ? read.get("date")! : "",
      travelers: Number.isInteger(count) && count >= 1 && count <= 20 ? count : 2,
      arrival: isCircuit && ["none", ...tiers].includes(read.get("arrival") ?? "none") ? (read.get("arrival") ?? "none") as TransferTier : "none",
      departure: isCircuit && ["none", ...tiers].includes(read.get("departure") ?? "none") ? (read.get("departure") ?? "none") as TransferTier : "none",
      diff: read.get("diff") === "1",
    };
    setState((current) => JSON.stringify(current) === JSON.stringify(next) ? current : next);
  }, [searchParams, isCircuit]);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting));
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  function updateState(patch: Partial<OfferQueryState>) {
    const next = {...state, ...patch};
    setState(next);
    router.replace({pathname: "/tours/[slug]/offers", params: {slug}, query: {
      date: next.date || undefined,
      travelers: String(next.travelers),
      arrival: isCircuit ? next.arrival : undefined,
      departure: isCircuit ? next.departure : undefined,
      diff: next.diff ? "1" : undefined,
    }}, {scroll: false});
  }

  const activeResult = (tier: Tier) => calculatePrice({unit: pricing.unit, tierPrice: pricing.tiers[tier], travelers: state.travelers, arrival: state.arrival, departure: state.departure, transferPrices});
  const commonQuery = {date: state.date || undefined, travelers: String(state.travelers), arrival: state.arrival, departure: state.departure};
  const bookingHref = (tier: Tier) => ({...bookingHrefs[tier], query: commonQuery});
  const detailHref = (tier: Tier) => ({...detailHrefs[tier], query: commonQuery});

  const differingFeatures = useMemo(() => new Set(pricing.features.filter((feature) => {
    const values = tiers.map((tier) => JSON.stringify(feature.tiers[tier]));
    return new Set(values).size > 1;
  }).map((feature) => feature.id)), [pricing.features]);
  const shownFeatures = pricing.features.filter((feature) => !state.diff || differingFeatures.has(feature.id));

  function changeTravelerCount(amount: number) {
    updateState({travelers: Math.min(20, Math.max(1, state.travelers + amount))});
  }

  const durationEyebrow = `${labels.morocco} · ${tour.duration[locale]}`;

  function StaySection({tier}: {tier: Tier}) {
    const stays = tour.stays?.[tier] ?? [];
    if (!isCircuit || !stays.length) return <div className="package-row" />;
    return <section className="package-row border-t border-line px-4 py-4">
      <h3 className="text-xs font-bold uppercase tracking-wide text-[#333]">{labels.whereSleep}</h3>
      <ul className="mt-3 space-y-3">{stays.map((stay, index) => {
        const src = stayImages[tier]?.[index];
        return <li key={`${stay.name.en}-${index}`} className="flex gap-3 border-b border-line pb-3 last:border-0 last:pb-0">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-line bg-gradient-to-br from-[#EAF6D6] via-[#929547] to-[#006D41]">
            {src ? <Image src={src} alt={stay.name[locale]} fill sizes="64px" className="object-cover" /> : <span aria-hidden="true" className="absolute inset-0 grid place-items-center text-white"><BedDouble className="h-6 w-6" /></span>}
          </div>
          <div className="min-w-0 flex-1"><p className="text-xs font-bold leading-4">{stay.name[locale]}</p><p className="mt-1 text-[10px] leading-4 text-muted">{stay.type[locale]} · {stay.nights.map((night) => labels.night.replace("{number}", String(night))).join(", ")}</p><p className="text-[10px] leading-4 text-muted">{labels.board}: {stay.board[locale]}</p></div>
        </li>;
      })}</ul>
    </section>;
  }

  function TransferOptions({leg, tier, mobile}: {leg: "arrival" | "departure"; tier: Tier; mobile: boolean}) {
    const selected = state[leg];
    const legLabel = leg === "arrival" ? labels.arrivalLeg : labels.departureLeg;
    const labelBase = leg === "arrival" ? labels.arrivalTransfer : labels.departureTransfer;
    const options: TransferTier[] = ["none", "standard", "premium"];
    return <fieldset className="mt-3 border-t border-line pt-3">
      <legend className="mb-2 text-[10px] font-semibold text-[#444]">{legLabel}</legend>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">{options.map((option) => {
        const id = `${mobile ? "mobile" : "desktop"}-${tier}-${leg}-${option}`;
        const label = option === "none" ? labels.none : `${option === "standard" ? labels.standardVehicle : labels.premiumVehicle} · ${formatPrice(locale, transferPrices[option])}`;
        return <label key={option} htmlFor={id} className={`flex min-h-8 cursor-pointer items-center gap-1.5 border px-2 py-1 text-[9px] leading-3 ${selected === option ? "border-[#006D41] bg-[#EAF6D6] text-[#222]" : "border-line bg-white text-[#555]"}`}>
          <input id={id} type="radio" name={`${mobile ? "mobile" : "desktop"}-${leg}`} value={option} checked={selected === option} onChange={() => updateState({[leg]: option})} className="h-3 w-3 accent-[#67B500]" />
          <span>{label}</span>
        </label>;
      })}</div>
      <span className="sr-only">{labelBase}</span>
    </fieldset>;
  }

  function PriceInfo({tier}: {tier: Tier}) {
    const breakdown = activeResult(tier);
    return <Popover>
      <PopoverTrigger asChild><Button type="button" variant="outline" size="icon" aria-label={`${labels.info}: ${formatPrice(locale, breakdown.total)}`} className="h-7 w-7 min-h-0 rounded-full border-[#006D41] p-0 text-[11px] font-bold normal-case text-[#006D41]">i</Button></PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-4 text-xs">
        <p className="font-bold">{labels.priceBreakdown}</p>
        <dl className="mt-3 space-y-2">
          <div className="flex justify-between gap-3"><dt>{labels.baseTour}{pricing.unit === "person" || pricing.unit === "ticket" ? ` × ${state.travelers}` : ""}</dt><dd className="font-semibold">{formatPrice(locale, breakdown.baseTotal)}</dd></div>
          {breakdown.arrivalTotal ? <div className="flex justify-between gap-3"><dt>{labels.arrivalTransfer}</dt><dd className="font-semibold">{formatPrice(locale, breakdown.arrivalTotal)}</dd></div> : null}
          {breakdown.departureTotal ? <div className="flex justify-between gap-3"><dt>{labels.departureTransfer}</dt><dd className="font-semibold">{formatPrice(locale, breakdown.departureTotal)}</dd></div> : null}
          <div className="flex justify-between gap-3 border-t border-line pt-2"><dt className="font-bold">{labels.totalFor.replace("{travelers}", String(state.travelers))}</dt><dd className="font-bold text-[#006D41]">{formatPrice(locale, breakdown.total)}</dd></div>
        </dl>
      </PopoverContent>
    </Popover>;
  }

  function TierCard({tier, mobile = false}: {tier: Tier; mobile?: boolean}) {
    const breakdown = activeResult(tier);
    const recommended = (tour.recommendedTier ?? "standard") === tier;
    const chips = pricing.features.filter((feature) => feature.tiers[tier] !== false).slice(0, 3);
    const travel = pricing.features.find((feature) => /travel|vehicle|transport/i.test(feature.id));
    const unitLabel = pricing.unit === "person" ? labels.perPerson : pricing.unit === "ticket" ? labels.ticketUnit : pricing.unit === "group" ? labels.groupUnit : labels.priceUnit;
    return <article className={`package-comparison-card overflow-visible border border-line bg-white ${recommended ? "border-[#006D41]" : ""}`}>
      <header className={`package-tier-header z-20 flex min-h-[83px] items-start justify-between gap-3 border-b border-line px-4 py-3 ${tier === "economic" ? "bg-[#F2F0E3] text-black" : tier === "standard" ? "bg-[#006D41] text-white" : "bg-black text-[#67B500]"} ${mobile ? "" : "lg:sticky lg:top-[72px]"}`}>
        <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-bold leading-4">{tierLabels[tier]}</h2>{recommended ? <span className={`inline-flex rounded-sm px-2 py-0.5 text-[9px] font-bold uppercase ${tier === "premium" ? "bg-[#67B500] text-black" : "bg-[#EAF6D6] text-[#006D41]"}`}>{labels.recommended}</span> : null}</div><p className="mt-2 line-clamp-2 text-sm leading-5" style={{fontFamily: "Playball, cursive"}}>{pricing.tierSummary[tier][locale]}</p></div>
        <div className="flex shrink-0 flex-col items-end gap-1"><PriceInfo tier={tier}/><p className="text-[9px] opacity-80">{labels.totalFor.replace("{travelers}", String(state.travelers))}</p><p className="text-lg font-extrabold leading-5">{formatPrice(locale, breakdown.total)}</p></div>
      </header>
      <div className="package-row border-b border-line p-4"><div className="flex items-end justify-between gap-2"><span className="text-[10px] font-semibold text-muted">{unitLabel}</span><span className="text-xs font-bold text-[#006D41]">{formatPrice(locale, breakdown.baseUnitPrice)} {unitLabel}</span></div>
        <div className="mt-3 flex flex-wrap gap-1.5">{chips.map((feature) => <span key={feature.id} className="inline-flex max-w-full items-center gap-1 border border-[#B7D8A2] px-2 py-1 text-[9px] leading-3 text-[#333]"><Check className="h-3 w-3 shrink-0 text-[#006D41]"/><span className="line-clamp-2">{featureText(feature, tier, locale, labels.yes, labels.no).text}</span></span>)}</div>
        <div className="mt-3 grid grid-cols-2 gap-2"><Link href={detailHref(tier)} className="btn-accent-outline min-h-9 px-2 py-2 text-[10px]">{labels.details}</Link><Link href={bookingHref(tier)} className="btn-accent min-h-9 px-2 py-2 text-[10px]">{labels.book}</Link></div>
      </div>
      {isCircuit ? <StaySection tier={tier}/> : <div className="package-row border-t border-line px-4 py-4"/>}
      <section className="package-row border-t border-line px-4 py-4"><h3 className="text-xs font-bold uppercase tracking-wide text-[#333]">{labels.travelStyle}</h3><p className="mt-3 flex items-center gap-2 text-xs leading-4"><BusFront className="h-4 w-4 shrink-0 text-[#006D41]"/><span>{travel ? featureText(travel, tier, locale, labels.yes, labels.no).text : tour.category[locale]}</span></p></section>
      <section className="package-row border-t border-line px-4 py-4"><h3 className="text-xs font-bold uppercase tracking-wide text-[#333]">{labels.included}</h3><ul className="mt-2">{shownFeatures.map((feature) => {
        const value = feature.tiers[tier];
        const included = value !== false;
        const text = typeof value === "boolean" ? feature.label[locale] : `${feature.label[locale]}: ${value[locale]}`;
        return <li key={feature.id} className="flex items-start gap-2 border-t border-line py-2 text-[10px] leading-4"><span className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${included ? "bg-[#EAF6D6] text-[#006D41]" : "bg-[#F3F3F3] text-[#777]"}`}>{included ? <Check className="h-3 w-3"/> : <X className="h-3 w-3"/>}</span><span className={included ? "text-[#333]" : "text-muted"}>{text}</span></li>;
      })}</ul></section>
      {tour.transferAddon ? <section className="package-row border-t border-line px-4 py-4"><h3 className="text-xs font-bold uppercase tracking-wide text-[#333]">{labels.transfers}</h3><TransferOptions leg="arrival" tier={tier} mobile={mobile}/><TransferOptions leg="departure" tier={tier} mobile={mobile}/></section> : <div className="package-row border-t border-line px-4 py-4"/>}
      <div className="package-row border-t border-line p-4"><Link href={bookingHref(tier)} className="btn-accent flex min-h-10 w-full items-center justify-center gap-1 text-[11px]">{labels.book}<ChevronDown className="h-3.5 w-3.5 rotate-[-90deg]"/></Link></div>
    </article>;
  }

  const metaDate = state.date || labels.selectDate;
  const activePricing = activeResult(visibleTiers[1]);

  return <div className="pb-28 lg:pb-0">
    <nav aria-label={`${labels.home} / ${labels.allTours}`} className="mb-2 flex flex-wrap items-center gap-2 text-[11px] text-muted"><Link href="/" className="hover:text-[#006D41]">{labels.home}</Link><span aria-hidden="true">›</span><Link href="/tours" className="hover:text-[#006D41]">{labels.allTours}</Link><span aria-hidden="true">›</span><span aria-current="page" className="text-[#333]">{tour.title[locale]}</span></nav>
    <section className="mb-3 border border-line bg-white px-4 py-4 sm:px-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#006D41]">{durationEyebrow}</p>
      <div className="mt-1 flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><h1 className="text-2xl font-bold leading-tight sm:text-3xl">{tour.title[locale]}</h1><p className="mt-1 text-sm leading-5 text-[#555]" style={{fontFamily: "Playball, cursive"}}>{tour.summary[locale]}</p></div>
        <Popover><PopoverTrigger asChild><Button variant="outline" size="sm" className="shrink-0 border-[#67B500] text-[#006D41]">{labels.change}</Button></PopoverTrigger><PopoverContent align="end" className="w-[min(90vw,330px)] p-4">
          <label className="block text-xs font-semibold" htmlFor="trip-date">{labels.date}<input id="trip-date" type="date" min={today} value={state.date} onChange={(event) => updateState({date: event.target.value})} className="mt-1.5 h-10 w-full border border-line px-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006D41]"/></label>
          <div className="mt-4 flex items-center justify-between"><span className="text-xs font-semibold">{labels.travelers}</span><div className="flex items-center gap-3"><Button variant="outline" size="icon" aria-label={labels.previous} disabled={state.travelers <= 1} onClick={() => changeTravelerCount(-1)}><Minus className="h-3.5 w-3.5"/></Button><span className="min-w-5 text-center text-sm font-bold tabular-nums">{state.travelers}</span><Button variant="outline" size="icon" aria-label={labels.next} disabled={state.travelers >= 20} onClick={() => changeTravelerCount(1)}><Plus className="h-3.5 w-3.5"/></Button></div></div>
        </PopoverContent></Popover>
      </div>
      <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-line pt-2 text-[11px] text-[#555]"><span>{labels.departsFrom} {tour.startPlace?.[locale] ?? tour.destination[locale]}</span><span aria-hidden="true">|</span><span>{metaDate}</span><span aria-hidden="true">|</span><span>{state.travelers} {labels.travelers.toLowerCase()}</span></p>
    </section>

    <div className="relative h-[170px] overflow-hidden bg-gradient-to-r from-[#006D41] via-[#929547] to-[#67B500] sm:h-[230px] lg:h-[270px]">
      {currentImage ? <Image src={currentImage} alt={`${tour.destination[locale]} — ${tour.title[locale]}`} fill priority sizes="100vw" className="object-cover"/> : <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(103,181,0,.7),_transparent_60%),linear-gradient(115deg,#006D41,#929547)]"/>}
      <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/10"/>
    </div>

    <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-b border-line pb-2"><label className="flex min-h-10 cursor-pointer items-center gap-2 text-xs font-medium"><input type="checkbox" checked={state.diff} onChange={(event) => updateState({diff: event.target.checked})} className="h-4 w-4 accent-[#67B500]"/>{labels.differences}</label></div>
    <div className="package-comparison-grid mt-2 grid">{visibleTiers.map((tier) => <TierCard key={tier} tier={tier}/>)}</div>

    {!footerVisible ? <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-20px_rgba(0,0,0,.5)] backdrop-blur lg:hidden"><div className="mx-auto flex max-w-2xl items-center justify-between gap-3"><span className="min-w-0"><b className="block truncate text-base">{formatPrice(locale, activePricing.total)}</b><span className="text-[10px] text-muted">{labels.totalFor.replace("{travelers}", String(state.travelers))}</span></span><Link href={bookingHref(visibleTiers[1])} className="btn-accent min-h-10 shrink-0 px-5 py-2 text-[11px]">{labels.book}</Link></div></div> : null}
  </div>;
}
