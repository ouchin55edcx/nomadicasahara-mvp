"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export type ChartPoint = { label: string; value: number };

const moneyFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function ChartTooltip({
  active,
  payload,
  label,
  format,
}: {
  active?: boolean;
  payload?: { value: number | string }[];
  label?: string;
  format?: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-sm border border-[#E5E5E5] bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-[#1A1A1A]">{label}</p>
      <p className="mt-0.5 text-[#66B600]">
        {format ? format(Number(payload[0].value)) : String(payload[0].value)}
      </p>
    </div>
  );
}

export default function RevenueChart({
  data,
  height = 280,
  formatValue = (v: number) => moneyFormatter.format(v),
  ariaLabel = "Gráfico de ingresos",
}: {
  data: ChartPoint[];
  height?: number;
  formatValue?: (v: number) => string;
  ariaLabel?: string;
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <Skeleton className="w-full" style={{ height }} />;
  }

  return (
    <div role="img" aria-label={ariaLabel} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="fillGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#66B600" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#66B600" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#999" }}
            tickLine={false}
            axisLine={{ stroke: "#E5E5E5" }}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#999" }}
            tickLine={false}
            axisLine={false}
            width={54}
            tickFormatter={(v: number) =>
              v >= 1000 ? `${Math.round(v / 100) / 10}k` : String(v)
            }
          />
          <Tooltip
            content={<ChartTooltip format={formatValue} />}
            cursor={{ stroke: "#66B600", strokeDasharray: "4 4" }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#66B600"
            strokeWidth={2}
            fill="url(#fillGreen)"
            dot={false}
            activeDot={{ r: 4, fill: "#66B600", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
