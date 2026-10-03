"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  CreditCard,
  Globe,
  Mail,
  MapPin,
  Package,
  Phone,
  Save,
  StickyNote,
  Ticket,
  User,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import BookingActions from "./BookingActions";
import EmptyState from "./EmptyState";
import StatusBadge from "./StatusBadge";
import { formatBookingDate, formatMoney, formatPax, initialsOf } from "@/lib/format";
import { internalNoteSchema } from "@/lib/validations/partner";
import type { Booking, BookingStatus, TimelineTone } from "@/content/partner-mock";

const TONE_STYLES: Record<TimelineTone, { dot: string; text: string }> = {
  default: { dot: "bg-[#66B600]", text: "text-[#3D7A00]" },
  success: { dot: "bg-[#66B600]", text: "text-[#3D7A00]" },
  danger: { dot: "bg-[#D93025]", text: "text-[#D93025]" },
  muted: { dot: "bg-[#F0A500]", text: "text-[#B87900]" },
};

export default function BookingDetails({ booking }: { booking: Booking }) {
  const [status, setStatus] = React.useState<BookingStatus>(booking.status);
  const [notes, setNotes] = React.useState(booking.notes);
  const [noteError, setNoteError] = React.useState<string | null>(null);

  const extrasTotal = booking.extras.reduce((sum, e) => sum + e.price, 0);

  function handleSaveNotes() {
    const value = notes.trim();
    if (!value) {
      setNoteError("La nota no puede estar vacía.");
      return;
    }
    const parsed = internalNoteSchema.safeParse({ note: value });
    if (!parsed.success) {
      setNoteError(parsed.error.issues[0].message);
      return;
    }
    setNoteError(null);
    toast.success("Notas internas guardadas", { description: `Reserva ${booking.id}` });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera */}
      <div className="flex flex-col gap-3">
        <Link
          href="/dashboard/bookings"
          className="inline-flex w-fit items-center gap-1.5 rounded-sm text-sm font-medium text-[#666] transition-colors duration-150 hover:text-[#222] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Volver a reservas
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-mono text-xl font-semibold text-[#1A1A1A]">#{booking.id}</h2>
            <StatusBadge status={status} />
            <span className="text-sm text-[#666]">
              Creada el {formatBookingDate(booking.createdAt)}
            </span>
          </div>
          <p className="text-2xl font-bold text-[#66B600]">{formatMoney(booking.total)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-start">
        {/* ------------------------- Columna izquierda ------------------------- */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          {/* Excursión */}
          <Section title="Excursión" icon={Ticket}>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Image
                src={booking.image}
                alt={booking.productTitle}
                width={160}
                height={120}
                className="h-40 w-full shrink-0 rounded-sm object-cover sm:h-[120px] sm:w-[160px]"
              />
              <div className="min-w-0">
                <p className="font-semibold text-[#1A1A1A]">{booking.productTitle}</p>
                <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <DataItem
                    icon={CalendarDays}
                    label="Fecha"
                    value={formatBookingDate(booking.date)}
                  />
                  <DataItem icon={Clock} label="Hora de inicio" value={booking.time} />
                  <DataItem
                    icon={MapPin}
                    label="Punto de recogida"
                    value={booking.pickupPoint}
                  />
                  <DataItem
                    icon={Users}
                    label="Viajeros"
                    value={formatPax(booking.adults, booking.children)}
                  />
                </dl>
              </div>
            </div>
          </Section>

          {/* Viajero principal */}
          <Section title="Viajero principal" icon={User}>
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11">
                <AvatarFallback>{initialsOf(booking.customer.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold text-[#1A1A1A]">{booking.customer.name}</p>
                <p className="text-sm text-[#666]">Titular de la reserva</p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <DataItem icon={Mail} label="Email" value={booking.customer.email} />
              <DataItem icon={Phone} label="Teléfono" value={booking.customer.phone} />
              <DataItem icon={Globe} label="País" value={booking.customer.country} />
            </dl>
          </Section>

          {/* Viajeros */}
          <Section title="Viajeros" icon={Users}>
            <ul className="flex flex-col divide-y divide-[#E5E5E5]">
              {booking.travelers.map((t, i) => (
                <li
                  key={`${t.name}-${i}`}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF6D6] text-xs font-bold text-[#3D7A00]">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#1A1A1A]">{t.name}</p>
                      <p className="truncate text-xs text-[#999]">
                        {t.documentType} · {t.documentNumber}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-[#999]">
                    {i === 0 ? "Titular" : "Adulto"}
                  </span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Extras */}
          <Section title="Extras" icon={Package}>
            {booking.extras.length === 0 ? (
              <EmptyState
                icon={Package}
                title="Sin extras"
                description="Esta reserva no incluye servicios adicionales."
              />
            ) : (
              <ul className="flex flex-col divide-y divide-[#E5E5E5]">
                {booking.extras.map((extra) => (
                  <li
                    key={extra.name}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <span className="text-sm text-[#222]">{extra.name}</span>
                    <span className="shrink-0 text-sm font-semibold text-[#1A1A1A]">
                      + {formatMoney(extra.price)}
                    </span>
                  </li>
                ))}
                <li className="flex items-center justify-between gap-3 pt-3">
                  <span className="text-sm font-medium text-[#666]">Total extras</span>
                  <span className="text-sm font-semibold text-[#1A1A1A]">
                    {formatMoney(extrasTotal)}
                  </span>
                </li>
              </ul>
            )}

            {booking.specialRequests ? (
              <div className="mt-4 border-t border-[#E5E5E5] pt-4">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[#999]">
                  Peticiones especiales
                </p>
                <p className="text-sm leading-relaxed text-[#444]">{booking.specialRequests}</p>
              </div>
            ) : null}
          </Section>

          {/* Pago */}
          <Section title="Pago" icon={CreditCard}>
            <dl className="flex flex-col gap-3">
              <PriceRow label="Total" value={formatMoney(booking.payment.amount)} strong />
              <PriceRow
                label="Comisión Nomadica (15 %)"
                value={`-${formatMoney(booking.payment.commission)}`}
              />
              <div className="flex items-center justify-between gap-3 border-t border-[#E5E5E5] pt-3">
                <dt className="text-sm font-semibold text-[#1A1A1A]">Importe neto</dt>
                <dd className="text-lg font-bold text-[#66B600]">
                  {formatMoney(booking.payment.net)}
                </dd>
              </div>
              <PriceRow label="Método" value={booking.payment.method} />
              <div className="flex items-center justify-between gap-3">
                <dt className="text-sm text-[#666]">Estado</dt>
                <dd>
                  <StatusBadge status={booking.payment.status} />
                </dd>
              </div>
            </dl>
          </Section>

          {/* Notas internas */}
          <Section title="Notas internas" icon={StickyNote}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="internal-notes" className="sr-only">
                Notas internas de la reserva
              </Label>
              <Textarea
                id="internal-notes"
                rows={5}
                maxLength={500}
                placeholder="Añade una nota visible solo para tu equipo…"
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  setNoteError(null);
                }}
                aria-invalid={noteError ? true : undefined}
                aria-describedby={noteError ? "internal-notes-error" : undefined}
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-[#999]">
                  {notes.trim().length}/500 · Solo visibles para tu equipo.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSaveNotes}
                  className="h-9 gap-2"
                >
                  <Save className="h-4 w-4" aria-hidden />
                  Guardar notas
                </Button>
              </div>
              {noteError ? (
                <p id="internal-notes-error" role="alert" className="text-xs font-medium text-[#D93025]">
                  {noteError}
                </p>
              ) : null}
            </div>
          </Section>

          {/* Timeline */}
          <Section title="Historial de la reserva" icon={Clock}>
            <ol className="relative flex flex-col gap-5 border-l border-[#E5E5E5] pl-5">
              {booking.timeline.map((event, i) => {
                const tone = TONE_STYLES[event.tone] ?? TONE_STYLES.default;
                return (
                  <li key={`${event.title}-${i}`} className="relative">
                    <span
                      className={`absolute -left-[26px] top-1 h-3 w-3 rounded-full ring-4 ring-white ${tone.dot}`}
                      aria-hidden
                    />
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <p className="text-sm font-semibold text-[#1A1A1A]">{event.title}</p>
                      <time className={`text-xs font-medium ${tone.text}`}>{event.date}</time>
                    </div>
                    <p className="mt-0.5 text-sm text-[#666]">{event.description}</p>
                  </li>
                );
              })}
            </ol>
          </Section>
        </div>

        {/* ------------------------- Columna acciones ------------------------- */}
        <aside className="lg:sticky lg:top-24">
          <BookingActions booking={booking} status={status} onStatusChange={setStatus} />
        </aside>
      </div>
    </div>
  );
}

/* ----------------------------- Helpers UI ---------------------------- */

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-sm border border-[#E5E5E5] bg-white p-5">
      <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-[#1A1A1A]">
        <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#EAF6D6]">
          <Icon className="h-4 w-4 text-[#559A00]" aria-hidden />
        </span>
        {title}
      </h3>
      {children}
    </section>
  );
}

function DataItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#999]" aria-hidden />
      <div className="min-w-0">
        <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#999]">{label}</dt>
        <dd className="break-words text-sm text-[#222]">{value}</dd>
      </div>
    </div>
  );
}

function PriceRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-sm text-[#666]">{label}</dt>
      <dd className={strong ? "font-semibold text-[#1A1A1A]" : "text-sm text-[#222]"}>{value}</dd>
    </div>
  );
}
