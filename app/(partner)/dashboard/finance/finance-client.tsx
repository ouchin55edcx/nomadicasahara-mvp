"use client";

import * as React from "react";
import { Download, Pencil, Receipt, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmptyState from "@/components/partner/EmptyState";
import { formatBookingDate, formatMoney } from "@/components/partner/BookingsTable";
import { PARTNER, transactions, type TransactionType } from "@/content/partner-mock";

const TYPE_LABEL: Record<TransactionType, string> = {
  Ingreso: "bg-[#EAF6D6] text-[#3D7A00]",
  Comisión: "bg-[#FFF4DC] text-[#8A6100]",
  Reembolso: "bg-[#FDECEC] text-[#D93025]",
};

export function TransactionsTable() {
  const [query, setQuery] = React.useState("");
  const [type, setType] = React.useState<TransactionType | "all">("all");

  const filtered = transactions.filter((t) => {
    if (type !== "all" && t.type !== type) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!`${t.id} ${t.description} ${t.reference}`.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  function exportCsv() {
    const header = ["ID", "Fecha", "Descripción", "Referencia", "Tipo", "Importe"];
    const rows = filtered.map((t) => [
      t.id,
      t.date,
      t.description,
      t.reference,
      t.type,
      String(t.amount).replace(".", ","),
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(";"))
      .join("\n");

    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transacciones-nomadica.csv";
    a.click();
    URL.revokeObjectURL(url);

    toast.success("CSV exportado", { description: `${filtered.length} transacciones` });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar transacción…"
            aria-label="Buscar transacción"
            className="h-11 pl-9"
          />
        </div>

        <Select
          value={type}
          onValueChange={(v) => setType(v as TransactionType | "all")}
        >
          <SelectTrigger className="h-11 w-full sm:w-44" aria-label="Filtrar por tipo">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="Ingreso">Ingreso</SelectItem>
            <SelectItem value="Comisión">Comisión</SelectItem>
            <SelectItem value="Reembolso">Reembolso</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="h-11 gap-2" onClick={exportCsv}>
          <Download className="h-4 w-4" /> Exportar CSV
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="Sin transacciones"
          description="No hay movimientos que coincidan con el filtro."
        />
      ) : (
        <div className="overflow-hidden rounded-sm border border-[#E5E5E5] bg-white">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[110px]">Fecha</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="hidden md:table-cell">Referencia</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Importe</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id} className="odd:bg-white even:bg-[#FBFBFB]">
                  <TableCell className="whitespace-nowrap text-sm">
                    {formatBookingDate(t.date)}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium text-[#1A1A1A]">{t.description}</p>
                    <p className="text-xs text-[#999] md:hidden">{t.reference}</p>
                  </TableCell>
                  <TableCell className="hidden font-mono text-xs text-[#666] md:table-cell">
                    {t.reference}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-sm px-2 py-0.5 text-[11px] font-semibold uppercase ${TYPE_LABEL[t.type]}`}
                    >
                      {t.type}
                    </span>
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold ${
                      t.amount < 0 ? "text-[#D93025]" : "text-[#1A1A1A]"
                    }`}
                  >
                    {t.amount < 0 ? "" : "+"}
                    {formatMoney(t.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export function BankDetailsCard() {
  const [open, setOpen] = React.useState(false);
  const [holder, setHolder] = React.useState<string>(PARTNER.bank.holder);
  const [iban, setIban] = React.useState<string>(PARTNER.bank.iban);
  const [bank, setBank] = React.useState<string>(PARTNER.bank.bank);

  return (
    <div className="rounded-sm border border-[#E5E5E5] bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-[#1A1A1A]">Datos bancarios</h3>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 text-xs"
          onClick={() => setOpen(true)}
        >
          <Pencil className="h-3.5 w-3.5" /> Editar
        </Button>
      </div>

      <dl className="mt-4 flex flex-col gap-3">
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#999]">
            Titular
          </dt>
          <dd className="text-sm text-[#222]">{holder}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#999]">
            IBAN / Cuenta
          </dt>
          <dd className="break-all font-mono text-sm text-[#222]">{iban}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#999]">
            Banco
          </dt>
          <dd className="text-sm text-[#222]">{bank}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#999]">
            Frecuencia de pago
          </dt>
          <dd className="text-sm text-[#222]">{PARTNER.bank.frequency}</dd>
        </div>
      </dl>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar datos bancarios</DialogTitle>
            <DialogDescription>
              Los cambios se aplicarán a los próximos pagos (demo).
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bank-holder" className="text-xs font-medium">
                Titular
              </Label>
              <Input id="bank-holder" value={holder} onChange={(e) => setHolder(e.target.value)} className="h-11" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bank-iban" className="text-xs font-medium">
                IBAN / Cuenta
              </Label>
              <Input id="bank-iban" value={iban} onChange={(e) => setIban(e.target.value)} className="h-11 font-mono" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bank-name" className="text-xs font-medium">
                Banco
              </Label>
              <Input id="bank-name" value={bank} onChange={(e) => setBank(e.target.value)} className="h-11" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                toast.success("Datos bancarios actualizados");
              }}
            >
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
