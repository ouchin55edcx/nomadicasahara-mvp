"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { MessageCircle, Star } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  bookingsByMonth,
  clientOrigins,
  conversionByMonth,
  revenueByProduct,
  reviewsSummary,
} from "@/content/partner-mock";
import { cn } from "@/lib/utils";

const GREEN = "#66B600";
const DONUT_COLORS = ["#66B600", "#2B7A78", "#F0A500", "#1A1A1A", "#D93025"];
const axisTick = { fontSize: 11, fill: "#999" };
const tooltipProps = {
  contentStyle: { borderRadius: 2, borderColor: "#E5E5E5", fontSize: 12 },
  labelStyle: { fontSize: 12, fontWeight: 600 },
};

/* --------------------------- Selector de rango ------------------------ */

const RANGES = [
  { value: "30", label: "Últimos 30 días" },
  { value: "90", label: "Últimos 90 días" },
  { value: "365", label: "Último año" },
] as const;

export function RangeSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("range") ?? "30";

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="perf-range" className="text-xs font-medium text-[#666]">
        Rango
      </label>
      <select
        id="perf-range"
        value={current}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("range", e.target.value);
          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }}
        className="h-11 rounded-sm border border-[#E5E5E5] bg-white px-3 text-sm text-[#222] outline-none focus:border-[#66B600] focus:ring-2 focus:ring-[#66B600]/30"
      >
        {RANGES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ------------------------------ Gráficos ------------------------------ */

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div className="rounded-sm border border-[#E5E5E5] bg-white p-5">
      <h3 className="text-base font-semibold text-[#1A1A1A]">{title}</h3>
      <p className="text-xs text-[#999]">{subtitle}</p>
      <div className="mt-4" style={{ height: 260 }}>
        {mounted ? children : <Skeleton className="h-full w-full" />}
      </div>
    </div>
  );
}

