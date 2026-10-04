import type { Metadata } from "next";
import { Suspense } from "react";
import BookingFilters from "@/components/partner/BookingFilters";
import BookingList from "@/components/partner/BookingList";
import {
  bookings,
  countByStatus,
  type Booking,
  type BookingSort,
} from "@/data/partner-mock";
import { bookingFiltersSchema } from "@/lib/validations/partner";

export const metadata: Metadata = {
  title: "Reservas",
  robots: { index: false, follow: false },
};

type RawParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Everything except the status filter, so the tab counts stay meaningful. */
function applyNonStatusFilters(
  list: Booking[],
  filters: { q?: string; productId?: string; from?: string; to?: string },
): Booking[] {
  return list.filter((b) => {
    if (filters.q) {
      const q = filters.q.toLowerCase();
      const haystack = [
        b.id,
        b.productTitle,
        b.customer.name,
        b.customer.email,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.productId && b.productId !== filters.productId) return false;
    if (filters.from && b.date < filters.from) return false;
    if (filters.to && b.date > filters.to) return false;
    return true;
  });
}

function sortBookings(list: Booking[], sort: BookingSort): Booking[] {
  return [...list].sort((a, b) =>
    sort === "reserva" ? b.createdAt.localeCompare(a.createdAt) : b.date.localeCompare(a.date),
  );
}

export default async function BookingsPage({ searchParams }: { searchParams: Promise<RawParams> }) {
  const params = await searchParams;

  const parsed = bookingFiltersSchema.safeParse({
    q: first(params.q),
    status: first(params.status),
    productId: first(params.productId),
    from: first(params.from),
    to: first(params.to),
    sort: first(params.sort),
  });

  const filters = parsed.success ? parsed.data : bookingFiltersSchema.parse({});

  const base = applyNonStatusFilters(bookings, filters);
  const counts = { all: base.length, ...countByStatus(base) };

  const filtered = filters.status
    ? base.filter((b) => b.status === filters.status)
    : base;

  const items = sortBookings(filtered, filters.sort);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1A1A1A]">Reservas</h2>
        <p className="mt-1 text-sm text-[#666]">
          Todas las reservas de tus excursiones. Despliega una tarjeta para ver el detalle sin
          salir de la lista.
        </p>
      </div>

      {/* Barra de filtros */}
      <div className="rounded-sm border border-[#E5E5E5] bg-white p-4 md:p-5">
        <Suspense fallback={<div className="h-40 animate-pulse rounded-sm bg-[#F7F7F7]" />}>
          <BookingFilters counts={counts} totalCount={items.length} />
        </Suspense>
      </div>

      {/* Tarjetas */}
      <Suspense
        fallback={
          <div className="flex flex-col gap-3" aria-busy="true" aria-label="Cargando reservas">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-36 animate-pulse rounded-sm bg-white" />
            ))}
          </div>
        }
      >
        <BookingList bookings={items} />
      </Suspense>
    </div>
  );
}
