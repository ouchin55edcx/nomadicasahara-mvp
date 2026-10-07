import {existsSync} from "node:fs";
import path from "node:path";
import Image from "next/image";
import {Open_Sans} from "next/font/google";
import {Check, MapPin, X} from "lucide-react";
import {getLocale, getTranslations} from "next-intl/server";
import type {Metadata} from "next";
import JsonLd, {breadcrumbListSchema, faqPageSchema} from "@/components/seo/JsonLd";
import ChooseDateButton from "@/components/tour-detail/ChooseDateButton";
import ItineraryExplorer, {type ItineraryItem} from "@/components/tour-detail/ItineraryExplorer";
import PlacesCarousel from "@/components/tour-detail/PlacesCarousel";
import ShareButton from "@/components/tour-detail/ShareButton";
import StaySwitcher from "@/components/tour-detail/StaySwitcher";
import TourBookingBar from "@/components/tour-detail/TourBookingBar";
import {TourBookingProvider, TourPriceSummary} from "@/components/tour-detail/TourBookingContext";
import {Link} from "@/i18n/navigation";
import {getAirportTransferPrices} from "@/lib/tour-catalog";
import {localizedTourPath, localizedToursPath} from "@/lib/hrefs";
import {calculatePrice, formatPrice} from "@/lib/pricing";
import type {Locale} from "@/i18n/routing";
import type {Day, MealType, Tier, TourRecord} from "@/types/tour-catalog";
import type {OfferQueryState} from "@/lib/tour-query";
import {siteUrl} from "@/lib/seo/metadata";

export type ExperienceMode = "detail" | "offers" | "tier";
const supportedLocales: Locale[] = ["en", "es", "pt"];
const openSans = Open_Sans({subsets: ["latin"], display: "swap", variable: "--font-detail-open-sans"});
const DETAIL_PLACE_IMAGES: Record<string, string> = {
  marrakech: "/images/tour-ciudades.jpg",
  merzouga: "/images/tour-merzouga.jpg",
  zagora: "/images/tour-atlas.jpg",
  fes: "/images/tour-fez.jpg",
};

function unitKey(unit: "person" | "vehicle" | "group" | "ticket") {
  return unit === "person" ? "perPerson" : unit === "vehicle" ? "perVehicle" : unit === "group" ? "perGroup" : "perTicket";
}

function offerUnitKey(unit: "person" | "vehicle" | "group" | "ticket") {
  return unit === "person" ? "unitPerson" : unit === "vehicle" ? "unitVehicle" : unit === "group" ? "unitGroup" : "unitTicket";
}

