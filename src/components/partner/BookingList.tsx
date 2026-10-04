"use client";

import * as React from "react";
import { ChevronDown, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "./EmptyState";
import BookingCard from "./BookingCard";
import { formatBookingDate } from "@/lib/format";
import type { Booking } from "@/data/partner-mock";
import {Link} from "@/i18n/navigation";

const PAGE_SIZE = 6;

function BookingCardSkeleton() {
  return (
    <div
      className="flex flex-col gap-4 rounded-sm border border-[#E5E5E5] bg-white p-4 md:flex-row md:items-start md:p-5"
      aria-hidden
    >
      <Skeleton className="h-24 w-full rounded-sm md:h-[100px] md:w-[140px]" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="flex flex-col items-end gap-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-9 w-32" />
      </div>
    </div>
  );
}

export default function BookingList({
  bookings,
  loading = false,
  emptyHref = "/partner/dashboard/bookings",
}: {
  bookings: Booking[];
  loading?: boolean;
  emptyHref?: string;
}) {
  const [visible, setVisible] = React.useState(PAGE_SIZE);

  // Al cambiar los resultados se vuelve a la primera página del bloque.
  React.useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [bookings]);

  if (loading) {
    return (
      <div className="flex flex-col gap-3" aria-busy="true" aria-label="Cargando reservas">
        {Array.from({ length: 4 }).map((_, i) => (
          <BookingCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No hay reservas con estos filtros"
        description="Prueba a cambiar el estado o el rango de fechas, o limpia los filtros para ver todas las reservas."
        action={
          <Link
            href={emptyHref}
            className="mt-2 inline-flex items-center rounded-sm border border-[#E5E5E5] px-4 py-2 text-sm font-semibold uppercase text-[#222] transition-colors duration-150 hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600]"
          >
            Limpiar filtros
          </Link>
        }
      />
    );
  }

  const shown = bookings.slice(0, visible);
  const remaining = bookings.length - shown.length;

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-3">
        {shown.map((booking) => (
          <li key={booking.id}>
            <BookingCard booking={booking} />
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-center justify-between gap-3 pt-1 sm:flex-row">
        <p className="text-sm text-[#666]" aria-live="polite">
          Mostrando{" "}
          <span className="font-semibold text-[#1A1A1A]">{shown.length}</span> de{" "}
          <span className="font-semibold text-[#1A1A1A]">{bookings.length}</span> reservas
          {shown.length > 0 && (
            <>
              {" "}
              · última: {formatBookingDate(shown[0].date)}
            </>
          )}
        </p>

        {remaining > 0 ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="h-10 w-full gap-2 sm:w-auto"
          >
            <ChevronDown className="h-4 w-4" aria-hidden />
            Cargar más ({remaining})
          </Button>
        ) : null}
      </div>
    </div>
  );
}
