import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PerformanceCharts,
  ProductPerformanceTable,
  RangeSelect,
  ReviewsSummary,
} from "./performance-client";
import { performanceRows } from "@/content/partner-mock";

export const metadata: Metadata = {
  title: "Rendimiento",
  robots: { index: false, follow: false },
};

export default function PerformancePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[#1A1A1A]">Rendimiento</h2>
          <p className="mt-1 text-sm text-[#666]">
            Métricas de reservas, conversión, ingresos y satisfacción.
          </p>
        </div>
        <Suspense fallback={<Skeleton className="h-11 w-44" />}>
          <RangeSelect />
        </Suspense>
      </div>

      <Suspense fallback={<Skeleton className="h-[560px] w-full" />}>
        <PerformanceCharts />
      </Suspense>

      <div className="flex flex-col gap-3">
        <h3 className="text-base font-semibold text-[#1A1A1A]">Rendimiento por producto</h3>
        <ProductPerformanceTable rows={performanceRows} />
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-base font-semibold text-[#1A1A1A]">Valoraciones</h3>
        <ReviewsSummary />
      </div>
    </div>
  );
}
