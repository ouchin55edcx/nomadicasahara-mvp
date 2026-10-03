"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  BedDouble,
  Check,
  Coffee,
  CreditCard,
  Utensils,
} from "lucide-react";
import type { Product } from "@/content/catalog";

type RoomRate = {
  id: string;
  mealPlan: string;
  cancellation: string;
  freeCancellation: boolean;
  nightlyExtra: number;
};

const roomRates: RoomRate[] = [
  {
    id: "room-only",
    mealPlan: "Solo alojamiento",
    cancellation: "Tarifa no reembolsable",
    freeCancellation: false,
    nightlyExtra: 0,
  },
  {
    id: "breakfast-flex",
    mealPlan: "Desayuno",
    cancellation: "Cancelación gratis",
    freeCancellation: true,
    nightlyExtra: 12,
  },
  {
    id: "half-board",
    mealPlan: "Media pensión",
    cancellation: "Cancelación gratis",
    freeCancellation: true,
    nightlyExtra: 28,
  },
];

const roomTypes = [
  { id: "classic", title: "Habitación Clásica", multiplier: 1, imageIndex: 0 },
  { id: "premium", title: "Habitación Premium", multiplier: 1.35, imageIndex: 1 },
  { id: "suite", title: "Suite", multiplier: 1.7, imageIndex: 2 },
];

export default function RoomList({ hotel }: { hotel: Product }) {
  const [freeCancellationOnly, setFreeCancellationOnly] = useState(false);
  const [priceMode, setPriceMode] = useState<"stay" | "night">("stay");
  const nights = 6;
  const visibleRates = roomRates.filter(
    (rate) => !freeCancellationOnly || rate.freeCancellation,
  );

  return (
    <section id="rooms" aria-labelledby="rooms-title" className="mt-8">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="rooms-title" className="text-xl font-semibold">
            Habitaciones disponibles
          </h2>
          <p className="mt-1 text-xs text-muted">
            Elige el régimen y las condiciones que mejor te convengan.
          </p>
        </div>
        <p className="text-xs text-muted">3 tipos de habitación · 2 adultos</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border border-line bg-white px-3 py-2.5 text-xs">
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-muted">
          <span>Entrada <strong className="font-medium text-ink">11/01/2027</strong></span>
          <span>Salida <strong className="font-medium text-ink">17/01/2027</strong></span>
          <span>Habitación/personas <strong className="font-medium text-ink">1 habitación / 2 adultos</strong></span>
        </p>
        <button type="button" className="font-semibold text-green-700 underline decoration-green-500 underline-offset-2 hover:text-green-800">
          Cambiar búsqueda
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 bg-green-50 p-3">
        <button
          type="button"
          aria-pressed={freeCancellationOnly}
          onClick={() => setFreeCancellationOnly((current) => !current)}
          className={`inline-flex min-h-9 items-center gap-2 border px-3 text-xs font-medium transition-colors ${freeCancellationOnly ? "border-green-600 bg-green-100 text-green-800" : "border-green-200 bg-white text-ink hover:border-green-500"}`}
        >
          <Check className="h-3.5 w-3.5 text-green-700" aria-hidden="true" />
          Cancelación gratis
        </button>

        <div className="inline-flex border border-green-200 bg-white p-0.5 text-xs">
          <button
            type="button"
            aria-pressed={priceMode === "stay"}
            onClick={() => setPriceMode("stay")}
            className={`px-3 py-1.5 font-medium ${priceMode === "stay" ? "bg-green-700 text-white" : "text-green-800 hover:bg-green-50"}`}
          >
            Precio por estancia
          </button>
          <button
            type="button"
            aria-pressed={priceMode === "night"}
            onClick={() => setPriceMode("night")}
            className={`px-3 py-1.5 font-medium ${priceMode === "night" ? "bg-green-700 text-white" : "text-green-800 hover:bg-green-50"}`}
          >
            Precio por noche
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-3">
        {roomTypes.map((room) => {
          const roomImage =
            hotel.gallery?.[room.imageIndex] ??
            [hotel.image, "/images/tour-fez.jpg", "/images/tour-ciudades.jpg"][room.imageIndex];

          return (
            <article key={room.id} className="overflow-hidden border border-line bg-white">
              <div className="grid md:grid-cols-[170px_minmax(0,1fr)]">
                <div className="border-b border-line p-3 md:border-b-0 md:border-r">
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                    <Image
                      src={roomImage}
                      alt={room.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 170px"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-2 text-sm font-semibold">{room.title}</h3>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-muted">
                    <BedDouble className="h-3.5 w-3.5 text-green-700" aria-hidden="true" />
                    2 adultos · {nights} noches
                  </p>
                </div>

                <div className="divide-y divide-line">
                  {visibleRates.map((rate) => {
                    const totalPrice = Math.round(
                      (hotel.price + rate.nightlyExtra) * nights * room.multiplier,
                    );
                    const displayPrice =
                      priceMode === "stay" ? totalPrice : Math.ceil(totalPrice / nights);

                    return (
                      <div
                        key={`${room.id}-${rate.id}`}
                        className="grid gap-3 p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                      >
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 text-xs font-semibold">
                            {rate.mealPlan === "Solo alojamiento" ? (
                              <BedDouble className="h-3.5 w-3.5 text-green-700" aria-hidden="true" />
                            ) : rate.mealPlan === "Desayuno" ? (
                              <Coffee className="h-3.5 w-3.5 text-green-700" aria-hidden="true" />
                            ) : (
                              <Utensils className="h-3.5 w-3.5 text-green-700" aria-hidden="true" />
                            )}
                            {rate.mealPlan}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 text-[10px] text-gray-700">
                              <CreditCard className="h-3 w-3" aria-hidden="true" />
                              Pago seguro
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] ${rate.freeCancellation ? "bg-green-50 text-green-800" : "bg-orange-50 text-orange-800"}`}>
                              {rate.freeCancellation ? <Check className="h-3 w-3" aria-hidden="true" /> : null}
                              {rate.cancellation}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 border-t border-line pt-3 sm:border-0 sm:pt-0">
                          <div className="text-right sm:min-w-[112px]">
                            <p className="text-xl font-semibold leading-none text-green-700">
                              {displayPrice.toLocaleString("es-ES")} €
                            </p>
                            <p className="mt-1 text-[10px] text-muted">
                              {priceMode === "stay" ? `por ${nights} noches` : "por noche"}
                            </p>
                          </div>
                          <Link
                            href={`/booking/checkout?producto=${encodeURIComponent(hotel.slug)}&habitacion=${encodeURIComponent(room.title)}&regimen=${encodeURIComponent(rate.mealPlan)}`}
                            className="inline-flex min-h-10 shrink-0 items-center justify-center bg-green-700 px-5 text-xs font-semibold text-white transition-colors hover:bg-green-800"
                          >
                            RESERVAR
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}