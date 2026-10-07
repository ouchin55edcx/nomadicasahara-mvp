import {notFound, permanentRedirect} from "next/navigation";
import {routing, type Locale} from "@/i18n/routing";
import {allTourRecords} from "@/data/static/tour-catalog";
import TourDetailView, {buildTourMetadata} from "@/components/tour-detail/TourExperiencePage";
import {getTourPhotos, isLocale, resolveTier, resolveTour} from "@/lib/tour-route";
import {offerSlugs} from "@/lib/tour-catalog";
import {localizedTourPath} from "@/lib/hrefs";
import {parseOfferQuery} from "@/lib/tour-query";

export const dynamicParams = true;

type Props = {params: Promise<{locale: string; slug: string; offer: string}>; searchParams: Promise<{date?: string; travelers?: string; arrival?: string; departure?: string; diff?: string}>};

export function generateStaticParams({params}: {params: {locale: string}}) {
  const locale = isLocale(params.locale) ? params.locale : routing.defaultLocale;
  return allTourRecords.filter((tour) => tour.pricing.kind === "offers").flatMap((tour) => Object.values(offerSlugs[locale]).map((offer) => ({slug: tour.slug, offer})));
}

export async function generateMetadata({params}: Props) {
  const {locale: rawLocale, slug, offer} = await params;
  if (!isLocale(rawLocale)) return {};
  const locale: Locale = rawLocale;
  const tour = resolveTour(slug);
  if (tour.pricing.kind !== "offers") return {};
  const tier = resolveTier(offer, locale, tour);
  return buildTourMetadata(tour, "tier", tier);
}

export default async function TourOfferRoute({params, searchParams}: Props) {
  const [{locale: rawLocale, slug, offer}, query] = await Promise.all([params, searchParams]);
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const tour = resolveTour(slug);
  if (tour.pricing.kind !== "offers") permanentRedirect(localizedTourPath(locale, tour, "detail"));
  const tier = resolveTier(offer, locale, tour);
  return <TourDetailView tour={tour} mode="tier" tier={tier} imagePaths={getTourPhotos(tour.id)} offerState={parseOfferQuery(query, tour)} />;
}