export function PerformanceCharts() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <ChartCard title="Reservas por mes" subtitle="Reservas confirmadas (12 meses)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bookingsByMonth} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
            <XAxis dataKey="label" tick={axisTick} tickLine={false} axisLine={{ stroke: "#E5E5E5" }} />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} />
            <Tooltip {...tooltipProps} cursor={{ fill: "#EAF6D6" }} />
            <Bar dataKey="value" name="Reservas" fill={GREEN} radius={[2, 2, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Tasa de conversión" subtitle="Visitas que terminan en reserva (%)">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={conversionByMonth} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
            <XAxis dataKey="label" tick={axisTick} tickLine={false} axisLine={{ stroke: "#E5E5E5" }} />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} unit="%" width={48} />
            <Tooltip {...tooltipProps} />
            <Line
              type="monotone"
              dataKey="value"
              name="Conversión"
              stroke={GREEN}
              strokeWidth={2}
              dot={{ r: 3, fill: GREEN, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Ingresos por producto" subtitle="Top 5 (€)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={revenueByProduct}
            layout="vertical"
            margin={{ top: 4, right: 16, bottom: 0, left: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" horizontal={false} />
            <XAxis type="number" tick={axisTick} tickLine={false} axisLine={{ stroke: "#E5E5E5" }} />
            <YAxis
              type="category"
              dataKey="label"
              tick={{ fontSize: 11, fill: "#666" }}
              tickLine={false}
              axisLine={false}
              width={110}
            />
            <Tooltip {...tooltipProps} cursor={{ fill: "#EAF6D6" }} />
            <Bar dataKey="value" name="Ingresos" fill={GREEN} radius={[0, 2, 2, 0]} maxBarSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Origen de clientes" subtitle="Porcentaje por mercado">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={clientOrigins}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={54}
              outerRadius={86}
              paddingAngle={2}
            >
              {clientOrigins.map((_, i) => (
                <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              {...tooltipProps}
              formatter={(v) => `${Number(v)} %`}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="square"
              wrapperStyle={{ fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

/* --------------------------- Resumen de reseñas ----------------------- */

const BAR_COLORS: Record<number, string> = {
  5: "bg-[#66B600]",
  4: "bg-[#8FC92E]",
  3: "bg-[#F0A500]",
  2: "bg-[#F57C00]",
  1: "bg-[#D93025]",
};

export function ReviewsSummary() {
  const maxCount = Math.max(...reviewsSummary.distribution.map((d) => d.count));

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Promedio + distribución */}
      <div className="rounded-sm border border-[#E5E5E5] bg-white p-5">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-4xl font-bold text-[#1A1A1A]">
              {reviewsSummary.average.toFixed(1)}
            </p>
            <div className="mt-1 flex justify-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.round(reviewsSummary.average)
                      ? "fill-[#F0A500] text-[#F0A500]"
                      : "fill-[#E5E5E5] text-[#E5E5E5]",
                  )}
                />
              ))}
            </div>
            <p className="mt-1 text-xs text-[#999]">{reviewsSummary.total} reseñas</p>
          </div>

          <div className="flex flex-1 flex-col gap-1.5">
            {reviewsSummary.distribution.map((d) => (
              <div key={d.stars} className="flex items-center gap-2">
                <span className="w-3 text-right text-xs font-medium text-[#666]">{d.stars}</span>
                <Star className="h-3 w-3 fill-[#F0A500] text-[#F0A500]" />
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#E5E5E5]">
                  <div
                    className={cn("h-full rounded-full", BAR_COLORS[d.stars])}
                    style={{ width: `${(d.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs text-[#999]">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Últimas reseñas */}
      <div className="rounded-sm border border-[#E5E5E5] bg-white p-5 lg:col-span-2">
        <h3 className="text-base font-semibold text-[#1A1A1A]">Últimas reseñas</h3>

        <ul className="mt-4 flex flex-col divide-y divide-[#E5E5E5]">
          {reviewsSummary.latest.map((review) => (
            <li key={review.id} className="flex gap-3 py-4 first:pt-0 last:pb-0">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback>
                  {review.author
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="text-sm font-semibold text-[#1A1A1A]">{review.author}</p>
                  <span className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-3.5 w-3.5",
                          i < review.rating
                            ? "fill-[#F0A500] text-[#F0A500]"
                            : "fill-[#E5E5E5] text-[#E5E5E5]",
                        )}
                      />
                    ))}
                  </span>
                  <span className="text-xs text-[#999]">{review.date}</span>
                </div>

                <p className="mt-0.5 text-xs text-[#666]">{review.product}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-[#444]">“{review.comment}”</p>

                <div className="mt-2">
                  {review.replied ? (
                    <span className="inline-flex items-center gap-1.5 rounded-sm bg-[#EAF6D6] px-2 py-1 text-xs font-semibold text-[#3D7A00]">
                      <MessageCircle className="h-3.5 w-3.5" /> Respondida
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5 text-xs"
                      onClick={() =>
                        toast.success("Respuesta enviada", {
                          description: `Has respondido a ${review.author}.`,
                        })
                      }
                    >
                      <MessageCircle className="h-3.5 w-3.5" /> Responder
                    </Button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------- Tabla de producto -------------------------- */

export function ProductPerformanceTable({
  rows,
}: {
  rows: {
    id: string;
    title: string;
    views: number;
    bookings: number;
    conversion: number;
    rating: number;
  }[];
}) {
  const maxViews = Math.max(...rows.map((r) => r.views), 1);

  return (
    <div className="overflow-hidden rounded-sm border border-[#E5E5E5] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b border-[#E5E5E5]">
              <th className="h-11 px-4 text-left text-xs font-semibold uppercase tracking-wide text-[#666]">
                Producto
              </th>
              <th className="h-11 px-4 text-right text-xs font-semibold uppercase tracking-wide text-[#666]">
                Visitas
              </th>
              <th className="h-11 px-4 text-right text-xs font-semibold uppercase tracking-wide text-[#666]">
                Reservas
              </th>
              <th className="h-11 px-4 text-right text-xs font-semibold uppercase tracking-wide text-[#666]">
                Conversión
              </th>
              <th className="h-11 px-4 text-right text-xs font-semibold uppercase tracking-wide text-[#666]">
                Valoración
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.id}
                className={cn(
                  "border-b border-[#E5E5E5] transition-colors hover:bg-[#F7F7F7]",
                  i % 2 === 1 && "bg-[#FBFBFB]",
                )}
              >
                <td className="px-4 py-3">
                  <span className="line-clamp-1 font-medium text-[#1A1A1A]">{r.title}</span>
                  <div className="mt-1 h-1.5 w-32 overflow-hidden rounded-full bg-[#E5E5E5]">
                    <div
                      className="h-full rounded-full bg-[#66B600]"
                      style={{ width: `${(r.views / maxViews) * 100}%` }}
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-[#444]">{r.views}</td>
                <td className="px-4 py-3 text-right tabular-nums text-[#444]">{r.bookings}</td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums text-[#1A1A1A]">
                  {r.conversion.toFixed(1)} %
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="inline-flex items-center gap-1 font-semibold text-[#1A1A1A]">
                    <Star className="h-3.5 w-3.5 fill-[#F0A500] text-[#F0A500]" />
                    {r.rating.toFixed(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
