import Image from "next/image";
import {BedDouble, Check, Clock3, Compass, MapPin, X} from "lucide-react";
import {getLocale, getTranslations} from "next-intl/server";
import type {Metadata} from "next";
import TourCard from "@/components/TourCard";
import JsonLd, {breadcrumbListSchema, faqPageSchema} from "@/components/seo/JsonLd";
import DayAccordion from "@/components/tour-detail/DayAccordion";
import OfferSelectionGrid from "@/components/tour-detail/OfferSelectionGrid";
import BookingPanel from "@/components/tour-detail/BookingPanel";
import SectionNav, {type SectionLink} from "@/components/tour-detail/SectionNav";
import TourGallery from "@/components/tour-detail/TourGallery";
import ShareButton from "@/components/tour-detail/ShareButton";
import {Link} from "@/i18n/navigation";
import {getSimilarTours} from "@/lib/tour-catalog";
import {bookHref, localizedTourPath, localizedToursPath, offerHref, tourHref} from "@/lib/hrefs";
import type {Locale} from "@/i18n/routing";
import type {Tier, TourRecord} from "@/types/tour-catalog";
import {siteUrl} from "@/lib/seo/metadata";
import type {OfferQueryState} from "@/lib/tour-query";
import {getAirportTransferPrices} from "@/lib/tour-catalog";

export type ExperienceMode = "detail" | "offers" | "tier";

function unitKey(unit: "person" | "vehicle" | "group" | "ticket") {
  return unit === "person" ? "perPerson" : unit === "vehicle" ? "perVehicle" : unit === "group" ? "perGroup" : "perTicket";
}

function offerUnitKey(unit: "person" | "vehicle" | "group" | "ticket") {
  return unit === "person" ? "unitPerson" : unit === "vehicle" ? "unitVehicle" : unit === "group" ? "unitGroup" : "unitTicket";
}

function formatPrice(locale: Locale, amount: number) {
  return new Intl.NumberFormat(locale, {style: "currency", currency: "EUR", maximumFractionDigits: 0}).format(amount);
}

function valueText(value: boolean | {en: string; es: string; pt: string}, locale: Locale, yes: string, no: string) {
  return typeof value === "boolean" ? (value ? yes : no) : value[locale];
}

export async function buildTourMetadata(tour: TourRecord, mode: ExperienceMode, tier?: Tier): Promise<Metadata> {
  const locale = await getLocale() as Locale;
  const offerT = await getTranslations({locale, namespace: "TourOffers"});
  const title = mode === "tier" && tier ? `${tour.title[locale]} — ${offerT(tier)}` : tour.title[locale];
  return {
    title,
    description: tour.summary[locale],
    alternates: {
      canonical: `${siteUrl}${localizedTourPath(locale, tour, mode === "tier" ? "offers" : mode)}`,
      languages: Object.fromEntries((["en", "es", "pt"] as Locale[]).map((language) => [language, `${siteUrl}${localizedTourPath(language, tour, mode === "tier" ? "offers" : mode, tier)}`])),
    },
    openGraph: {title, description: tour.summary[locale], type: "website", images: [{url: tour.image, alt: tour.title[locale]}]},
  };
}

