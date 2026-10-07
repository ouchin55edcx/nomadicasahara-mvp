"use client";

import Image from "next/image";
import {useEffect, useMemo, useRef, useState} from "react";
import {useSearchParams} from "next/navigation";
import {BedDouble, BusFront, Check, Euro, MapPin, Minus, Plus, Utensils, X} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Link, useRouter} from "@/i18n/navigation";
import {calculatePrice, formatPrice, type TransferTier} from "@/lib/pricing";
import type {BookingHref, OfferDetailHref} from "@/lib/hrefs";
import type {Locale} from "@/i18n/routing";
import type {Feature, Tier, TourRecord} from "@/types/tour-catalog";
import type {OfferQueryState} from "@/lib/tour-query";

const transferTiers: TransferTier[] = ["standard", "premium"];
const travelStyleFeatureIds = new Set(["transport", "group", "travel", "vehicle"]);
type OfferTour = TourRecord & {pricing: Extract<TourRecord["pricing"], {kind: "offers"}>};
type Labels = {
  morocco: string; departsFrom: string; change: string; date: string; travelers: string; selectDate: string;
  totalFor: string; totalPrice: string; priceBreakdown: string; baseTour: string; arrivalTransfer: string; departureTransfer: string;
  differences: string; recommended: string; travelStyle: string; whereSleep: string; board: string; included: string; transfers: string;
  arrivalLeg: string; departureLeg: string; none: string; details: string; book: string; yes: string; no: string; previous: string; next: string;
  priceUnit: string; groupUnit: string; ticketUnit: string; standardVehicle: string; premiumVehicle: string; perPerson: string; night: string;
  home: string; allTours: string; itinerary: string; day: string; select: string; selected: string; economicSelection: string; recommendedSelection: string;
};

function valueLabel(value: boolean | {en: string; es: string; pt: string}, locale: Locale, yes: string, no: string) {
  return typeof value === "boolean" ? (value ? yes : no) : value[locale];
}
function isPositive(feature: Feature, tier: Tier) { return feature.tiers[tier] !== false; }
function getFeatureIcon(id: string) {
  return /meal|food|dinner|board/i.test(id) ? Utensils : /transport|vehicle|group|travel/i.test(id) ? BusFront : Check;
}

