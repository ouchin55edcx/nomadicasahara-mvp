import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import AvailabilityCalendar from "@/components/partner/AvailabilityCalendar";
import { products } from "@/content/partner-mock";

export const metadata: Metadata = {
  title: "Disponibilidad",
  robots: { index: false, follow: false },
};

export default function AvailabilityPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1A1A1A]">Disponibilidad</h2>
        <p className="mt-1 text-sm text-[#666]">
          Consulta y gestiona las plazas, precios y bloqueos de cada día.
        </p>
      </div>

      <div className="rounded-sm border border-[#E5E5E5] bg-white p-5">
        <div className="mb-5 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#EAF6D6]">
            <CalendarDays className="h-4 w-4 text-[#559A00]" aria-hidden />
          </span>
          <h3 className="text-base font-semibold text-[#1A1A1A]">Calendario mensual</h3>
        </div>

        <AvailabilityCalendar products={products} />
      </div>
    </div>
  );
}
