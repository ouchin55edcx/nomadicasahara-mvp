import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import EmptyState from "./EmptyState";
import StatusBadge from "./StatusBadge";
import { ClipboardList } from "lucide-react";
import { formatBookingDate, formatMoney } from "@/lib/format";
import type { Booking } from "@/data/partner-mock";
import {Link} from "@/i18n/navigation";

export { formatBookingDate, formatMoney };

export default function BookingsTable({
  bookings,
  emptyHref = "/partner/dashboard/bookings",
}: {
  bookings: Booking[];
  emptyHref?: string;
}) {
  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No hay reservas con estos filtros"
        description="Prueba a cambiar los filtros o limpia la búsqueda para ver todas las reservas."
        action={
          <Link
            href={emptyHref}
            className="mt-2 rounded-sm border border-[#E5E5E5] px-4 py-2 text-sm font-semibold uppercase text-[#222] transition-colors hover:bg-[#F7F7F7]"
          >
            Limpiar filtros
          </Link>
        }
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[130px]">ID</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead className="hidden md:table-cell">Producto</TableHead>
          <TableHead className="hidden sm:table-cell">Fecha</TableHead>
          <TableHead className="hidden lg:table-cell">Personas</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="w-[70px] text-right">Acción</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id} className="odd:bg-white even:bg-[#FBFBFB]">
            <TableCell className="font-mono text-xs font-semibold text-[#444]">
              {booking.id}
            </TableCell>
            <TableCell>
              <p className="font-medium text-[#1A1A1A]">{booking.customer.name}</p>
              <p className="hidden text-xs text-[#999] md:block">{booking.customer.email}</p>
            </TableCell>
            <TableCell className="hidden max-w-[260px] md:table-cell">
              <span className="line-clamp-1 text-sm text-[#444]">{booking.productTitle}</span>
            </TableCell>
            <TableCell className="hidden whitespace-nowrap text-sm sm:table-cell">
              {formatBookingDate(booking.date)}
            </TableCell>
            <TableCell className="hidden lg:table-cell">{booking.guests}</TableCell>
            <TableCell className="text-right font-semibold text-[#1A1A1A]">
              {formatMoney(booking.total)}
            </TableCell>
            <TableCell>
              <StatusBadge status={booking.status} />
            </TableCell>
            <TableCell className="text-right">
              <Button asChild variant="outline" size="sm" className="h-8 px-3 text-xs">
                <Link href={`/partner/dashboard/bookings/${booking.id}`}>Ver</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
