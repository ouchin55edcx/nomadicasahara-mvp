"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PRICING, money, type CheckoutFormValues } from "./checkout-data";

type PriceTotalProps = {
  /** "mobile" se usa en la barra fija inferior; "desktop" en la columna de resumen. */
  variant?: "desktop" | "mobile";
};

export default function PriceTotal({ variant = "desktop" }: PriceTotalProps) {
  const { watch } = useFormContext<CheckoutFormValues>();
  const accepted = watch("conditionsAccepted");

  if (variant === "mobile") {
    return (
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#222]/60">
            Total
          </p>
          <p className="text-lg font-bold leading-tight text-[#66B600]">
            {money(PRICING.total)}
          </p>
        </div>
        <Button
          type="submit"
          disabled={!accepted}
          className="h-11 whitespace-nowrap rounded-sm bg-[#66B600] px-4 text-[11px] font-bold uppercase tracking-wide text-white hover:bg-[#559A00] focus-visible:ring-2 focus-visible:ring-[#66B600] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Pagar y confirmar reserva
        </Button>
      </div>
    );
  }

  return (
    <div className="border-t border-[#E5E5E5] bg-white">
      <div className="bg-[#FFF4DC] px-4 py-3 text-center">
        <p className="text-sm font-bold text-[#8A5A00]">
          ¡Date prisa, este precio puede cambiar!
        </p>
        <p className="text-xs text-[#8A5A00]/90">
          Esta oferta caducará en {PRICING.offerCountdown}
        </p>
      </div>

      <div className="px-5 py-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#1A1A1A]">Total</p>
            <button
              type="button"
              className="mt-1 text-xs text-[#66B600] underline underline-offset-2 hover:text-[#559A00]"
            >
              Ver desglose
            </button>
          </div>
          <p className="text-2xl font-bold text-[#66B600]">{money(PRICING.total)}</p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-[11px] text-[#222]/60">Impuestos y tasas incluidos</p>
          <button
            type="button"
            className="text-xs text-[#66B600] underline underline-offset-2 hover:text-[#559A00]"
          >
            Guardar presupuesto
          </button>
        </div>
      </div>
    </div>
  );
}