function imageExists(relativePath: string) {
  return existsSync(path.join(process.cwd(), "public", relativePath.replace(/^\//, "")));
}

function slugify(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
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
      languages: Object.fromEntries(supportedLocales.map((language) => [language, `${siteUrl}${localizedTourPath(language, tour, mode === "tier" ? "offers" : mode, tier)}`])),
    },
    openGraph: {title, description: tour.summary[locale], type: "website", images: tour.image ? [{url: tour.image, alt: tour.title[locale]}] : []},
  };
}

function RouteDiagram({places, start, end}: {places: {id: string; name: string}[]; start: string; end: string}) {
  const points = places.map((place, index) => ({...place, x: places.length <= 1 ? 195 : 34 + index * (322 / (places.length - 1)), y: index % 2 ? 88 : 145}));
  const pathData = points.map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`).join(" ");
  return <div className="detail-route-diagram-wrap">
    <div className="detail-route-diagram"><svg viewBox="0 0 390 216" aria-hidden="true">
      <path d={pathData} fill="none" stroke="#67B500" strokeWidth="2" strokeDasharray="6 6"/>
      {points.map((point, index) => <g key={point.id}><circle cx={point.x} cy={point.y} r="10" fill="#006D41"/><text x={point.x} y={point.y + (index % 2 ? -20 : 27)} textAnchor={index === 0 ? "start" : index === points.length - 1 ? "end" : "middle"}>{point.name}</text></g>)}
    </svg></div>
    <ol className="sr-only" aria-label={`${start} to ${end} route`}>{places.map((place) => <li key={place.id}>{place.name}</li>)}</ol>
  </div>;
}

function getItineraryItems({tour, locale, detailT, offerT}: {tour: TourRecord; locale: Locale; detailT: (key: "day" | "daysRange" | "stepNumber", values?: Record<string, string | number>) => string; offerT: (key: Tier) => string}): ItineraryItem[] {
  if (tour.details.days?.length) {
    const grouped: Day[][] = [];
    for (const day of tour.details.days) {
      const previous = grouped[grouped.length - 1];
      if (previous && previous[previous.length - 1].to[locale] === day.to[locale]) previous.push(day);
      else grouped.push([day]);
    }
    return grouped.map((days) => {
      const first = days[0];
      const last = days[days.length - 1];
      const label = days.length > 1 ? detailT("daysRange", {start: first.day, end: last.day}) : detailT("day", {number: first.day});
      const meals = [...new Set(days.flatMap((day) => day.meals ?? []))] as MealType[];
      const image = `/images/tours/${tour.id}/day-${first.day}.jpg`;
      const fallbackImage = first.from.en === "Marrakech" || first.to.en === "Marrakech" ? "/images/tour-ciudades.jpg" : null;
      return {
        id: `day-${first.day}`, label, title: last.to[locale], route: `${first.from[locale]} → ${last.to[locale]}`,
        overnight: first.overnight?.[locale], meals,
        text: days.map((day) => day.text[locale]).join(" "),
        descriptionParts: days.map((day) => ({label: detailT("day", {number: day.day}), text: day.text[locale]})),
        highlights: days.flatMap((day) => day.highlights.map((highlight) => highlight[locale])),
        image: imageExists(image) ? image : fallbackImage,
      };
    });
  }
  return (tour.details.steps ?? []).map((step, index) => {
    const image = `/images/tours/${tour.id}/step-${index + 1}.jpg`;
    return {
      id: `step-${index + 1}`, label: step.time ?? detailT("stepNumber", {number: index + 1}), title: step.title[locale],
      time: step.time, duration: step.duration?.[locale], text: step.text[locale], highlights: [],
      tierLabel: step.onlyTiers?.length ? step.onlyTiers.map((key) => offerT(key)).join(" + ") : undefined,
      image: imageExists(image) ? image : null,
    };
  });
}

export default async function TourDetailView({tour, mode, tier, imagePaths, offerState}: {tour: TourRecord; mode: ExperienceMode; tier?: Tier; imagePaths: string[]; offerState?: OfferQueryState}) {
  const locale = await getLocale() as Locale;
  const detailT = await getTranslations({locale, namespace: "TourDetail"});
  const offerT = await getTranslations({locale, namespace: "TourOffers"});
  const routeT = await getTranslations({locale, namespace: "RoutePages"});
  const unit = tour.pricing.kind === "quote" ? undefined : tour.pricing.unit;
  const priceTier = tier ?? tour.recommendedTier ?? "standard";
  const basePrice = tour.pricing.kind === "single" ? tour.pricing.amount : tour.pricing.kind === "offers" ? tour.pricing.tiers[priceTier] : undefined;
  const transferPrices = getAirportTransferPrices();
  const totals = basePrice !== undefined && unit ? calculatePrice({unit, tierPrice: basePrice, travelers: offerState?.travelers ?? 2, arrival: offerState?.arrival ?? "none", departure: offerState?.departure ?? "none", transferPrices}) : undefined;
  const departurePlace = tour.startPlace?.[locale] ?? tour.destination[locale];
  const priceUnit = unit ? detailT(unitKey(unit)) : "";
  const caption = unit === "person" || unit === "ticket" ? `${formatPrice(locale, totals?.baseUnitPrice ?? basePrice ?? 0)} ${priceUnit} · ${detailT("departsFromShort", {place: departurePlace})}` : priceUnit;
  const leadTitle = tour.details.leadTitle?.[locale] ?? detailT("leadFallback");
  const itinerary = getItineraryItems({tour, locale, detailT, offerT});
  const routePlaces = tour.details.places ?? [];
  const visibleRoutePlaces = routePlaces.map((place) => ({id: place.id, name: place.name[locale]}));
  const mealLabels: Record<MealType, string> = {breakfast: detailT("mealBreakfast"), lunch: detailT("mealLunch"), dinner: detailT("mealDinner")};
  const tripPlaces = routePlaces.map((place) => {
    const image = DETAIL_PLACE_IMAGES[place.id] ?? `/images/places/${place.id}.jpg`;
    return {id: place.id, name: place.name[locale], image: imageExists(image) ? image : null};
  });
  const breadcrumbs = [{name: detailT("home"), path: `/${locale}`}, {name: routeT("allTours"), path: localizedToursPath(locale)}, {name: tour.title[locale], path: localizedTourPath(locale, tour, mode === "tier" ? "tier" : "detail", tier)}];
  const faq = tour.details.faqs.map((item) => ({question: item.q[locale], answer: item.a[locale]}));
  const itinerarySchema = tour.details.days?.map((day) => `${detailT("day", {number: day.day})}: ${day.title[locale]}`) ?? tour.details.steps?.map((step) => step.title[locale]) ?? [];
  const selectedStays = tour.stays?.[tier ?? priceTier] ?? [];
  const stayImages = selectedStays.map((stay) => {
    const image = `/images/places/${slugify(stay.name.en)}.jpg`;
    return imageExists(image) ? image : null;
  });
  const cityGallery = imagePaths[0] ?? tour.image;
  const quoteOnly = tour.pricing.kind === "quote";

  return <main className={`${openSans.variable} detail-page ${tour.details.layout === "wellness" ? "is-wellness" : ""}`}>
    <JsonLd data={[breadcrumbListSchema(breadcrumbs), ...(faq.length ? [faqPageSchema(faq)] : []), {"@type": "TouristTrip", name: tour.title[locale], description: tour.summary[locale], touristType: [tour.category[locale]], itinerary: itinerarySchema}]} />
    <section className="detail-hero" aria-label={tour.title[locale]}>{imageExists(cityGallery) ? <Image src={cityGallery} alt={`${tour.destination[locale]} — ${tour.title[locale]}`} fill priority sizes="100vw" className="object-cover"/> : <div className="detail-image-fallback" aria-hidden="true"/>}</section>
    <div className="detail-container">
      <nav aria-label={detailT("breadcrumb")} className="detail-breadcrumb">{breadcrumbs.map((crumb, index) => <span key={`${crumb.name}-${index}`}>{index ? <span aria-hidden="true">›</span> : null}{index === breadcrumbs.length - 1 ? <span aria-current="page">{crumb.name}</span> : index === 0 ? <Link href="/">{crumb.name}</Link> : <Link href="/tours">{crumb.name}</Link>}</span>)}</nav>
      <TourBookingProvider initialState={offerState}>
        <header className="detail-title-block">
          <div className="min-w-0"><p className="detail-eyebrow">{tour.destination[locale]}{tour.durationDays ? `, ${tour.durationDays} ${detailT("days").toLowerCase()}` : ` · ${tour.duration[locale]}`} · {tour.category[locale]}</p><h1>{tour.title[locale]}</h1></div>
          <TourPriceSummary tour={tour} tier={tier} basePrice={basePrice} transferPrices={transferPrices} labels={{price: detailT("priceLabel"), onRequest: detailT("onRequest"), totalFor: offerT.raw("totalFor") as string, unit: priceUnit, caption: quoteOnly ? detailT("quotePriceNote") : caption}} />
        </header>
        <TourBookingBar tour={tour} tier={tier} price={basePrice ?? 0} transferPrices={transferPrices} labels={{date: detailT("date"), travelers: detailT("travelers"), book: detailT("bookNow"), offer: detailT("offerField"), compare: detailT("compareOffers"), quote: detailT("quote"), perPerson: detailT("perPerson"), perVehicle: detailT("perVehicle"), perGroup: detailT("perGroup"), perTicket: detailT("perTicket"), totalFor: offerT.raw("totalFor") as string}} />
      </TourBookingProvider>

      <section className="detail-intro-section" aria-labelledby="detail-lead-title">
        <h2 id="detail-lead-title">{leadTitle}</h2>
        <div className="detail-intro-layout">
          <div className="detail-map-card" aria-label={detailT("facts")}>
            {tour.details.layout === "multi-day" && visibleRoutePlaces.length > 1
              ? <RouteDiagram places={visibleRoutePlaces} start={visibleRoutePlaces[0].name} end={visibleRoutePlaces[visibleRoutePlaces.length - 1].name}/>
              : <div className="detail-map-photo">{imageExists(tour.image) ? <Image src={tour.image} alt="" fill sizes="(max-width: 992px) 100vw, 45vw" className="object-cover"/> : null}</div>}
            <div className="detail-map-card-footer"><span>{detailT("durationTrip")}: <strong>{tour.duration[locale]}</strong></span><a className="detail-outline-button" href="#detail-itinerary-title">{detailT("viewMapBudget")}</a></div>
          </div>
          <div className="detail-intro-copy">
            {tour.details.overview.map((paragraph, index) => <p key={index}>{paragraph[locale]}</p>)}
            <div className="detail-info-copy">{!quoteOnly && tour.details.layout !== "service" ? <div><strong>{detailT("departureDate")}</strong><span>{offerState?.date || detailT("selectDate")}</span></div> : null}<p>{tour.durationDays ? `${tour.durationDays} ${detailT("days").toLowerCase()} · ${tour.durationNights ?? 0} ${detailT("nights").toLowerCase()}` : tour.duration[locale]}</p><div className="detail-info-actions">{!quoteOnly && tour.details.layout !== "service" ? <ChooseDateButton label={detailT("chooseDate")}/> : null}<ShareButton label={detailT("share")} copied={detailT("shareCopied")}/></div></div>
            {tour.details.layout === "multi-day" && visibleRoutePlaces.length > 1 ? <ol className="detail-route-list" aria-label={`${visibleRoutePlaces[0].name} to ${visibleRoutePlaces[visibleRoutePlaces.length - 1].name}`}>{visibleRoutePlaces.map((place) => <li key={place.id}><MapPin size={14} aria-hidden="true"/>{place.name}</li>)}</ol> : null}
          </div>
        </div>
      </section>
    </div>

    <div className="detail-container detail-content-container" id="detail-itinerary">
      <ItineraryExplorer items={itinerary} title={tour.details.layout === "wellness" ? detailT("ritual") : tour.details.layout === "service" ? detailT("howItWorks") : detailT("itinerary")} mealLabels={mealLabels} includeLabel={detailT("includesLabel")}/>
    </div>

    {(tour.details.included.length || tour.details.notIncluded.length) ? <section className="detail-includes-band" aria-labelledby="detail-includes-title">
      <div className="detail-container"><div className="detail-includes-grid">
        <div><h2 id="detail-includes-title">{detailT("included")}</h2><ul>{tour.details.included.map((item, index) => <li key={index}><Check size={17} aria-hidden="true"/>{item[locale]}</li>)}</ul></div>
        <div><h2>{detailT("notIncluded")}</h2><ul>{tour.details.notIncluded.map((item, index) => <li key={index}><X size={17} aria-hidden="true"/>{item[locale]}</li>)}</ul></div>
      </div></div>
    </section> : null}

    {tripPlaces.length > 1 ? <div className="detail-container"><PlacesCarousel places={tripPlaces} title={detailT("placesVisited")} previous={detailT("previous")} next={detailT("next")}/></div> : null}

    {tour.details.layout === "day-tour" && tour.details.meeting ? <div className="detail-container"><section className="detail-meeting-card" aria-labelledby="detail-meeting-title"><h2 id="detail-meeting-title">{detailT("meeting")}</h2><p><MapPin size={18} aria-hidden="true"/>{tour.details.meeting[locale]}</p><small>{detailT("pickupNote")}</small></section></div> : null}

    {selectedStays.length && tour.details.layout === "multi-day" ? <div className="detail-container"><StaySwitcher stays={selectedStays} images={stayImages} title={detailT("hotelsProvided")} description={detailT("staysHelper")} offerName={tier ? offerT(tier) : offerT("recommendedLabel")} nightLabel={(number) => detailT("nightOf", {number})} locale={locale}/></div> : null}

    {tour.details.layout === "service" && tour.pricing.kind === "offers" ? <section className="detail-container"><div className="detail-vehicle-options"><h2>{detailT("vehicleOptions")}</h2><ul>{(["economic", tour.recommendedTier === "economic" ? "standard" : tour.recommendedTier ?? "standard"] as Tier[]).map((vehicleTier) => <li key={vehicleTier}><span>{offerT(vehicleTier)} {detailT("vehicle")}</span><strong>{formatPrice(locale, tour.pricing.kind === "offers" ? tour.pricing.tiers[vehicleTier] : 0)} <small>{offerT(offerUnitKey("vehicle"))}</small></strong></li>)}</ul></div></section> : null}

    {(tour.details.goodToKnow?.length || tour.details.bring?.length) ? <section className="detail-notes-band"><div className="detail-container"><div className="detail-notes-card"><h2>{detailT("importantInformation")}</h2><ul>{[...(tour.details.goodToKnow ?? []), ...(tour.details.bring ?? [])].map((note, index) => <li key={index}>{note[locale]}</li>)}</ul></div></div></section> : null}

    <div className="detail-container detail-after-content">
      {faq.length ? <section className="detail-faq" aria-labelledby="detail-faq-title"><h2 id="detail-faq-title">{detailT("faq")}</h2><div>{tour.details.faqs.map((item, index) => <details key={index}><summary>{item.q[locale]}<span aria-hidden="true">+</span></summary><p>{item.a[locale]}</p></details>)}</div></section> : null}
    </div>

  </main>;
}
