"use client";

import {useEffect, useState} from "react";
import {CalendarDays, ChevronDown, MapPin, Minus, Plus, Tag, Users} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {Link, useRouter} from "@/i18n/navigation";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import type {Locale} from "@/i18n/routing";
import type {Tier, TourRecord} from "@/types/tour-catalog";
import {bookHref} from "@/lib/hrefs";
import {calculatePrice, formatPrice} from "@/lib/pricing";
import {useTourBooking} from "@/components/tour-detail/TourBookingContext";

export default function TourBookingBar({tour, tier, price, transferPrices, labels}: {
  tour: TourRecord; tier?: Tier; price: number; transferPrices: Record<Tier, number>;
  labels: {date: string; travelers: string; book: string; offer: string; compare: string; quote: string; perPerson: string; perVehicle: string; perGroup: string; perTicket: string; totalFor: string};
}) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const t = useTranslations("TourDetail");
  const [footerVisible, setFooterVisible] = useState(false);
  const {date, setDate, travelers, setTravelers, arrival, departure} = useTourBooking();
  const unit = tour.pricing.kind === "quote" ? undefined : tour.pricing.unit;
  const travelersPricing = unit === "person" || unit === "ticket";
  const isQuote = tour.pricing.kind === "quote";
  const noDate = tour.details.layout === "service";
  const today = new Date().toLocaleDateString("en-CA");
  const unitLabel = unit === "person" ? labels.perPerson : unit === "vehicle" ? labels.perVehicle : unit === "group" ? labels.perGroup : labels.perTicket;
  const currentTotal = unit ? calculatePrice({unit, tierPrice: price, travelers, arrival, departure, transferPrices}).total : price;
  const startBooking = () => {
    if (!noDate && !date) {
      document.getElementById("tour-date")?.focus();
      document.getElementById("tour-date")?.scrollIntoView({behavior: "smooth", block: "center"});
      return;
    }
    router.push({...bookHref(tour, tier), query: {
      date: date || undefined,
      travelers: String(travelers),
      arrival: tour.transferAddon && arrival !== "none" ? arrival : undefined,
      departure: tour.transferAddon && departure !== "none" ? departure : undefined,
    }});
  };

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting));
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const quoteLink = {pathname: "/contact" as const, query: {topic: "quote", tour: tour.slug}};
  const bookingButton = isQuote
    ? <Link href={quoteLink} className="detail-book-button">{labels.quote}</Link>
    : <button type="button" onClick={startBooking} className="detail-book-button">{labels.book}</button>;

  return <>
    <section aria-label={labels.book} className="detail-booking-bar">
      {!isQuote ? <>
        <label className="detail-booking-field" htmlFor="tour-date">
          <span>{labels.date}</span><span className="detail-booking-value"><input id="tour-date" type="date" min={today} value={date} onChange={(event) => setDate(event.target.value)} aria-label={labels.date}/><CalendarDays size={17} aria-hidden="true"/></span>
        </label>
        {travelersPricing ? <div className="detail-booking-field detail-traveler-field">
          <span>{labels.travelers}</span><Popover><PopoverTrigger asChild><button type="button" className="detail-booking-value"><span>{travelers}</span><Users size={17} aria-hidden="true"/><ChevronDown size={14} aria-hidden="true"/></button></PopoverTrigger><PopoverContent align="start" className="w-64 p-4">
            <div className="flex items-center justify-between"><span className="text-sm font-semibold">{labels.travelers}</span><div className="flex items-center gap-3"><button type="button" aria-label={t("decrease")} disabled={travelers <= 1} onClick={() => setTravelers(Math.max(1, travelers - 1))} className="grid h-9 w-9 place-items-center border border-line disabled:opacity-40"><Minus size={15}/></button><span className="min-w-5 text-center font-bold tabular-nums">{travelers}</span><button type="button" aria-label={t("increase")} disabled={travelers >= 20} onClick={() => setTravelers(Math.min(20, travelers + 1))} className="grid h-9 w-9 place-items-center border border-line disabled:opacity-40"><Plus size={15}/></button></div></div>
          </PopoverContent></Popover>
        </div> : null}
        <div className="detail-booking-field"><span>{t("start")}</span><span className="detail-booking-value"><span className="truncate">{tour.startPlace?.[locale] ?? tour.destination[locale]}</span><MapPin size={17} aria-hidden="true"/></span></div>
        {tier ? <div className="detail-booking-field detail-offer-field"><span>{labels.offer}</span><Link href={{pathname: "/tours/[slug]/offers", params: {slug: tour.slug}}} className="detail-booking-value"><span>{labels.compare}</span><Tag size={17} aria-hidden="true"/></Link></div> : null}
      </> : <div className="detail-booking-quote-copy"><span>{t("questions")}</span><span>{tour.summary[locale]}</span></div>}
      {bookingButton}
    </section>
    {!isQuote && !footerVisible ? <div className="detail-mobile-booking-bar"><span><strong>{formatPrice(locale, currentTotal)}</strong><small>{travelersPricing ? `${labels.totalFor.replace("{travelers}", String(travelers))} · ${unitLabel}` : unitLabel}</small></span>{bookingButton}</div> : null}
  </>;
}
