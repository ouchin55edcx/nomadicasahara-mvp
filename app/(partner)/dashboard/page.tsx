import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  Star,
  TrendingUp,
  ClipboardList,
  Euro,
} from "lucide-react";
import StatCard from "@/components/partner/StatCard";
import BookingsTable, { formatBookingDate } from "@/components/partner/BookingsTable";
import RevenueChart from "@/components/partner/RevenueChart";
import StatusBadge from "@/components/partner/StatusBadge";
import {
  dashboardStats,
  bookings,
  revenueLast30Days,
  upcomingDepartures,
  topProducts,
} from "@/content/partner-mock";

export const metadata: Metadata = {
  title: "Resumen",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  const recentBookings = [...bookings]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  const maxTopBookings = topProducts[0]?.bookingsCount ?? 1;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1A1A1A]">Buenos días, Youssef 👋</h2>
        <p className="mt-1 text-sm text-[#666]">
          Este es el resumen de tu operativa en Nomadica Sahara.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Ingresos del mes"
          value={dashboardStats.revenue.value}
          trend={dashboardStats.revenue.trend}
          positive={dashboardStats.revenue.positive}
          hint={dashboardStats.revenue.hint}
          icon={Euro}
        />
        <StatCard
          label="Reservas"
          value={dashboardStats.bookings.value}
          trend={dashboardStats.bookings.trend}
          positive={dashboardStats.bookings.positive}
          hint={dashboardStats.bookings.hint}
          icon={ClipboardList}
        />
        <StatCard
          label="Ocupación"
          value={dashboardStats.occupancy.value}
          trend={dashboardStats.occupancy.trend}
          positive={dashboardStats.occupancy.positive}
          hint={dashboardStats.occupancy.hint}
          icon={TrendingUp}
        />
        <StatCard
          label="Valoración media"
          value={dashboardStats.rating.value}
          trend={dashboardStats.rating.trend}
          positive={dashboardStats.rating.positive}
          hint={dashboardStats.rating.hint}
          icon={Star}
        />
      </div>

      {/* Gráfico + próximas salidas */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-sm border border-[#E5E5E5] bg-white p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#1A1A1A]">Ingresos</h3>
              <p className="text-xs text-[#999]">Últimos30 días (03/09 → 02/10/2026)</p>
            </div>
            <span className="rounded-sm bg-[#EAF6D6] px-2 py-1 text-xs font-semibold text-[#3D7A00]">
              +12,4 %
            </span>
          </div>
          <RevenueChart data={revenueLast30Days} ariaLabel="Ingresos de los últimos30 días" />
        </div>

        <div className="rounded-sm border border-[#E5E5E5] bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#1A1A1A]">Próximas salidas</h3>
            <CalendarDays className="h-4 w-4 text-[#66B600]" aria-hidden />
          </div>

          <ul className="flex flex-col divide-y divide-[#E5E5E5]">
            {upcomingDepartures.map((dep) => (
              <li key={dep.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-sm bg-[#F7F7F7] text-center">
                  <span className="text-sm font-bold leading-none text-[#1A1A1A]">
                    {dep.date.slice(8, 10)}
                  </span>
                  <span className="text-[10px] uppercase leading-none text-[#999]">
                    {formatBookingDate(dep.date).split(" ")[1]?.slice(0, 3)}
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-medium text-[#1A1A1A]">{dep.title}</p>
                  <p className="mt-0.5 flex items-center gap-2 text-xs text-[#666]">
                    <Clock className="h-3 w-3" aria-hidden /> {dep.time} · {dep.guests} pers.
                  </p>
                </div>
                <StatusBadge status={dep.status} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Reservas recientes + top productos */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="overflow-hidden rounded-sm border border-[#E5E5E5] bg-white xl:col-span-2">
          <div className="flex items-center justify-between border-b border-[#E5E5E5] p-5">
            <h3 className="text-base font-semibold text-[#1A1A1A]">Reservas recientes</h3>
            <Link
              href="/dashboard/bookings"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#66B600] underline-offset-2 hover:underline"
            >
              Ver todas <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <BookingsTable bookings={recentBookings} />
        </div>

        <div className="rounded-sm border border-[#E5E5E5] bg-white p-5">
          <h3 className="mb-4 text-base font-semibold text-[#1A1A1A]">Productos más vendidos</h3>

          <ul className="flex flex-col gap-4">
            {topProducts.map((p, i) => (
              <li key={p.id} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="flex min-w-0 items-baseline gap-2">
                    <span className="text-xs font-bold text-[#999]">{i + 1}.</span>
                    <span className="line-clamp-1 text-sm font-medium text-[#1A1A1A]">
                      {p.title}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-[#66B600]">
                    {p.bookingsCount}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
                  <div
                    className="h-full rounded-full bg-[#66B600]"
                    style={{ width: `${(p.bookingsCount / maxTopBookings) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