function Facts({tour, locale, labels, factsLabel}: {tour: TourRecord; locale: Locale; labels: (key: "duration" | "type" | "start" | "days" | "nights" | "dayTour" | "multiDay" | "wellness" | "service") => string; factsLabel: string}) {
  const typeKey = tour.details.layout === "day-tour" ? "dayTour" : tour.details.layout === "multi-day" ? "multiDay" : tour.details.layout === "wellness" ? "wellness" : "service";
  const facts = [
    {label: labels("duration"), value: tour.duration[locale], icon: Clock3},
    {label: labels("type"), value: labels(typeKey), icon: Compass},
    ...(tour.startPlace ? [{label: labels("start"), value: tour.startPlace[locale], icon: MapPin}] : []),
    ...(tour.durationDays ? [{label: labels("days"), value: String(tour.durationDays), icon: Clock3}] : []),
    ...(tour.durationNights ? [{label: labels("nights"), value: String(tour.durationNights), icon: BedDouble}] : []),
  ];
  return <section aria-label={factsLabel} className="-mt-1 grid overflow-hidden rounded-xl border border-line bg-white shadow-sm sm:grid-cols-2 lg:grid-cols-4">{facts.map(({label, value, icon: Icon}, index) => <div key={label} className={`flex min-h-[76px] items-center gap-3 border-dashed border-[#006D41]/40 px-4 py-3 ${index ? "border-l" : ""}`}><Icon className="h-5 w-5 shrink-0 text-[#006D41]" /><div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-wide text-muted">{label}</p><p className="mt-1 truncate text-sm font-semibold text-[#222]">{value}</p></div></div>)}</section>;
}

function ItineraryPreview({tour, locale, title, dayLabel, overnightLabel, mealsLabel}: {tour: TourRecord; locale: Locale; title: string; dayLabel: (number: number) => string; overnightLabel: string; mealsLabel: string}) {
  const days = tour.details.days ?? [];
  const steps = tour.details.steps ?? [];
  if (!days.length && !steps.length) return null;
  return <section className="mt-8" aria-label={dayLabel(1)}>
    <h2 className="mb-3 text-base font-bold text-[#383E3A]">{title}</h2>
    {days.length ? <ol className="grid auto-cols-[98px] grid-flow-col gap-1 overflow-x-auto pb-2 sm:auto-cols-[112px]">{days.map((day) => <li key={day.day} className="min-h-[110px] border border-[#E5E5E5] bg-white"><div className="flex h-7 items-center justify-between bg-[#F0F0F0] px-2 text-[9px] font-semibold text-[#666]"><span>{day.day}</span><span>{dayLabel(day.day)}</span></div><div className="p-2"><p className="min-h-8 text-[10px] font-semibold leading-4 text-[#454545]">{day.from[locale]} <span aria-hidden="true">→</span> {day.to[locale]}</p><p className="mt-2 line-clamp-2 border-t border-[#EEE] pt-2 text-[10px] leading-4 text-[#006D41]">{day.title[locale]}</p>{day.overnight ? <p className="mt-1 line-clamp-1 text-[9px] text-[#777]">{overnightLabel}: {day.overnight[locale]}</p> : null}{day.meals ? <p className="mt-1 line-clamp-1 text-[9px] text-[#777]">{mealsLabel}: {day.meals[locale]}</p> : null}</div></li>)}</ol> : <ol className="grid auto-cols-[116px] grid-flow-col gap-1 overflow-x-auto pb-2 sm:auto-cols-[144px]">{steps.map((step, index) => <li key={`${index}-${step.title[locale]}`} className="min-h-[110px] border border-[#E5E5E5] bg-white"><div className="flex h-7 items-center justify-between bg-[#F0F0F0] px-2 text-[9px] font-semibold text-[#666]"><span>{String(index + 1).padStart(2, "0")}</span><span>{step.time ?? tour.duration[locale]}</span></div><div className="p-2"><p className="line-clamp-2 min-h-8 text-[10px] font-semibold leading-4 text-[#454545]">{step.title[locale]}</p><p className="mt-2 line-clamp-3 border-t border-[#EEE] pt-2 text-[10px] leading-4 text-[#666]">{step.text[locale]}</p></div></li>)}</ol>}
  </section>;
}

function RouteStrip({tour, locale}: {tour: TourRecord; locale: Locale}) {
  if (tour.details.layout !== "multi-day" || !tour.details.days?.length) return null;
  const route = [tour.details.days[0].from, ...tour.details.days.map((day) => day.to)];
  const unique = route.filter((place, index) => index === 0 || place[locale] !== route[index - 1][locale]);
  return <div className="mb-8 overflow-x-auto rounded-xl bg-[#EAF6D6] px-5 py-5"><ol className="flex min-w-max items-center">{unique.map((place, index) => <li key={`${place[locale]}-${index}`} className="flex items-center"><span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#006D41] ring-4 ring-[#006D41]/10" /><span className="text-sm font-semibold text-[#222]">{place[locale]}</span></span>{index < unique.length - 1 ? <span aria-hidden="true" className="mx-4 h-px w-12 border-t border-dashed border-[#006D41] sm:mx-7 sm:w-20" /> : null}</li>)}</ol></div>;
}

export default async function TourExperiencePage({tour, mode, tier, imagePaths, offerState}: {tour: TourRecord; mode: ExperienceMode; tier?: Tier; imagePaths: string[]; offerState?: OfferQueryState}) {
  const locale = await getLocale() as Locale;
  const detailT = await getTranslations({locale, namespace: "TourDetail"});
  const offerT = await getTranslations({locale, namespace: "TourOffers"});
  const unit = tour.pricing.kind === "quote" ? undefined : tour.pricing.unit;
  const price = tour.pricing.kind === "single" ? tour.pricing.amount : tour.pricing.kind === "offers" ? tour.pricing.tiers[tier ?? "standard"] : undefined;
  const layout = tour.details.layout;
  const items: SectionLink[] = [
    {id: "overview", label: detailT("overview")},
    {id: layout === "wellness" ? "ritual" : "itinerary", label: detailT(layout === "wellness" ? "ritual" : "itinerary")},
    {id: "included", label: detailT("included")},
    ...(tour.details.meeting ? [{id: "meeting", label: detailT("meeting")}] : []),
    {id: "faq", label: detailT("faq")},
  ];
  const faq = tour.details.faqs.map((item) => ({question: item.q[locale], answer: item.a[locale]}));
  const breadcrumbs = [{name: detailT("home"), path: `/${locale}`}, {name: tour.category[locale], path: localizedToursPath(locale)}, {name: tour.title[locale], path: localizedTourPath(locale, tour, mode === "tier" ? "tier" : mode, tier)}];
  const factsLabel = (key: Parameters<typeof detailT>[0]) => detailT(key);
  const highlights = tour.details.highlights.slice(0, 6);
  const selectedPrice = price;
  return <main className={`min-h-screen bg-white pb-24 text-[#222] ${layout === "wellness" ? "[&_.tour-card]:rounded-2xl" : ""}`}>
    <JsonLd data={[
      breadcrumbListSchema(breadcrumbs), faqPageSchema(faq),
      ...(mode === "offers" && tour.pricing.kind === "offers" ? [{"@type": "Product", name: tour.title[locale], description: tour.summary[locale], offers: (["economic", "standard", "premium"] as Tier[]).map((key) => ({"@type": "Offer", name: offerT(key), price: tour.pricing.kind === "offers" ? tour.pricing.tiers[key] : 0, priceCurrency: "EUR"}))}, {"@type": "TouristTrip", name: tour.title[locale], description: tour.summary[locale], touristType: [tour.category[locale]]}] : [{"@type": "TouristTrip", name: tour.title[locale], description: tour.summary[locale], touristType: [tour.category[locale]]}]),
    ]} />
    <div className={`mx-auto ${mode === "offers" ? "max-w-[1440px] bg-[#F7F7F7] px-3 pb-12 pt-3 sm:px-4" : "max-w-[1200px] px-3 pb-16 pt-5 sm:px-5 lg:px-6"} ${layout === "wellness" && mode !== "offers" ? "bg-[#F9FAF5]" : ""}`}>
      {mode === "tier" ? <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><Link href={tourHref(tour)} className="text-sm font-semibold text-[#006D41] underline underline-offset-4">← {offerT("back")}</Link><span className="rounded-full bg-[#EAF6D6] px-3 py-1.5 text-xs font-bold uppercase text-[#006D41]">{tier ? offerT(tier) : ""}</span></div> : null}
      {mode === "offers" ? <>
        <section aria-label={tour.title[locale]} className="overflow-hidden border border-[#DEDEDE] bg-white">
          <div className="relative h-[132px] sm:h-[176px] lg:h-[210px]">{imagePaths[0] || tour.image ? <Image src={imagePaths[0] || tour.image} alt={`${tour.destination[locale]} — ${tour.title[locale]}`} fill priority sizes="100vw" className="object-cover" /> : null}</div>
          <div className="px-3 py-3 sm:px-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-[11px] text-[#666]">{tour.destination[locale]}{tour.durationDays ? `, ${tour.durationDays} ${detailT("days").toLowerCase()}` : ` · ${tour.duration[locale]}`}</p><h1 className="mt-1 text-xl font-bold leading-6 text-[#333] sm:text-2xl">{tour.title[locale]}</h1><p className="mt-1 text-xs leading-5 text-[#555]">{tour.summary[locale]}</p></div><ShareButton label={detailT("share")} copied={detailT("shareCopied")} /></div>
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-[#EEE] pt-2 text-[10px] text-[#666]">{tour.startPlace ? <span>{detailT("start")}: {tour.startPlace[locale]}</span> : null}{tour.durationDays ? <><span aria-hidden="true">|</span><span>{tour.durationDays} {detailT("days").toLowerCase()}</span></> : null}{tour.durationNights ? <><span aria-hidden="true">|</span><span>{tour.durationNights} {detailT("nights").toLowerCase()}</span></> : null}<span aria-hidden="true">|</span><span>{tour.category[locale]}</span></div>
            <nav aria-label={detailT("breadcrumb")} className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] text-muted">{breadcrumbs.map((crumb, index) => <span key={`${crumb.name}-${index}`} className="flex items-center gap-1.5">{index ? <span aria-hidden="true">›</span> : null}{index === breadcrumbs.length - 1 ? <span aria-current="page">{crumb.name}</span> : index === 0 ? <Link href="/" className="hover:text-[#006D41]">{crumb.name}</Link> : <Link href="/tours" className="hover:text-[#006D41]">{crumb.name}</Link>}</span>)}</nav>
          </div>
        </section>
        <div className="mt-3 flex min-h-9 items-center justify-center bg-[#383E3A] px-3 py-2 text-center text-[11px] font-semibold text-white">{detailT("requestFirst")}</div>
        <ItineraryPreview tour={tour} locale={locale} title={detailT("itinerary")} dayLabel={(number) => detailT("day", {number})} overnightLabel={detailT("night")} mealsLabel={detailT("meals")} />
      </> : <>
        <nav aria-label={detailT("breadcrumb")} className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted">{breadcrumbs.map((crumb, index) => <span key={`${crumb.name}-${index}`} className="flex items-center gap-2">{index ? <span aria-hidden="true">›</span> : null}{index === breadcrumbs.length - 1 ? <span aria-current="page">{crumb.name}</span> : index === 0 ? <Link href="/" className="hover:text-[#006D41]">{crumb.name}</Link> : <Link href="/tours" className="hover:text-[#006D41]">{crumb.name}</Link>}</span>)}</nav>
        <header className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#006D41]">{tour.category[locale]}{mode === "tier" && tier ? ` · ${offerT(tier)}` : ""}</p><h1 className="mt-1 max-w-4xl text-3xl font-bold leading-tight sm:text-4xl">{tour.title[locale]}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-[#555]">{tour.summary[locale]}</p></div><ShareButton label={detailT("share")} copied={detailT("shareCopied")} /></header>
        <TourGallery images={imagePaths} title={tour.title[locale]} labels={{all: detailT("seePhotos"), close: detailT("close"), previous: detailT("previous"), next: detailT("next"), counters: imagePaths.map((_, index) => detailT("photo", {number: index + 1, total: imagePaths.length}))}} />
        <div className="mt-5"><Facts tour={tour} locale={locale} factsLabel={detailT("facts")} labels={(key) => factsLabel(key as Parameters<typeof detailT>[0])} /></div>
        <RouteStrip tour={tour} locale={locale} />
      </>}
      {mode === "tier" && tier && tour.pricing.kind === "offers" ? <section className="mt-6 rounded-xl border border-[#006D41]/30 bg-white p-5"><p className="text-xs font-bold uppercase tracking-wide text-[#006D41]">{offerT("compare")} · {offerT(tier)}</p><div className="mt-3 flex flex-wrap gap-2">{(["economic", "standard", "premium"] as Tier[]).filter((other) => other !== tier).map((other) => <Link key={other} href={offerHref(tour, other, locale)} className="inline-flex min-h-10 items-center rounded-full border border-line px-4 text-sm font-semibold hover:border-[#006D41] hover:bg-[#EAF6D6]">{offerT(other)}</Link>)}</div><ul className="mt-4 grid gap-2 sm:grid-cols-2">{tour.pricing.features.map((item) => { const value = item.tiers[tier]; return <li key={item.id} className={`flex gap-2 text-sm leading-5 ${value === false ? "text-muted" : "text-[#222]"}`}>{value === false ? <X className="h-4 w-4 shrink-0 text-[#555]" /> : <Check className="h-4 w-4 shrink-0 text-[#006D41]" />}<span><b>{item.label[locale]}:</b> {valueText(value, locale, offerT("yes"), offerT("no"))}</span></li>; })}</ul></section> : null}
      {mode === "offers" && tour.pricing.kind === "offers" ? <>
        <OfferSelectionGrid
          locale={locale}
          prices={tour.pricing.tiers}
          summaries={tour.pricing.tierSummary}
          features={tour.pricing.features}
          labels={{
            economic: offerT("economic"), standard: offerT("standard"), premium: offerT("premium"), economicSelection: offerT("economicSelection"),
            recommended: offerT("recommendedSelection"), transportSection: offerT("transportSection"), experienceSection: offerT("experienceSection"), priceUnit: offerT(offerUnitKey(tour.pricing.unit)),
            viewDetails: offerT("viewDetails"), book: offerT("bookNow"), yes: offerT("yes"),
          }}
          detailHrefs={{economic: offerHref(tour, "economic", locale), standard: offerHref(tour, "standard", locale), premium: offerHref(tour, "premium", locale)}}
          bookingHrefs={{economic: bookHref(tour, "economic"), standard: bookHref(tour, "standard"), premium: bookHref(tour, "premium")}}
        />
      </> : <>
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0">
            <SectionNav items={items} label={detailT("sections")} />
            <section className="scroll-mt-28 py-8" id="highlights"><h2 className="text-2xl font-bold">{detailT("highlights")}</h2><ul className="mt-4 grid gap-3 sm:grid-cols-2">{highlights.map((highlight,index)=><li key={index} className="flex gap-3 rounded-lg bg-[#F7F7F7] p-3 text-sm leading-5"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#EAF6D6] text-[#006D41]"><Check className="h-3.5 w-3.5"/></span>{highlight[locale]}</li>)}</ul></section>
            <section className="scroll-mt-28 border-t border-line py-8" id="overview"><h2 className="text-2xl font-bold">{detailT("overview")}</h2><div className="mt-3 max-w-3xl space-y-3 text-sm leading-6 text-[#444]">{tour.details.overview.map((paragraph,index)=><p key={index}>{paragraph[locale]}</p>)}</div></section>
            <section className="scroll-mt-28 border-t border-line py-8" id={layout === "wellness" ? "ritual" : "itinerary"}>
              <h2 className="text-2xl font-bold">{layout === "wellness" ? detailT("ritual") : layout === "multi-day" ? detailT("dayByDay") : layout === "service" ? detailT("howItWorks") : detailT("itinerary")}</h2>
              {layout === "multi-day" && tour.details.days ? (
                <div className="mt-4">
                  <DayAccordion
                    days={tour.details.days}
                    locale={locale}
                    labels={{
                      day: Object.fromEntries(tour.details.days.map((day) => [day.day, detailT("day", {number: day.day})])),
                      expand: detailT("expandAll"),
                      collapse: detailT("collapseAll"),
                      overnight: detailT("night"),
                      meals: detailT("meals"),
                    }}
                  />
                </div>
              ) : tour.details.steps?.length ? (
                <>
                  <ol className={`mt-5 space-y-4 ${layout === "day-tour" ? "border-l-2 border-dashed border-[#006D41]/50 pl-5 sm:pl-8" : "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"}`}>
                    {tour.details.steps.map((item, index) => (
                      <li key={index} className={`relative ${layout === "day-tour" ? "pb-1" : "rounded-xl border border-line bg-white p-4"} ${item.onlyTiers?.length && tier && !item.onlyTiers.includes(tier) ? "opacity-50" : ""}`}>
                        {layout === "day-tour" ? <span className="absolute -left-[27px] top-1 h-3 w-3 rotate-45 bg-[#006D41] sm:-left-[40px]" /> : <span className="mb-3 block text-2xl font-bold text-[#006D41]">0{index + 1}</span>}
                        <div className="flex flex-wrap items-center gap-2">
                          {item.time ? <span className="rounded-full bg-[#EAF6D6] px-2.5 py-1 text-xs font-bold text-[#222]">{item.time}</span> : null}
                          <h3 className="font-semibold">{item.title[locale]}</h3>
                          {item.onlyTiers?.length ? <span className="rounded-full border border-[#929547] px-2 py-1 text-[10px] font-semibold">{item.onlyTiers.map((key) => offerT(key)).join(" + ")}</span> : null}
                        </div>
                        <p className="mt-1 text-sm leading-6 text-[#555]">{item.text[locale]}</p>
                        {item.duration ? <p className="mt-2 text-xs font-semibold text-[#006D41]">{item.duration[locale]}</p> : null}
                      </li>
                    ))}
                  </ol>
                  {layout === "day-tour" && tour.details.steps.some((item) => item.time) ? <p className="mt-4 text-xs text-muted">{detailT("indicative")}</p> : null}
                </>
              ) : <p className="mt-4 text-sm text-muted">{tour.summary[locale]}</p>}
            </section>
            <section id="included" className="scroll-mt-28 border-t border-line py-8"><div className="grid gap-6 sm:grid-cols-2"><div><h2 className="text-xl font-bold">{detailT("included")}</h2>{tour.details.included.length ? <ul className="mt-3 space-y-2">{tour.details.included.map((text,index)=><li key={index} className="flex gap-2 text-sm leading-5"><Check className="h-4 w-4 shrink-0 text-[#006D41]"/>{text[locale]}</li>)}</ul> : <p className="mt-3 text-sm text-muted">{tour.summary[locale]}</p>}</div><div><h2 className="text-xl font-bold">{detailT("notIncluded")}</h2>{tour.details.notIncluded.length ? <ul className="mt-3 space-y-2">{tour.details.notIncluded.map((text,index)=><li key={index} className="flex gap-2 text-sm leading-5"><X className="h-4 w-4 shrink-0 text-[#555]"/>{text[locale]}</li>)}</ul> : <p className="mt-3 text-sm text-muted">{detailT("goodToKnow")}</p>}</div></div></section>
            {tour.details.meeting ? <section id="meeting" className="scroll-mt-28 border-t border-line py-8"><h2 className="text-xl font-bold">{detailT("meeting")}</h2><p className="mt-3 flex gap-3 text-sm leading-6 text-[#444]"><MapPin className="mt-1 h-4 w-4 shrink-0 text-[#006D41]"/>{tour.details.meeting[locale]}</p></section> : null}
            {tour.details.bring?.length ? <section className="border-t border-line py-8"><h2 className="text-xl font-bold">{detailT("bring")}</h2><ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[#444]">{tour.details.bring.map((text,index)=><li key={index}>{text[locale]}</li>)}</ul></section> : null}
            {tour.details.goodToKnow?.length ? <section className="border-t border-line py-8"><h2 className="text-xl font-bold">{detailT("goodToKnow")}</h2><ul className="mt-3 space-y-2 text-sm leading-6 text-[#444]">{tour.details.goodToKnow.map((text,index)=><li key={index}>{text[locale]}</li>)}</ul></section> : null}
            <FaqSection tour={tour} locale={locale} title={detailT("faq")} />
          </div>
          <div className="lg:pt-2">{tour.pricing.kind === "quote" ? <div className="rounded-2xl border border-line bg-[#F7F7F7] p-5"><p className="font-semibold">{detailT("questions")}</p><p className="mt-2 text-sm leading-5 text-muted">{tour.summary[locale]}</p><Link href={{pathname: "/contact", query: {topic: "quote", tour: tour.slug}}} className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[#006D41] px-4 text-sm font-semibold text-white">{detailT("quote")}</Link></div> : selectedPrice !== undefined ? <BookingPanel tour={tour} tier={tier} price={selectedPrice} initialState={offerState} transferPrices={getAirportTransferPrices()} /> : null}</div>
        </div>
        <SimilarTours tour={tour} locale={locale} labels={{title: detailT("similar"), price: detailT("priceFrom"), unit: unit ? detailT(unitKey(unit) as "perPerson" | "perVehicle" | "perGroup" | "perTicket") : "", viewTrip: detailT("viewTrip")}} />
      </>}
    </div>
  </main>;
}

function FaqSection({tour, locale, title}: {tour: TourRecord; locale: Locale; title: string}) {
  return <section id="faq" className="scroll-mt-28 border-t border-line py-8"><h2 className="text-2xl font-bold">{title}</h2><div className="mt-4 divide-y divide-line rounded-xl border border-line bg-white">{tour.details.faqs.map((faq,index)=><details key={index} className="group px-4 py-3"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">{faq.q[locale]}<span className="text-xl text-[#006D41] transition-transform group-open:rotate-45">+</span></summary><p className="pb-3 pr-8 text-sm leading-6 text-[#555]">{faq.a[locale]}</p></details>)}</div></section>;
}

function SimilarTours({tour, locale, labels}: {tour: TourRecord; locale: Locale; labels: {title: string; price: string; unit: string; viewTrip: string}}) {
  const similar = getSimilarTours(tour);
  if (!similar.length) return null;
  return <section className="mt-12 border-t border-line pt-8"><h2 className="text-2xl font-bold">{labels.title}</h2><div className="mt-4 grid grid-cols-[repeat(auto-fill,270px)] gap-4">{similar.map((item)=><TourCard key={item.id} image={item.image} imageAlt={item.title[locale]} title={item.title[locale]} tag={item.category[locale]} meta={item.destination[locale]} description={item.summary[locale]} price={item.pricing.kind === "quote" ? undefined : formatPrice(locale, item.pricing.kind === "single" ? item.pricing.amount : Math.min(...Object.values(item.pricing.tiers)))} duration={item.duration[locale]} actionLabel={labels.viewTrip} actionHref={tourHref(item)} priceLabel={labels.price} />)}</div></section>;
}
