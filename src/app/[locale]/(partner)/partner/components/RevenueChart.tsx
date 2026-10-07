"use client";

import { useMemo } from "react";

interface ChartDataPoint {
  label: string;
  value: number;
}

interface RevenueChartProps {
  data: ChartDataPoint[];
  height?: number;
}

export default function RevenueChart({ data, height = 200 }: RevenueChartProps) {
  const maxValue = useMemo(() => Math.max(...data.map((d) => d.value), 1), [data]);
  const chartWidth = 100; // percentage
  const barWidth = Math.min(60, (chartWidth / data.length) * 0.7);
  const gap = (chartWidth - data.length * barWidth) / (data.length + 1);

  return (
    <div className="w-full">
      <div className="relative" style={{ height }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-gray-400 pr-2">
          <span>${maxValue.toLocaleString()}</span>
          <span>${Math.round(maxValue * 0.66).toLocaleString()}</span>
          <span>${Math.round(maxValue * 0.33).toLocaleString()}</span>
          <span>$0</span>
        </div>

        {/* Chart area */}
        <div className="absolute left-10 right-0 top-0 h-full">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="border-t border-dashed border-gray-100" />
            ))}
          </div>

          {/* Bars */}
          <div className="absolute inset-0 flex items-end justify-around px-1">
            {data.map((point, idx) => {
              const barHeight = (point.value / maxValue) * 100;
              return (
                <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-[#67B500] to-[#67B500] transition-all duration-500 hover:from-[#0f3d24] hover:to-[#00d48a]"
                    style={{
                      height: `${Math.max(barHeight, 2)}%`,
                      maxWidth: `${barWidth}%`,
                    }}
                  />
                  <span className="text-[9px] font-semibold text-gray-500 truncate w-full text-center">
                    {point.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
