import {existsSync} from "node:fs";
import path from "node:path";
import {Open_Sans, Playball} from "next/font/google";
import {getTranslations} from "next-intl/server";
import OffersComparisonClient from "@/components/tour-detail/OffersComparisonClient";
import JsonLd, {breadcrumbListSchema, faqPageSchema} from "@/components/seo/JsonLd";
import {getAirportTransferPrices} from "@/lib/tour-catalog";
import {bookHref, localizedTourPath, localizedToursPath, offerHref} from "@/lib/hrefs";
import type {Locale} from "@/i18n/routing";
import type {Tier, TourRecord} from "@/types/tour-catalog";
import type {OfferQueryState} from "@/lib/tour-query";
import {siteUrl} from "@/lib/seo/metadata";

const tiers: Tier[] = ["economic", "standard", "premium"];
const getDisplayTiers = (recommended?: Tier): Tier[] => ["economic", recommended === "economic" ? "standard" : recommended ?? "standard"];
const openSans = Open_Sans({subsets: ["latin"], display: "swap"});
const playball = Playball({weight: "400", subsets: ["latin"], display: "swap", variable: "--font-playball"});
type OfferTour = TourRecord & {pricing: Extract<TourRecord["pricing"], {kind: "offers"}>};

export default async function OffersComparisonPage({tour, locale, imagePaths, state}: {tour: OfferTour; locale: Locale; imagePaths: string[]; state: OfferQueryState}) {
  const t = await getTranslations({locale, namespace: "TourOffers"});
  const detailT = await getTranslations({locale, namespace: "TourDetail"});
  const routeT = await getTranslations({locale, namespace: "RoutePages"});
  const tierLabels = Object.fromEntries(tiers.map((tier) => [tier, t(tier)])) as Record<Tier, string>;
  const displayTiers = getDisplayTiers(tour.recommendedTier);
  const labels = {
    morocco: t("morocco"), departsFrom: t("departsFrom"), change: t("change"), date: detailT("date"), travelers: t("travelersCount"), selectDate: t("selectDate"),
    totalFor: t.raw("totalFor"), totalPrice: t("totalPrice"), priceBreakdown: t("priceBreakdown"), baseTour: t("baseTour"), arrivalTransfer: t("arrivalTransfer"), departureTransfer: t("departureTransfer"),
    differences: t("showDifferencesOnly"), recommended: t("recommendedLabel"), travelStyle: t("travelStyle"), whereSleep: t("whereSleep"), nights: t("nights"), board: t("board"),
    included: t("experienceSection"), transfers: t("transferSection"), arrivalLeg: t("arrivalLeg"), departureLeg: t("departureLeg"), none: t("none"), details: t("viewDetails"),
    book: t("bookNow"), yes: t("yes"), no: t("no"), previous: t("previous"), next: t("next"),
    guesthouse: t("guesthouse"), priceUnit: t("unitVehicle"), groupUnit: t("unitGroup"), ticketUnit: t("unitTicket"), info: "i", standardVehicle: t("standardVehicle"), premiumVehicle: t("premiumVehicle"),
    arrivalDate: detailT("date"), totalLabel: t("totalFor"), perPerson: t("unitPerTraveler"), destination: tour.destination[locale],
    night: t.raw("nightLabel"),
    home: detailT("home"), allTours: routeT("allTours"),
    itinerary: detailT("itinerary"), day: detailT("day", {number: ""}).trim(), select: t("select"), selected: t("selected"),
    economicSelection: t("economicSelection"), recommendedSelection: t("recommendedSelection"),
  };
  const faq = tour.details.faqs.map((item) => ({question: item.q[locale], answer: item.a[locale]}));
  const breadcrumbs = [
    {name: detailT("home"), path: `/${locale}`},
    {name: routeT("allTours"), path: localizedToursPath(locale)},
    {name: tour.title[locale], path: localizedTourPath(locale, tour, "offers")},
  ];
  const stayImages = Object.fromEntries(tiers.map((tier) => [tier, (tour.stays?.[tier] ?? []).map((stay) => {
    const id = stay.name.en.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const imagePath = `/images/places/${id}.jpg`;
    return existsSync(path.join(process.cwd(), "public", imagePath.slice(1))) ? imagePath : null;
  })])) as Record<Tier, (string | null)[]>;
  return <main className={`${openSans.className} ${playball.variable} min-h-screen bg-[#F7F7F7] pb-8 text-[#222]`}>
    <JsonLd data={[
      breadcrumbListSchema(breadcrumbs), faqPageSchema(faq),
      {"@type": "Product", name: tour.title[locale], description: tour.summary[locale], offers: displayTiers.map((tier) => ({"@type": "Offer", name: t(tier), price: tour.pricing.tiers[tier], priceCurrency: "EUR", url: `${siteUrl}${localizedTourPath(locale, tour, "tier", tier)}`}))},
      {"@type": "TouristTrip", name: tour.title[locale], description: tour.summary[locale], touristType: [tour.category[locale]]},
    ]} />
    <div className="mx-auto max-w-[1400px] px-4 pb-12 pt-3 xl:px-5">
      <OffersComparisonClient tour={tour} locale={locale} slug={tour.slug} images={imagePaths} stayImages={stayImages} transferPrices={getAirportTransferPrices()} initialState={state}
        detailHrefs={Object.fromEntries(tiers.map((tier) => [tier, offerHref(tour, tier, locale)])) as Record<Tier, ReturnType<typeof offerHref>>}
        bookingHrefs={Object.fromEntries(tiers.map((tier) => [tier, bookHref(tour, tier)])) as Record<Tier, ReturnType<typeof bookHref>>}
        labels={labels} tierLabels={tierLabels} />
    </div>
  </main>;
}
