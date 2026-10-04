import { cn } from "@/lib/utils";
import type { BookingStatus, PaymentStatus, ProductStatus, PayoutStatus } from "@/data/partner-mock";

const COLORS: Record<string, string> = {
  Pendiente: "bg-[#F0A500] text-white",
  Confirmada: "bg-[#66B600] text-white",
  Completada: "bg-[#2B7A78] text-white",
  Cancelada: "bg-[#D93025] text-white",
  "Cancelación solicitada": "bg-[#B87900] text-white",
  Activo: "bg-[#66B600] text-white",
  Borrador: "bg-[#8A8A8A] text-white",
  Pausado: "bg-[#F0A500] text-white",
  Pagado: "bg-[#66B600] text-white",
  Reembolsado: "bg-[#D93025] text-white",
  Procesando: "bg-[#2B7A78] text-white",
};

type KnownStatus = BookingStatus | ProductStatus | PaymentStatus | PayoutStatus;

export default function StatusBadge({
  status,
  className,
}: {
  status: KnownStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-sm px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        COLORS[status] ?? "bg-[#E5E5E5] text-[#444]",
        className,
      )}
    >
      {status}
    </span>
  );
}
