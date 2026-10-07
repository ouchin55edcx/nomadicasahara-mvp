"use client";

import {createContext, useContext, useMemo, useState, type ReactNode} from "react";
import {useLocale} from "next-intl";
import type {Locale} from "@/i18n/routing";
import type {OfferQueryState} from "@/lib/tour-query";
import type {TourRecord, Tier} from "@/types/tour-catalog";
import {calculatePrice, formatPrice, type TransferTier} from "@/lib/pricing";

type BookingState = {date: string; travelers: number; arrival: TransferTier; departure: TransferTier; setDate: (date: string) => void; setTravelers: (travelers: number) => void};
const BookingContext = createContext<BookingState | null>(null);

export function TourBookingProvider({initialState, children}: {initialState?: OfferQueryState; children: ReactNode}) {
  const [date, setDate] = useState(initialState?.date ?? "");
  const [travelers, setTravelers] = useState(initialState?.travelers ?? 2);
  const state = useMemo(() => ({date, travelers, arrival: initialState?.arrival ?? "none", departure: initialState?.departure ?? "none", setDate, setTravelers}), [date, travelers, initialState?.arrival, initialState?.departure]);
  return <BookingContext.Provider value={state}>{children}</BookingContext.Provider>;
}

export function useTourBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error("Tour booking controls must be inside TourBookingProvider.");
  return context;
}

export function TourPriceSummary({tour, tier, basePrice, transferPrices, labels}: {
  tour: TourRecord; tier?: Tier; basePrice?: number; transferPrices: Record<Tier, number>;
  labels: {price: string; onRequest: string; totalFor: string; unit: string; caption: string};
}) {
  const locale = useLocale() as Locale;
  const {travelers, arrival, departure} = useTourBooking();
  const unit = tour.pricing.kind === "quote" ? undefined : tour.pricing.unit;
  const amount = basePrice === undefined || !unit ? undefined : calculatePrice({unit, tierPrice: basePrice, travelers, arrival, departure, transferPrices}).total;
  const label = tour.pricing.kind === "quote" ? labels.onRequest : tier && (unit === "person" || unit === "ticket") ? labels.totalFor.replace("{travelers}", String(travelers)) : labels.price;
  return <div className="detail-price-block"><span>{label}</span>{amount === undefined ? null : <strong>{formatPrice(locale, amount)}</strong>}<small>{amount === undefined ? labels.caption : labels.caption}</small></div>;
}
