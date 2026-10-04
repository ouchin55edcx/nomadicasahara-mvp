"use client";

import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  CalendarDays,
  Mail,
  MapPin,
  Package,
  User,
  Users,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import { formatActivity, formatMoney, formatPax } from "@/lib/format";
import { PARTNER, type Booking } from "@/data/partner-mock";
import {Link} from "@/i18n/navigation";

const PAYMENT_LABELS: Record<string, string> = {
  Pagado: "Pago recibido",
  Pendiente: "Pago pendiente",
  Reembolsado: "Reembolsado",
};

export default function BookingCard({
  booking,
  defaultOpen = false,
}: {
  booking: Booking;
  defaultOpen?: boolean;
}) {
  const detailHref = `/partner/dashboard/bookings/${booking.id}`;
  const [open, setOpen] = React.useState(defaultOpen);

  const extrasTotal = booking.extras.reduce((sum, e) => sum + e.price, 0);

  function handleSendEmail() {
    toast.success("Email enviado", {
      description: `Mensaje enviado a ${booking.customer.email}.`,
    });
  }

  return (
    <Accordion
      type="single"
      collapsible
      value={open ? "details" : ""}
      onValueChange={(v) => setOpen(v === "details")}
    >
      <AccordionItem value="details" className="overflow-hidden border-b-0 p-0">
        {/* ------------------------- Cabecera ------------------------- */}
        <div className="flex flex-col gap-4 p-4 transition-shadow duration-150 hover:shadow-md md:flex-row md:items-start md:p-5">
          {/* Imagen del producto */}
          <Link
            href={detailHref}
            className="shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600] focus-visible:ring-offset-2"
            aria-label={`Ver detalle de ${booking.productTitle}`}
          >
            <Image
              src={booking.image}
              alt={booking.productTitle}
              width={140}
              height={100}
              className="h-24 w-full rounded-sm object-cover md:h-[100px] md:w-[140px]"
            />
          </Link>

          {/* Centro */}
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <Link
                href={detailHref}
                className="min-w-0 font-semibold text-[#1A1A1A] underline-offset-4 transition-colors duration-150 hover:text-[#66B600] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600]"
              >
                <span className="line-clamp-2">{booking.productTitle}</span>
              </Link>
              <StatusBadge status={booking.status} />
            </div>

            <Link
              href={detailHref}
              className="w-fit font-mono text-sm font-semibold text-[#66B600] underline-offset-4 transition-colors duration-150 hover:text-[#559A00] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600]"
            >
              #{booking.id}
            </Link>

            <ul className="mt-1 flex flex-col gap-1.5 text-sm text-[#666] sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-1">
              <li className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 shrink-0 text-[#999]" aria-hidden />
                <span>
                  <span className="sr-only">Fecha de la actividad: </span>
                  {formatActivity(booking.date, booking.time)}
                </span>
              </li>
              <li className="flex items-center gap-1.5">
                <User className="h-4 w-4 shrink-0 text-[#999]" aria-hidden />
                <span>
                  <span className="sr-only">Viajero principal: </span>
                  {booking.customer.name}
                </span>
              </li>
              <li className="flex items-center gap-1.5">
                <Users className="h-4 w-4 shrink-0 text-[#999]" aria-hidden />
                <span>
                  <span className="sr-only">Pax total: </span>
                  {formatPax(booking.adults, booking.children)}
                </span>
              </li>
            </ul>
          </div>

          {/* Derecha */}
          <div className="flex items-end justify-between gap-4 md:w-44 md:shrink-0 md:flex-col md:items-end md:justify-start">
            <div className="md:text-right">
              <p className="text-lg font-bold leading-tight text-[#1A1A1A]">
                {formatMoney(booking.total)}
              </p>
              <p className="mt-0.5 text-xs text-[#999]">
                {PAYMENT_LABELS[booking.payment.status] ?? booking.payment.status}
              </p>
            </div>

            <AccordionTrigger
              className="h-9 w-full border border-[#E5E5E5] px-3 text-xs hover:bg-[#F7F7F7] md:w-auto"
              aria-label={`Ver detalles de la reserva ${booking.id}`}
            >
              Ver detalles
            </AccordionTrigger>
          </div>
        </div>

        {/* ------------------------- Detalle ------------------------- */}
        <AccordionContent className="border-t border-[#E5E5E5] bg-[#FCFCFC]">
          <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-2">
            {/* Viajeros */}
            <section aria-labelledby={`travelers-${booking.id}`}>
              <h4
                id={`travelers-${booking.id}`}
                className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#999]"
              >
                Viajeros
              </h4>
              <ul className="flex flex-col gap-1.5">
                {booking.travelers.map((t, i) => (
                  <li key={`${t.name}-${i}`} className="flex items-center gap-2 text-sm">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EAF6D6] text-[10px] font-bold text-[#3D7A00]">
                      {i + 1}
                    </span>
                    <span className="truncate text-[#222]">{t.name}</span>
                    {i === 0 && (
                      <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-[#66B600]">
                        Titular
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              {/* Contacto del titular */}
              <dl className="mt-4 flex flex-col gap-1.5 text-sm">
                <div className="flex items-center gap-2">
                  <dt className="sr-only">Email del viajero principal</dt>
                  <Mail className="h-4 w-4 shrink-0 text-[#999]" aria-hidden />
                  <dd className="truncate text-[#666]">{booking.customer.email}</dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt className="sr-only">Teléfono del viajero principal</dt>
                  <User className="h-4 w-4 shrink-0 text-[#999]" aria-hidden />
                  <dd className="text-[#666]">{booking.customer.phone}</dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt className="sr-only">Punto de recogida</dt>
                  <MapPin className="h-4 w-4 shrink-0 text-[#999]" aria-hidden />
                  <dd className="text-[#666]">{booking.pickupPoint}</dd>
                </div>
              </dl>
            </section>

            {/* Extras y peticiones */}
            <section aria-labelledby={`extras-${booking.id}`}>
              <h4
                id={`extras-${booking.id}`}
                className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#999]"
              >
                <Package className="h-3.5 w-3.5" aria-hidden /> Extras
              </h4>

              {booking.extras.length === 0 ? (
                <p className="text-sm text-[#999]">Sin extras en esta reserva.</p>
              ) : (
                <ul className="flex flex-col gap-1.5">
                  {booking.extras.map((extra) => (
                    <li
                      key={extra.name}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="truncate text-[#222]">{extra.name}</span>
                      <span className="shrink-0 font-semibold text-[#1A1A1A]">
                        + {formatMoney(extra.price)}
                      </span>
                    </li>
                  ))}
                  <li className="flex items-center justify-between gap-3 border-t border-[#E5E5E5] pt-1.5 text-sm">
                    <span className="text-[#666]">Total extras</span>
                    <span className="font-semibold text-[#1A1A1A]">
                      {formatMoney(extrasTotal)}
                    </span>
                  </li>
                </ul>
              )}

              {booking.specialRequests ? (
                <div className="mt-4">
                  <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[#999]">
                    Peticiones especiales
                  </h4>
                  <p className="rounded-sm border border-[#E5E5E5] bg-white px-3 py-2 text-sm leading-relaxed text-[#444]">
                    {booking.specialRequests}
                  </p>
                </div>
              ) : null}
            </section>

            {/* Resumen de pago */}
            <section aria-labelledby={`payment-${booking.id}`}>
              <h4
                id={`payment-${booking.id}`}
                className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#999]"
              >
                Resumen del pago
              </h4>
              <dl className="flex flex-col gap-1.5 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[#666]">Total</dt>
                  <dd className="font-semibold text-[#1A1A1A]">
                    {formatMoney(booking.payment.amount)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[#666]">Comisión Nomadica (15 %)</dt>
                  <dd className="text-[#222]">-{formatMoney(booking.payment.commission)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-[#E5E5E5] pt-1.5">
                  <dt className="font-semibold text-[#1A1A1A]">Importe neto</dt>
                  <dd className="text-base font-bold text-[#66B600]">
                    {formatMoney(booking.payment.net)}
                  </dd>
                </div>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <dt className="text-[#666]">Método</dt>
                  <dd className="text-[#222]">{booking.payment.method}</dd>
                </div>
              </dl>
            </section>

            {/* Acciones rápidas */}
            <div className="flex flex-col gap-2 sm:flex-row lg:items-end">
              <Button asChild className="h-10 flex-1">
                <Link href={detailHref}>Abrir reserva</Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSendEmail}
                className="h-10 flex-1 gap-2"
              >
                <Mail className="h-4 w-4" aria-hidden />
                Enviar email
              </Button>
            </div>
          </div>

          <p className="border-t border-[#E5E5E5] px-5 py-3 text-xs text-[#999]">
            Reserva de {PARTNER.name} · creada el {booking.createdAt} · origen {booking.source}
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
