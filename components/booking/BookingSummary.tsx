"use client";

import Image from "next/image";
import { CalendarDays, Gift, Bus, Ticket } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PRICING, bookingSummary, money, promoList, type Stay } from "./checkout-data";
import PriceTotal from "./PriceTotal";
import PromoCard from "./PromoCard";

const promoIcons: Record<string, LucideIcon> = {
  gift: Gift,
  ticket: Ticket,
  calendar: CalendarDays,
};

function Stars({ rating }: { rating: number }) {
  const color = rating >= 4 ? "text-[#66B600]" : "text-[#F5A623]";
  return (
    <div className="flex gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: rating }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" className={`h-3.5 w-3.5 ${color}`}>
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function SummaryStay({ stay }: { stay: Stay }) {
  return (
    <div className="border-b border-[#E5E5E5]">
      <Image
        src={stay.image}
        alt={stay.title}
        width={640}
        height={360}
        className="h-44 w-full object-cover"
      />
      <div className="px-4 py-4">
        <h3 className="text-base font-semibold leading-snug text-[#1A1A1A]">{stay.title}</h3>
        <div className="mt-1.5">
          <Stars rating={stay.rating} />
        </div>
        <p className="mt-2 text-xs text-[#222]/70">{stay.address}</p>
        <p className="mt-1 text-xs text-[#222]/70">{stay.dates}</p>
        <p className="mt-1 text-xs text-[#222]/70">{stay.occupancy}</p>
        <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-[#66B600]">
          <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#66B600] text-[9px] font-bold text-white">
            ✓
          </span>
          {stay.refundNote}
        </p>
      </div>
    </div>
  );
}

export default function BookingSummary() {
  const { tour, stays, segments } = bookingSummary;

  return (
    <div className="overflow-hidden rounded-md border border-[#E5E5E5] bg-white">
      <div className="bg-[#1A1A1A] px-5 py-3.5 text-sm font-bold uppercase tracking-wide text-white">
        Resumen de tu reserva
      </div>

      <div className="lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
        <SummaryStay stay={tour} />
        {stays.map((stay) => (
          <SummaryStay key={stay.title} stay={stay} />
        ))}

        {/* Traslados del itinerario */}
        {segments.map((segment) => (
          <div key={segment.id} className="border-b border-[#E5E5E5] px-4 py-4">
            <p className="text-sm font-semibold text-[#1A1A1A]">{segment.day}</p>

            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="text-left">
                <p className="text-lg font-bold leading-none text-[#1A1A1A]">
                  {segment.departTime}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#1A1A1A]">
                  {segment.departCode}
                </p>
                <p className="text-[11px] text-[#222]/60">{segment.departName}</p>
              </div>

              <div className="flex-1 text-center">
                <Bus className="mx-auto h-4 w-4 text-[#66B600]" aria-hidden />
                <div className="mx-auto mt-1 h-px w-full bg-[#E5E5E5]" />
                <p className="mt-1 text-[10px] uppercase tracking-wide text-[#222]/60">
                  {segment.label}
                </p>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold leading-none text-[#1A1A1A]">
                  {segment.arriveTime}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#1A1A1A]">
                  {segment.arriveCode}
                </p>
                <p className="text-[11px] text-[#222]/60">{segment.arriveName}</p>
              </div>
            </div>

            <p className="mt-3 text-[11px] leading-relaxed text-[#222]/70">
              {segment.operator}
            </p>
          </div>
        ))}

        {/* Servicios / desglose básico */}
        <div className="border-b border-[#E5E5E5] bg-[#EAF6D6] px-4 py-4">
          <p className="text-sm font-semibold text-[#1A1A1A]">Servicios</p>
          <div className="mt-3 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-[#222]">Precio base</p>
                <p className="text-[11px] text-[#222]/60">Precio base del viaje</p>
              </div>
              <p className="text-sm font-semibold text-[#1A1A1A]">
                {money(PRICING.baseTotal)}
              </p>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-[#222]">Tasas</p>
                <p className="text-[11px] text-[#222]/60">Tasas y gastos de gestión</p>
              </div>
              <p className="text-sm font-semibold text-[#1A1A1A]">{money(PRICING.taxes)}</p>
            </div>
          </div>
        </div>

        {/* Promociones */}
        <div className="border-b border-[#E5E5E5]">
          <div className="bg-[#EAF6D6] px-4 py-2.5">
            <p className="text-sm font-semibold text-[#1A1A1A]">Promociones</p>
          </div>
          <div className="px-4 pb-2">
            {promoList.map((promo) => (
              <PromoCard
                key={promo.id}
                icon={promoIcons[promo.icon]}
                tag={promo.tag}
                text={promo.text}
              />
            ))}
          </div>
        </div>

        <PriceTotal />
      </div>
    </div>
  );
}
