"use client";

import {useEffect, useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import {useRouter} from "@/i18n/navigation";
import {Minus, Plus} from "lucide-react";
import type {Locale} from "@/i18n/routing";
import type {Tier, TourRecord} from "@/types/tour-catalog";
import {bookHref} from "@/lib/hrefs";
import {calculatePrice, formatPrice, type TransferTier} from "@/lib/pricing";
import type {OfferQueryState} from "@/lib/tour-query";

function unitLabel(unit: "person" | "vehicle" | "group" | "ticket", t: (key: "perPerson" | "perVehicle" | "perGroup" | "perTicket") => string) {
  return unit === "person" ? t("perPerson") : unit === "vehicle" ? t("perVehicle") : unit === "group" ? t("perGroup") : t("perTicket");
}

export default function BookingPanel({tour, tier, price, initialState, transferPrices}: {tour: TourRecord; tier?: Tier; price: number; initialState?: OfferQueryState; transferPrices: Record<Tier, number>}) {
  const t = useTranslations("TourDetail");
  const offerT = useTranslations("TourOffers");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [date, setDate] = useState(initialState?.date ?? "");
  const [travelers, setTravelers] = useState(initialState?.travelers ?? 2);
  const [arrival, setArrival] = useState<TransferTier>(initialState?.arrival ?? "none");
  const [departure, setDeparture] = useState<TransferTier>(initialState?.departure ?? "none");
  const [footerVisible, setFooterVisible] = useState(false);
  const unit = tour.pricing.kind === "quote" ? "person" : tour.pricing.unit;
  const travelerPricing = unit === "person" || unit === "ticket";
  const breakdown = calculatePrice({unit, tierPrice: price, travelers, arrival, departure, transferPrices});
  const total = breakdown.total;
  const formatted = (amount: number) => formatPrice(locale, amount);
  const startBooking = () => {
    if (!date) {
      document.getElementById("tour-date")?.focus();
      return;
    }
    router.push({...bookHref(tour, tier), query: {date, travelers: String(travelers), arrival: tour.transferAddon ? arrival : undefined, departure: tour.transferAddon ? departure : undefined}});
  };

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), {rootMargin: "0px"});
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return <>
    <aside className="rounded-2xl border border-line bg-white p-5 shadow-[0_14px_40px_-30px_rgba(0,0,0,.42)] md:sticky md:top-24">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#006D41]">{tier ? offerT(tier) : t("priceFrom")}</p>
      <p className="mt-2 text-3xl font-bold text-[#222]">{formatted(price)} <span className="text-xs font-medium text-muted">{unitLabel(unit, t)}</span></p>
      <p className="mt-2 text-xs leading-5 text-muted">{t("requestFirst")}</p>
      <div className="mt-5 space-y-4">
        <label className="block text-sm font-semibold" htmlFor="tour-date">{t("date")}<input id="tour-date" required type="date" min={new Date().toLocaleDateString("en-CA")} value={date} onChange={(event) => setDate(event.target.value)} className="mt-1.5 h-11 w-full rounded-md border border-line px-3 font-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006D41]" /></label>
        {travelerPricing ? <div><p className="text-sm font-semibold">{t("travelers")}</p><div className="mt-1.5 flex h-11 items-center justify-between rounded-md border border-line px-2"><button type="button" onClick={() => setTravelers((value) => Math.max(1, value - 1))} aria-label={t("decrease")} className="grid h-10 w-10 place-items-center rounded-full hover:bg-[#EAF6D6]"><Minus className="h-4 w-4" /></button><span className="font-semibold tabular-nums">{travelers}</span><button type="button" onClick={() => setTravelers((value) => Math.min(20, value + 1))} aria-label={t("increase")} className="grid h-10 w-10 place-items-center rounded-full hover:bg-[#EAF6D6]"><Plus className="h-4 w-4" /></button></div></div> : null}
      </div>
      {tour.transferAddon ? <fieldset className="mt-4 space-y-3 border-t border-line pt-4"><legend className="text-sm font-semibold">{offerT("transferSection")}</legend>{(["arrival", "departure"] as const).map((leg) => <label key={leg} className="block text-xs font-medium">{offerT(leg === "arrival" ? "arrivalLeg" : "departureLeg")}<select value={leg === "arrival" ? arrival : departure} onChange={(event) => (leg === "arrival" ? setArrival : setDeparture)(event.target.value as TransferTier)} className="mt-1 h-10 w-full rounded-md border border-line bg-white px-2"><option value="none">{offerT("none")}</option>{(["standard", "premium"] as Tier[]).map((transferTier) => <option key={transferTier} value={transferTier}>{offerT(transferTier === "standard" ? "standardVehicle" : "premiumVehicle")} · {formatted(transferPrices[transferTier])}</option>)}</select></label>)}</fieldset> : null}
      <div className="mt-5 border-t border-dashed border-[#006D41]/50 pt-4"><div className="flex justify-between gap-3 text-sm"><span>{t("estimatedTotal")}</span><b>{formatted(total)}</b></div>{breakdown.arrivalTotal ? <p className="mt-1 flex justify-between gap-2 text-xs"><span>{offerT("arrivalTransfer")}</span><span>{formatted(breakdown.arrivalTotal)}</span></p> : null}{breakdown.departureTotal ? <p className="mt-1 flex justify-between gap-2 text-xs"><span>{offerT("departureTransfer")}</span><span>{formatted(breakdown.departureTotal)}</span></p> : null}<p className="mt-1 text-xs text-muted">{t("finalPrice")}</p></div>
      <button type="button" onClick={startBooking} className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-[#67B500] px-4 text-sm font-bold text-black transition-colors hover:bg-[#80CA28] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006D41]">{t("bookNow")}</button>
    </aside>
    {!footerVisible ? <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_-24px_rgba(0,0,0,.4)] backdrop-blur md:hidden"><div className="mx-auto flex max-w-2xl items-center justify-between gap-3"><span><b className="block text-lg">{formatted(total)}</b><span className="text-[11px] text-muted">{unitLabel(unit, t)}</span></span><button type="button" onClick={startBooking} className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#67B500] px-5 text-sm font-bold text-black">{t("bookNow")}</button></div></div> : null}
    <span className="sr-only" lang={locale}>{tier ?? ""}</span>
  </>;
}
