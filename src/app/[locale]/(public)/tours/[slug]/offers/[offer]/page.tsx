import {notFound, permanentRedirect} from "next/navigation";
import type {Locale} from "@/i18n/routing";
import {getPublicProductBySlug} from "@/app/actions/catalog";
import TourDetailView, {buildTourMetadata} from "@/components/tour-detail/TourExperiencePage";
import {isLocale, resolveTier} from "@/lib/tour-route";
import {localizedTourPath} from "@/lib/hrefs";
import {parseOfferQuery} from "@/lib/tour-query";

export const dynamicParams = true;

type Props = {params: Promise<{locale: string; slug: string; offer: string}>; searchParams: Promise<{date?: string; travelers?: string; arrival?: string; departure?: string; diff?: string}>};

export function generateStaticParams({params}: {params: {locale: string}}) {
  void params;
  return [];
}

export async function generateMetadata({params}: Props) {
  const {locale: rawLocale, slug, offer} = await params;
  if (!isLocale(rawLocale)) return {};
  const locale: Locale = rawLocale;
  const tour = await getPublicProductBySlug(slug);
  if (!tour) return {};
  if (tour.pricing.kind !== "offers") return {};
  const tier = resolveTier(offer, locale, tour);
  return buildTourMetadata(tour, "tier", tier);
}

export default async function TourOfferRoute({params, searchParams}: Props) {
  const [{locale: rawLocale, slug, offer}, query] = await Promise.all([params, searchParams]);
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const tour = await getPublicProductBySlug(slug);
  if (!tour) notFound();
  if (tour.pricing.kind !== "offers") permanentRedirect(localizedTourPath(locale, tour, "detail"));
  const tier = resolveTier(offer, locale, tour);
  return <TourDetailView tour={tour} mode="tier" tier={tier} imagePaths={tour.gallery.length ? tour.gallery : [tour.image]} offerState={parseOfferQuery(query, tour)} />;
}