export default function OffersComparisonClient({tour, locale, slug, images, stayImages, transferPrices, initialState, detailHrefs, bookingHrefs, labels, tierLabels}: {
  tour: OfferTour; locale: Locale; slug: string; images: string[]; stayImages: Record<Tier, (string | null)[]>;
  transferPrices: Record<Tier, number>; initialState: OfferQueryState; detailHrefs: Record<Tier, OfferDetailHref>;
  bookingHrefs: Record<Tier, BookingHref>; labels: Labels; tierLabels: Record<Tier, string>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState(initialState);
  const recommendedTier = tour.recommendedTier ?? "standard";
  const tiers: Tier[] = ["economic", recommendedTier === "economic" ? "standard" : recommendedTier];
  const [activeTier, setActiveTier] = useState<Tier>(tiers[1]);
  const [footerVisible, setFooterVisible] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pricing = tour.pricing;
  const isCircuit = tour.details.layout === "multi-day";
  const showStays = Boolean(isCircuit && tour.stays?.["economic"]?.length);
  const showTransfers = Boolean(tour.transferAddon);
  const today = new Date().toLocaleDateString("en-CA");
  const hero = images[0];

  useEffect(() => {
    const read = searchParams;
    const count = Number(read.get("travelers"));
    const next: OfferQueryState = {
      date: read.get("date") && /^\d{4}-\d{2}-\d{2}$/.test(read.get("date")!) ? read.get("date")! : "",
      travelers: Number.isInteger(count) && count >= 1 && count <= 20 ? count : 2,
      arrival: isCircuit && ["none", ...transferTiers].includes(read.get("arrival") ?? "none") ? (read.get("arrival") ?? "none") as TransferTier : "none",
      departure: isCircuit && ["none", ...transferTiers].includes(read.get("departure") ?? "none") ? (read.get("departure") ?? "none") as TransferTier : "none",
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
      date: next.date || undefined, travelers: String(next.travelers),
      arrival: isCircuit ? next.arrival : undefined, departure: isCircuit ? next.departure : undefined, diff: next.diff ? "1" : undefined,
    }}, {scroll: false});
  }

  const priceFor = (tier: Tier) => calculatePrice({unit: pricing.unit, tierPrice: pricing.tiers[tier], travelers: state.travelers, arrival: state.arrival, departure: state.departure, transferPrices});
  const commonQuery = {date: state.date || undefined, travelers: String(state.travelers), arrival: state.arrival, departure: state.departure};
  const detailHref = (tier: Tier) => ({...detailHrefs[tier], query: commonQuery});
  const bookingHref = (tier: Tier) => ({...bookingHrefs[tier], query: commonQuery});
  const differingFeatures = useMemo(() => new Set(pricing.features.filter((feature) => new Set(tiers.map((tier) => JSON.stringify(feature.tiers[tier]))).size > 1).map((feature) => feature.id)), [pricing.features]);
  const excludedBySection = new Set([...travelStyleFeatureIds, ...(showStays ? ["camp"] : [])]);
  const chipFeatures: Feature[] = [];
  const chipLabels = new Set<string>();
  for (const feature of pricing.features) {
    const label = feature.label[locale];
    if (excludedBySection.has(feature.id) || !tiers.every((tier) => isPositive(feature, tier)) || chipLabels.has(label)) continue;
    chipFeatures.push(feature);
    chipLabels.add(label);
    if (chipFeatures.length === 3) break;
  }
  const chipFeatureIds = new Set(chipFeatures.map((feature) => feature.id));
  const includedFeatures = pricing.features.filter((feature) => !excludedBySection.has(feature.id) && !chipFeatureIds.has(feature.id));
  const shownFeatures = includedFeatures.filter((feature) => !state.diff || differingFeatures.has(feature.id));
  const metaDate = state.date || labels.selectDate;
  const summaryLead = tour.summary[locale].split(/(?<=[.!?])\s+/)[0];
  const titleLine = `${labels.morocco} · ${tour.duration[locale]}`;
  const tabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = event.key === "ArrowRight" ? (index + 1) % tiers.length : event.key === "ArrowLeft" ? (index + tiers.length - 1) % tiers.length : event.key === "Home" ? 0 : event.key === "End" ? tiers.length - 1 : -1;
    if (next < 0) return;
    event.preventDefault();
    setActiveTier(tiers[next]);
    tabRefs.current[next]?.focus();
  };
  function StaySection({tier}: {tier: Tier}) {
    const stays = tour.stays?.[tier] ?? [];
    if (!showStays || stays.length === 0) return null;
    return <section className="offer-section">
      <h3>{labels.whereSleep}</h3>
      <ul className="offer-stay-list">{stays.map((stay, index) => <li key={`${stay.name.en}-${index}`} className="offer-stay-row">
        <div className="offer-stay-photo">{stayImages[tier]?.[index] ? <Image src={stayImages[tier][index]!} alt={stay.name[locale]} fill sizes="96px" className="object-cover"/> : <BedDouble aria-hidden="true" size={28}/>}</div>
        <div className="min-w-0"><p className="offer-stay-name">{stay.name[locale]}</p><p className="offer-muted">{stay.type[locale]} · {stay.nights.map((night) => labels.night.replace("{number}", String(night))).join(", ")}</p><p className="offer-muted">{stay.board[locale]}</p></div>
      </li>)}</ul>
    </section>;
  }

  function TransferGroup({leg, tier, cardKey}: {leg: "arrival" | "departure"; tier: Tier; cardKey: string}) {
    const selection = state[leg];
    const title = leg === "arrival" ? labels.arrivalLeg : labels.departureLeg;
    const options: TransferTier[] = ["none", ...transferTiers];
    const selectOption = (option: TransferTier) => updateState({[leg]: option});
    const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      const next = event.key === "ArrowRight" || event.key === "ArrowDown" ? (index + 1) % options.length : event.key === "ArrowLeft" || event.key === "ArrowUp" ? (index + options.length - 1) % options.length : -1;
      if (next < 0) return;
      event.preventDefault();
      selectOption(options[next]);
      document.getElementById(`${cardKey}-${tier}-${leg}-${options[next]}`)?.focus();
    };
    return <fieldset className="offer-transfer-leg">
      <legend>{title}</legend>
      <div className="offer-transfer-options" role="radiogroup" aria-label={title}>{options.map((option, index) => {
        const id = `${cardKey}-${tier}-${leg}-${option}`;
        const optionName = option === "none" ? labels.none : option === "standard" ? labels.standardVehicle : labels.premiumVehicle;
        const delta = option === "none" ? 0 : transferPrices[option];
        const checked = selection === option;
        return <button key={option} id={id} type="button" role="radio" aria-checked={checked} tabIndex={checked ? 0 : -1} onClick={() => selectOption(option)} onKeyDown={(event) => onKeyDown(event, index)} className={`offer-transfer-option ${checked ? "is-selected" : ""}`}>
          <span className="offer-transfer-name">{optionName}</span><span className="offer-transfer-price">{option === "none" ? "—" : `+ ${formatPrice(locale, delta)}`}</span>
          <span className={`offer-transfer-state ${checked ? "" : "is-action"}`}>{checked ? <><Check aria-hidden="true" size={14}/>{labels.selected}</> : labels.select}</span>
        </button>;
      })}</div>
    </fieldset>;
  }

  function PriceBreakdown({tier}: {tier: Tier}) {
    const amounts = priceFor(tier);
    return <Popover><PopoverTrigger asChild><Button type="button" variant="outline" size="icon" aria-label={labels.priceBreakdown} className="offer-price-info"><Euro aria-hidden="true" size={18}/></Button></PopoverTrigger><PopoverContent align="start" className="w-64 p-4 text-xs">
      <h4 className="font-bold">{labels.priceBreakdown}</h4><dl className="mt-3 space-y-2">
        <div className="flex justify-between gap-3"><dt>{labels.baseTour}{pricing.unit === "person" || pricing.unit === "ticket" ? ` × ${state.travelers}` : ""}</dt><dd className="font-semibold">{formatPrice(locale, amounts.baseTotal)}</dd></div>
        {amounts.arrivalTotal ? <div className="flex justify-between gap-3"><dt>{labels.arrivalTransfer}</dt><dd className="font-semibold">{formatPrice(locale, amounts.arrivalTotal)}</dd></div> : null}
        {amounts.departureTotal ? <div className="flex justify-between gap-3"><dt>{labels.departureTransfer}</dt><dd className="font-semibold">{formatPrice(locale, amounts.departureTotal)}</dd></div> : null}
        <div className="flex justify-between gap-3 border-t border-line pt-2"><dt className="font-bold">{labels.totalPrice}</dt><dd className="font-bold text-[#006D41]">{formatPrice(locale, amounts.total)}</dd></div>
      </dl></PopoverContent></Popover>;
  }

  function TierCard({tier, cardKey}: {tier: Tier; cardKey: string}) {
    const result = priceFor(tier);
    const recommended = recommendedTier === tier;
    const chips: Feature[] = chipFeatures;
    const travelFeatures = pricing.features.filter((feature) => travelStyleFeatureIds.has(feature.id));
    const unitLabel = pricing.unit === "person" ? labels.perPerson : pricing.unit === "ticket" ? labels.perPerson : pricing.unit === "group" ? labels.groupUnit : labels.priceUnit;
    const tierIncluded = shownFeatures.filter((feature) => !chipFeatureIds.has(feature.id));
    const numberRows = 3 + (showStays ? 1 : 0) + (travelFeatures.length ? 1 : 0) + (tierIncluded.length ? 1 : 0) + (showTransfers ? 1 : 0);
    return <article className={`offer-card offer-tier-${tier}`} style={{"--offer-rows": numberRows} as React.CSSProperties}>
      <header className={`offer-card-header ${tier === "economic" ? "is-economic" : recommended ? "is-recommended" : "is-premium"}`}>
        <div className="min-w-0"><h2>{tier === "economic" ? labels.economicSelection : labels.recommendedSelection}</h2></div>
        <div className="offer-total"><span className="offer-total-label">{labels.totalPrice}</span><strong>{formatPrice(locale, result.total)}</strong><span>{formatPrice(locale, result.baseUnitPrice)} {unitLabel}</span></div>
      </header>
      <div className="offer-actions">
        <div className="offer-action-top">
          <div className="offer-chips">{chips.map((feature) => {const Icon = getFeatureIcon(feature.id); return <span key={feature.id} className="offer-chip"><Icon aria-hidden="true" size={15}/>{feature.label[locale]}</span>;})}</div>
          <div className="offer-action-buttons"><Link href={detailHref(tier)} className="offer-button offer-button-outline">{labels.details}</Link><Link href={bookingHref(tier)} className="offer-button offer-button-primary">{labels.book}</Link></div>
        </div>
        <PriceBreakdown tier={tier}/>
      </div>
      <StaySection tier={tier}/>
      {travelFeatures.length ? <section className="offer-section"><h3>{labels.travelStyle}</h3><ul>{travelFeatures.map((feature) => {const value = feature.tiers[tier]; return <li key={feature.id} className="offer-travel-row"><BusFront aria-hidden="true" size={20}/><span>{typeof value === "object" ? value[locale] : feature.label[locale]}</span></li>;})}</ul></section> : null}
      {tierIncluded.length ? <section className="offer-section"><h3>{labels.included}</h3><ul className="offer-feature-list">{tierIncluded.map((feature) => {
        const value = feature.tiers[tier];
        const included = value !== false;
        return <li key={feature.id}><span className={included ? "offer-feature-check" : "offer-feature-no"}>{included ? <Check aria-hidden="true" size={16}/> : <X aria-hidden="true" size={16}/>}</span><span>{typeof value === "object" ? `${feature.label[locale]}: ${value[locale]}` : feature.label[locale]}</span></li>;
      })}</ul></section> : null}
      {showTransfers ? <section className="offer-section"><h3>{labels.transfers}</h3><TransferGroup leg="arrival" tier={tier} cardKey={cardKey}/><TransferGroup leg="departure" tier={tier} cardKey={cardKey}/></section> : null}
      <footer className="offer-card-footer"><Link href={bookingHref(tier)} className="offer-button offer-button-primary offer-footer-book">{labels.book}</Link></footer>
    </article>;
  }

  const itineraryDays = tour.details.days ?? [];
  const itinerarySteps = tour.details.steps ?? [];
  const activePrice = priceFor(activeTier);
  const hasTravel = pricing.features.some((feature) => travelStyleFeatureIds.has(feature.id));
  const hasIncluded = shownFeatures.some((feature) => !chipFeatureIds.has(feature.id));
  const totalColumnRows = 3 + (showStays ? 1 : 0) + (hasTravel ? 1 : 0) + (hasIncluded ? 1 : 0) + (showTransfers ? 1 : 0);

  return <div className="offers-page">
    <nav aria-label={`${labels.home} / ${labels.allTours}`} className="offers-breadcrumb"><Link href="/">{labels.home}</Link><span aria-hidden="true">›</span><Link href="/tours">{labels.allTours}</Link><span aria-hidden="true">›</span><span aria-current="page">{tour.title[locale]}</span></nav>
    <section className="offers-hero-card">
      <div className="offers-hero-image">{hero ? <Image src={hero} alt={tour.title[locale]} fill priority sizes="100vw" className="object-cover"/> : <div className="offers-hero-fallback" aria-hidden="true"/>}</div>
      <div className="offers-hero-content">
        <p className="offers-eyebrow">{titleLine}</p><h1>{tour.title[locale]}</h1><p className="offers-summary">{summaryLead}</p>
        <div className="offers-meta-row"><p>{labels.departsFrom} {tour.startPlace?.[locale] ?? tour.destination[locale]} <span aria-hidden="true">|</span> {metaDate} <span aria-hidden="true">|</span> {state.travelers} {labels.travelers.toLowerCase()}</p>
          <Popover><PopoverTrigger asChild><Button variant="outline" className="offer-change-button">{labels.change}</Button></PopoverTrigger><PopoverContent align="end" className="w-[min(90vw,330px)] p-4">
            <label className="block text-xs font-semibold" htmlFor="offer-trip-date">{labels.date}<input id="offer-trip-date" type="date" min={today} value={state.date} onChange={(event) => updateState({date: event.target.value})} className="mt-1.5 h-10 w-full border border-line px-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006D41]"/></label>
            <div className="mt-4 flex items-center justify-between"><span className="text-xs font-semibold">{labels.travelers}</span><div className="flex items-center gap-3"><Button variant="outline" size="icon" aria-label={labels.previous} disabled={state.travelers <= 1} onClick={() => updateState({travelers: state.travelers - 1})}><Minus size={14}/></Button><span className="min-w-5 text-center text-sm font-bold tabular-nums">{state.travelers}</span><Button variant="outline" size="icon" aria-label={labels.next} disabled={state.travelers >= 20} onClick={() => updateState({travelers: state.travelers + 1})}><Plus size={14}/></Button></div></div>
          </PopoverContent></Popover>
        </div>
      </div>
    </section>

    {(itineraryDays.length || itinerarySteps.length) ? <section className="offers-itinerary"><h2>{labels.itinerary}</h2><ol className="offers-itinerary-strip">{itineraryDays.length ? itineraryDays.map((day) => <li key={day.day}><div><span className="offers-itinerary-top"><b>{labels.day} {day.day}</b><span>{day.to[locale]}</span></span><span className="offers-itinerary-cell"><BedDouble aria-hidden="true" size={20}/><span><strong>{day.from[locale]} → {day.to[locale]}</strong><small>{day.overnight?.[locale] ?? day.title[locale]}</small></span></span></div></li>) : itinerarySteps.slice(0, tour.details.layout === "wellness" ? itinerarySteps.length : 6).map((step, index) => <li key={`${index}-${step.title[locale]}`}><div><span className="offers-itinerary-top"><b>{step.time ?? `${index + 1}`}</b><span>{step.duration?.[locale] ?? ""}</span></span><span className="offers-itinerary-cell"><MapPin aria-hidden="true" size={20}/><span><strong>{step.title[locale]}</strong><small>{step.text[locale]}</small></span></span></div></li>)}</ol></section> : null}

    <div className="offers-toolbar"><label className="offers-switch"><input type="checkbox" role="switch" checked={state.diff} onChange={(event) => updateState({diff: event.target.checked})}/><span className="offers-switch-track" aria-hidden="true"><span/></span><span>{labels.differences}</span></label></div>
    <div className="offers-tier-tabs" role="tablist" aria-label={tour.title[locale]}>{tiers.map((tier, index) => <button key={tier} ref={(node) => {tabRefs.current[index] = node;}} type="button" role="tab" id={`offer-tab-${tier}`} aria-controls="offer-active-panel" aria-selected={activeTier === tier} tabIndex={activeTier === tier ? 0 : -1} onKeyDown={(event) => tabKeyDown(event, index)} onClick={() => setActiveTier(tier)}>{tierLabels[tier]}</button>)}</div>
    <div className="offers-cards-grid" style={{"--offer-rows": totalColumnRows} as React.CSSProperties} data-circuit={isCircuit}>
      {tiers.map((tier) => <TierCard key={`desktop-${tier}`} tier={tier} cardKey="desktop"/>)}
    </div>
    <div id="offer-active-panel" role="tabpanel" aria-labelledby={`offer-tab-${activeTier}`} className="offers-mobile-card"><TierCard tier={activeTier} cardKey="mobile"/></div>

    {!footerVisible ? <div className="offers-mobile-price-bar"><span><strong>{formatPrice(locale, activePrice.total)}</strong><small>{labels.totalFor.replace("{travelers}", String(state.travelers))}</small></span><Link href={bookingHref(activeTier)} className="offer-button offer-button-primary">{labels.book}</Link></div> : null}
  </div>;
}
