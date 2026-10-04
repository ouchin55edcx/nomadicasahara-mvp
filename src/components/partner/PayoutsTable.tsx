"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusBadge from "./StatusBadge";
import { formatBookingDate, formatMoney } from "./BookingsTable";
import { Banknote } from "lucide-react";
import EmptyState from "./EmptyState";
import type { Payout } from "@/data/partner-mock";

export default function PayoutsTable({ payouts }: { payouts: Payout[] }) {
  if (payouts.length === 0) {
    return (
      <EmptyState
        icon={Banknote}
        title="Sin pagos todavía"
        description="Cuando se completen reservas aparecerán aquí tus cobros."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[120px]">Fecha</TableHead>
          <TableHead>Referencia</TableHead>
          <TableHead className="hidden sm:table-cell">Método</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Importe</TableHead>
          <TableHead className="w-[120px] text-right">Factura</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payouts.map((p) => (
          <TableRow key={p.id} className="odd:bg-white even:bg-[#FBFBFB]">
            <TableCell className="whitespace-nowrap text-sm">
              {formatBookingDate(p.date)}
            </TableCell>
            <TableCell className="font-mono text-xs font-semibold text-[#444]">{p.id}</TableCell>
            <TableCell className="hidden text-sm text-[#444] sm:table-cell">{p.method}</TableCell>
            <TableCell>
              <StatusBadge status={p.status} />
            </TableCell>
            <TableCell className="text-right font-semibold text-[#1A1A1A]">
              {formatMoney(p.amount)}
            </TableCell>
            <TableCell className="text-right">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 px-2.5 text-xs"
                onClick={() =>
                  toast.success("Factura descargada", { description: `${p.id}.pdf` })
                }
              >
                <Download className="h-3.5 w-3.5" /> Factura
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
