import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {getTranslations} from "next-intl/server";
import BookingForm from "@/components/booking/BookingForm";
import {resolvePublicOfferId} from "@/lib/public-booking";
import {isLocale} from "@/lib/tour-route";
import type {Locale} from "@/i18n/routing";
import {parseOfferQuery} from "@/lib/tour-query";
import {getAirportTransferPrices} from "@/lib/tour-catalog";

export const dynamicParams = true;

type Props = {params: Promise<{locale: string; offerId: string}>; searchParams: Promise<{date?: string; travelers?: string; arrival?: string; departure?: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale: rawLocale} = await params;
  if (!isLocale(rawLocale)) return {robots: {index: false, follow: false}};
  const t = await getTranslations({locale: rawLocale, namespace: "Booking"});
  return {title: t("title"), robots: {index: false, follow: false}};
}

export default async function BookingRoute({params, searchParams}: Props) {
  const [{locale: rawLocale, offerId}, query] = await Promise.all([params, searchParams]);
  if (!isLocale(rawLocale)) notFound();
  const parsed = await resolvePublicOfferId(offerId);
  if (!parsed) notFound();
  const queryTravelers = Number(query.travelers);
  const initialTravelers = Number.isInteger(queryTravelers) && queryTravelers >= 1 && queryTravelers <= 20 ? queryTravelers : 2;
  const offerState = parseOfferQuery(query, parsed.tour);
  return <BookingForm offerId={offerId} parsed={parsed} locale={rawLocale as Locale} initialDate={offerState.date} initialTravelers={initialTravelers} initialArrival={offerState.arrival} initialDeparture={offerState.departure} transferPrices={getAirportTransferPrices()} />;
}
