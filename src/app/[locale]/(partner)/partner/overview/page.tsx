import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Clock, Compass, Ticket, TrendingUp } from "lucide-react";
import RevenueChart from "../components/RevenueChart";
import { adminMockBookings, adminMockRevenue, adminMockStats, adminMockTasks } from "@/lib/data/adminMock";

export const metadata: Metadata = { title: "Overview | Admin" };

function StatsFallback() {
  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-black/5 bg-white p-4 shadow-sm lg:p-6"
        >
          <div className="mb-3 h-10 w-10 rounded-2xl bg-gray-100 lg:h-12 lg:w-12" />
          <div className="h-3 w-20 rounded-full bg-gray-100" />
          <div className="mt-3 h-8 w-16 rounded-full bg-gray-200" />
          <div className="mt-2 h-3 w-24 rounded-full bg-gray-100" />
        </div>
      ))}
    </section>
  );
}

function CardFallback() {
  return (
    <div className="animate-pulse rounded-[2rem] border border-black/5 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      <div className="mb-6 space-y-2">
        <div className="h-4 w-20 rounded-full bg-gray-100" />
        <div className="h-7 w-40 rounded-full bg-gray-200" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-16 rounded-2xl bg-gray-50" />
        ))}
      </div>
    </div>
  );
}

async function OverviewStatsSection() {
  const statsSource = adminMockStats;

  const stats = [
    {
      label: "Active treks",
      value: statsSource.activeTreks,
      sub: "Published",
      icon: Compass,
      href: "/partner/treks",
    },
    {
      label: "Bookings today",
      value: statsSource.bookingsToday,
      sub: `${statsSource.walkInsToday} walk-ins`,
      icon: Ticket,
      href: "/partner/booking",
    },
    {
      label: "Pending bookings",
      value: statsSource.pendingBookings,
      sub: "Need confirmation",
      icon: Clock,
      href: "/partner/booking",
      alert: statsSource.pendingBookings > 0,
    },
    {
      label: "Revenue this month",
      value: `$${statsSource.monthlyRevenue.toLocaleString()}`,
      sub: "Paid bookings only",
      icon: TrendingUp,
      href: "/partner/booking",
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <Link
          key={stat.label}
          href={stat.href}
          className="group flex items-start gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition-all hover:shadow-md lg:p-6"
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-gray-900 lg:h-12 lg:w-12 ${stat.alert ? "bg-amber-50" : "bg-[#67B500]/10"}`}
          >
            <stat.icon className={`h-5 w-5 lg:h-6 lg:w-6 ${stat.alert ? "text-amber-600" : ""}`} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold text-gray-500 lg:text-sm">{stat.label}</p>
            <p className="text-xl font-black text-gray-900 lg:text-2xl">{stat.value}</p>
            <p
              className={`truncate text-[10px] font-semibold lg:text-xs ${stat.alert ? "text-amber-600" : "text-gray-800"}`}
            >
              {stat.sub}
            </p>
          </div>
        </Link>
      ))}
    </section>
  );
}

async function OverviewRevenueSection() {
  const chartData = adminMockRevenue;

  return (
    <section className="rounded-[2rem] border border-black/5 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">Analytics</p>
          <h2 className="text-xl font-black text-gray-900 sm:text-2xl">Revenue (Last 7 Days)</h2>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">
          <TrendingUp className="h-4 w-4 text-gray-800" />
          <span className="text-sm font-black text-gray-800">
            ${chartData.reduce((sum, row) => sum + row.value, 0).toLocaleString()}
          </span>
        </div>
      </div>
      <RevenueChart data={chartData} height={220} />
    </section>
  );
}

async function OverviewRecentBookingsSection() {
  const liveRecentBookings = adminMockBookings;

  return (
    <div className="rounded-[2rem] border border-black/5 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      <div className="mb-4 flex items-center justify-between lg:mb-6">
        <div>
          <p className="text-sm font-semibold text-gray-500">Latest</p>
          <h2 className="text-xl font-black text-gray-900 sm:text-2xl">Recent bookings</h2>
        </div>
        <Link
          href="/partner/booking"
          className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 sm:px-4 sm:py-2"
        >
          View all
        </Link>
      </div>
      <div className="space-y-2 sm:space-y-3">
        {(liveRecentBookings?.length ? liveRecentBookings : adminMockBookings).map((booking) => (
          <div
            key={booking.id}
            className="flex flex-col gap-2 rounded-2xl border border-black/5 bg-[#f7f9f8] p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"
          >
            <div>
              <p className="text-sm font-semibold text-gray-800">{booking.tourist_name}</p>
              <p className="text-xs font-semibold text-gray-500">
                {(booking.treks as { title?: string } | null)?.title ?? "—"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-400">{booking.trek_date}</span>
              {booking.source === "walkin" && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-black text-blue-700">
                  Walk-in
                </span>
              )}
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-sm sm:px-3 sm:py-1 sm:text-xs ${
                  booking.status === "confirmed"
                    ? "bg-emerald-50 text-gray-800"
                    : booking.status === "completed"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-amber-50 text-amber-700"
                }`}
              >
                {booking.status}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                  booking.payment_status === "paid"
                    ? "bg-emerald-100 text-gray-800"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {booking.payment_status}
              </span>
            </div>
          </div>
        ))}
        {!liveRecentBookings?.length && !adminMockBookings.length && (
          <p className="py-8 text-center text-sm text-gray-400">No bookings yet</p>
        )}
      </div>
    </div>
  );
}

async function OverviewTasksSection() {
  const tasks = adminMockTasks;

  return (
    <div className="rounded-[2rem] border border-black/5 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      <div className="mb-4 lg:mb-6">
        <p className="text-sm font-semibold text-gray-500">Action needed</p>
        <h2 className="text-xl font-black text-gray-900 sm:text-2xl">Priority tasks</h2>
      </div>
      <div className="space-y-2 sm:space-y-3">
        {tasks.map((task) => (
          <Link
            key={task.title}
            href={task.href}
            className={`block rounded-2xl border p-3 transition-all hover:shadow-sm sm:p-4 ${
              task.urgent ? "border-amber-100 bg-amber-50" : "border-black/5 bg-[#f7f9f8]"
            }`}
          >
            <p className="text-sm font-semibold text-gray-800">{task.title}</p>
            <p className={`mt-0.5 text-xs font-semibold ${task.urgent ? "text-amber-600" : "text-gray-500"}`}>
              {task.detail}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 rounded-[2.5rem] border border-black/5 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <div>
          <p className="text-sm font-semibold text-gray-500">Dashboard</p>
          <h1 className="text-2xl font-black text-gray-900 sm:text-[1.9rem] lg:text-[2.1rem]">
            Welcome back, Youssef
          </h1>
          <p className="mt-1 max-w-2xl text-sm font-medium text-gray-500">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Link
            href="/partner/treks/new"
            className="rounded-full bg-[#67B500] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0f3d24] sm:px-5 sm:py-2.5"
          >
            + Create new trek
          </Link>
          <Link
            href="/partner/booking"
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 sm:px-5 sm:py-2.5"
          >
            View all bookings
          </Link>
        </div>
      </section>

      <Suspense fallback={<StatsFallback />}>
        <OverviewStatsSection />
      </Suspense>

      <Suspense fallback={<CardFallback />}>
        <OverviewRevenueSection />
      </Suspense>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <Suspense fallback={<CardFallback />}>
          <OverviewRecentBookingsSection />
        </Suspense>
        <Suspense fallback={<CardFallback />}>
          <OverviewTasksSection />
        </Suspense>
      </section>
    </div>
  );
}
