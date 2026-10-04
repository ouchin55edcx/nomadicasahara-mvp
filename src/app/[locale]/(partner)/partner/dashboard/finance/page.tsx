import type { Metadata } from "next";
import { Banknote, CircleDot, Euro, Percent } from "lucide-react";
import StatCard from "@/components/partner/StatCard";
import PayoutsTable from "@/components/partner/PayoutsTable";
import RevenueChart from "@/components/partner/RevenueChart";
import { BankDetailsCard, TransactionsTable } from "./finance-client";
import { earningsByMonth, financeStats, payouts } from "@/data/partner-mock";

export const metadata: Metadata = {
  title: "Finanzas",
  robots: { index: false, follow: false },
};

export default function FinancePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1A1A1A]">Finanzas</h2>
        <p className="mt-1 text-sm text-[#666]">
          Saldo, pagos pendientes, facturas y movimientos de tu cuenta.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Saldo disponible"
          value={financeStats.available.value}
          trend={financeStats.available.trend}
          positive={financeStats.available.positive}
          hint={financeStats.available.hint}
          icon={Euro}
        />
        <StatCard
          label="Pendiente de pago"
          value={financeStats.pending.value}
          trend={financeStats.pending.trend}
          positive={financeStats.pending.positive}
          hint={financeStats.pending.hint}
          icon={CircleDot}
        />
        <StatCard
          label="Pagado este mes"
          value={financeStats.paidMonth.value}
          trend={financeStats.paidMonth.trend}
          positive={financeStats.paidMonth.positive}
          hint={financeStats.paidMonth.hint}
          icon={Banknote}
        />
        <StatCard
          label="Comisión Nomadica"
          value={financeStats.commission.value}
          trend={financeStats.commission.trend}
          positive={financeStats.commission.positive}
          hint={financeStats.commission.hint}
          icon={Percent}
        />
      </div>

      {/* Gráfico */}
      <div className="rounded-sm border border-[#E5E5E5] bg-white p-5">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-[#1A1A1A]">Ganancias por mes</h3>
          <p className="text-xs text-[#999]">Ingresos netos de los últimos12 meses (€)</p>
        </div>
        <RevenueChart
          data={earningsByMonth}
          ariaLabel="Gráfico de ganancias por mes"
        />
      </div>

      {/* Pagos + banco */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="overflow-hidden rounded-sm border border-[#E5E5E5] bg-white xl:col-span-2">
          <div className="border-b border-[#E5E5E5] p-5">
            <h3 className="text-base font-semibold text-[#1A1A1A]">Pagos recibidos</h3>
            <p className="text-xs text-[#999]">Últimas transferencias y su factura</p>
          </div>
          <PayoutsTable payouts={payouts} />
        </div>

        <div className="flex flex-col gap-4">
          <BankDetailsCard />
          <div className="rounded-sm border border-[#E5E5E5] bg-[#FFF4DC] p-5">
            <h3 className="text-sm font-semibold text-[#8A6100]">Próximo pago</h3>
            <p className="mt-2 text-2xl font-bold text-[#1A1A1A]">760 €</p>
            <p className="mt-1 text-xs text-[#8A6100]">
              Programado para el07/10/2026 · Transferencia ••34
            </p>
          </div>
        </div>
      </div>

      {/* Transacciones */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-base font-semibold text-[#1A1A1A]">Movimientos</h3>
          <p className="text-xs text-[#999]">
            Filtra por tipo o busca por referencia y exporta a CSV.
          </p>
        </div>
        <TransactionsTable />
      </div>
    </div>
  );
}
