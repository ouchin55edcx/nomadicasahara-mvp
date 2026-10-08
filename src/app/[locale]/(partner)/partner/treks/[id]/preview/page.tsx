import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {getLocale} from "next-intl/server";
import {getTrekById} from "@/app/actions/treks";
import TourExperiencePage from "@/components/tour-detail/TourExperiencePage";
import OffersComparisonPage from "@/components/tour-detail/OffersComparisonPage";
import {parseOfferQuery} from "@/lib/tour-query";
import {trekToTour} from "@/lib/trek-tour";
import type {Locale} from "@/i18n/routing";
import type {Tier, TourRecord} from "@/types/tour-catalog";

export const metadata: Metadata = {title: "Trek preview", robots: {index: false, follow: false}};

export default async function TrekPreviewPage({params, searchParams}: {params: Promise<{id: string}>; searchParams: Promise<{view?: string; tier?: string}>}) {
  const [{id}, query, locale] = await Promise.all([params, searchParams, getLocale()]);
  const trek = await getTrekById(id);
  if (!trek) notFound();
  const tour = trekToTour(trek);
  const hasOffers = tour.pricing.kind === "offers";
  const tier = (["economic", "standard", "premium"].includes(query.tier || "") ? query.tier : "standard") as Tier;
  const offersView = hasOffers && query.view !== "detail" && query.view !== "tier";
  const tierView = hasOffers && query.view === "tier";
  const galleryImages: string[] = [];
  if (Array.isArray(trek.gallery_images)) {
    for (const image of trek.gallery_images) {
      if (typeof image === "string" && image.length > 0) galleryImages.push(image);
      else if (image && typeof image === "object" && typeof image.src === "string" && image.src.length > 0) galleryImages.push(image.src);
    }
  }
  const images = [typeof trek.cover_image === "string" ? trek.cover_image : "", ...galleryImages].filter(Boolean);
  const detailHref = `/${locale}/partner/treks/${id}/preview`;
  return <div className="min-h-screen bg-white">
    <div className="sticky top-0 z-[100] flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-5 py-3 text-sm">
      <p className="font-semibold text-amber-950">Preview · {trek.status === "published" ? "Published version" : "Draft"}</p>
      <div className="flex items-center gap-3"><Link href={hasOffers ? `${detailHref}?view=detail` : detailHref} className="font-medium text-amber-950 underline">Tour page</Link>{hasOffers ? <Link href={`${detailHref}?view=offers`} className="font-medium text-amber-950 underline">Offers page</Link> : null}<Link href={`/${locale}/partner/treks/${id}/edit`} className="rounded-full bg-amber-900 px-4 py-2 font-bold text-white">Back to editing</Link></div>
    </div>
    {offersView ? <OffersComparisonPage tour={tour as Extract<TourRecord, {pricing: {kind: "offers"}}>} locale={locale as Locale} imagePaths={images} state={parseOfferQuery({}, tour)} previewDetailsBase={detailHref}/> : <TourExperiencePage tour={tour} mode={tierView ? "tier" : "detail"} tier={tierView ? tier : undefined} imagePaths={images}/>}
  </div>;
}
