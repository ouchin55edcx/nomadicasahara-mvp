import {notFound, permanentRedirect} from "next/navigation";
import {getPublicProductBySlug} from "@/app/actions/catalog";
import TourDetailView, {buildTourMetadata} from "@/components/tour-detail/TourExperiencePage";
import {isLocale} from "@/lib/tour-route";
import {localizedTourPath} from "@/lib/hrefs";
import {parseOfferQuery} from "@/lib/tour-query";
import type {Locale} from "@/i18n/routing";

export const dynamicParams = true;

type Props = {params: Promise<{locale: string; slug: string}>; searchParams: Promise<{date?: string; travelers?: string; arrival?: string; departure?: string}>};

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({params}: Props) {
  const {locale: rawLocale, slug} = await params;
  if (!isLocale(rawLocale)) return {};
  const tour = await getPublicProductBySlug(slug);
  return tour ? buildTourMetadata(tour, "detail") : {};
}

export default async function TourDetailRoute({params, searchParams}: Props) {
  const [{locale: rawLocale, slug}, query] = await Promise.all([params, searchParams]);
  if (!isLocale(rawLocale)) return null;
  const locale: Locale = rawLocale;
  const tour = await getPublicProductBySlug(slug);
  if (!tour) notFound();
  if (tour.pricing.kind === "offers") permanentRedirect(localizedTourPath(locale, tour, "offers"));
  return <TourDetailView tour={tour} mode="detail" imagePaths={tour.gallery.length ? tour.gallery : [tour.image]} offerState={parseOfferQuery(query, tour)} />;
}
