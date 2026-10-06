import {permanentRedirect} from "next/navigation";
import {allTourRecords} from "@/data/static/tour-catalog";
import TourExperiencePage, {buildTourMetadata} from "@/components/tour-detail/TourExperiencePage";
import {getTourPhotos, isLocale, resolveTour} from "@/lib/tour-route";
import {localizedTourPath} from "@/lib/hrefs";
import type {Locale} from "@/i18n/routing";

export const dynamicParams = true;

type Props = {params: Promise<{locale: string; slug: string}>};

export function generateStaticParams() {
  return allTourRecords.map((tour) => ({slug: tour.slug}));
}

export async function generateMetadata({params}: Props) {
  const {locale: rawLocale, slug} = await params;
  if (!isLocale(rawLocale)) return {};
  return buildTourMetadata(resolveTour(slug), "detail");
}

export default async function TourDetailRoute({params}: Props) {
  const {locale: rawLocale, slug} = await params;
  if (!isLocale(rawLocale)) return null;
  const locale: Locale = rawLocale;
  const tour = resolveTour(slug);
  if (tour.pricing.kind === "offers") permanentRedirect(localizedTourPath(locale, tour, "offers"));
  return <TourExperiencePage tour={tour} mode="detail" imagePaths={getTourPhotos(tour.id)} />;
}
