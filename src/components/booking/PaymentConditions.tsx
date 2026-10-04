"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRICING, money, ui, type CheckoutFormValues } from "./checkout-data";

const plans = [
  {
    id: "anticipo" as const,
    title: "Pago de anticipo",
    description: `Quiero pagar ahora ${money(PRICING.upfront)} (20 % de la reserva). El resto (${money(
      PRICING.rest,
    )}) lo pagaré antes del ${PRICING.paymentDeadline}. Total a pagar: ${money(PRICING.total)}.`,
    note: "Podrás financiar el resto del pago con tu tarjeta. Financiación ofrecida por Financiación Nomadica, E.F.C., S.A., y sujeta a su aprobación.",
  },
  {
    id: "unico" as const,
    title: "Pago único",
    description: `Quiero pagar ahora el 100 % del importe de la reserva, ${money(PRICING.total)}.`,
    note: "",
  },
  {
    id: "financiado" as const,
    title: "Pago financiado",
    description:
      "Paga la reserva en cómodas cuotas con tu tarjeta. Financiación ofrecida por Financiación Nomadica, E.F.C., S.A., y sujeta a su aprobación.",
    note: "",
  },
];

export default function PaymentConditions() {
  const { control, watch } = useFormContext<CheckoutFormValues>();
  const plan = watch("paymentPlan");
  const months = Number(watch("financingMonths"));

  return (
    <section className={ui.card} aria-labelledby="payment-conditions-title">
      <h2 id="payment-conditions-title" className={ui.sectionTitle}>
        Condiciones de pago
      </h2>
      <p className={ui.sectionLead}>Elige una opción</p>

      <Controller
        control={control}
        name="paymentPlan"
        render={({ field }) => (
          <RadioGroup
            className="mt-4 flex flex-col gap-3"
            value={field.value}
            onValueChange={field.onChange}
          >
            {plans.map((p) => {
              const selected = plan === p.id;

              return (
                <div
                  key={p.id}
                  className={`rounded-sm border p-4 transition-colors ${
                    selected
                      ? "border-[#66B600] bg-[#EAF6D6]/40"
                      : "border-[#E5E5E5] bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <RadioGroupItem
                      value={p.id}
                      id={`plan-${p.id}`}
                      className="mt-0.5 border-[#66B600] text-[#66B600]"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={`plan-${p.id}`}
                        className="text-sm font-semibold text-[#1A1A1A]"
                      >
                        {p.title}
                      </Label>
                      <p className="mt-1 text-sm leading-relaxed text-[#222]/80">
                        {p.description}
                      </p>

                      {p.note ? (
                        <p className="mt-2 text-xs leading-relaxed text-[#222]/70">
                          {p.note}{" "}
                          <a href="#" className="font-medium text-[#66B600] underline underline-offset-2">
                            Información sobre financiación online — Nomadica Sahara
                          </a>
                        </p>
                      ) : null}

                      {p.id === "financiado" && selected ? (
                        <div className="mt-4 rounded-sm border border-[#E5E5E5] border-t-2 border-t-[#66B600] bg-white p-4">
                          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-sm font-medium text-[#222]">
                                Simulador de financiación
                              </span>
                              <Controller
                                control={control}
                                name="financingMonths"
                                render={({ field: f }) => (
                                  <Select value={f.value} onValueChange={f.onChange}>
                                    <SelectTrigger
                                      className="h-10 w-64 rounded-sm border border-[#E5E5E5] bg-white px-3 text-sm text-[#222] focus:border-[#66B600] focus:ring-2 focus:ring-[#66B600]/30"
                                      aria-label="Meses de financiación"
                                    >
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="3">3 meses sin intereses</SelectItem>
                                      <SelectItem value="6">
                                        De 1 a 6 meses sin intereses
                                      </SelectItem>
                                      <SelectItem value="12">12 meses sin intereses</SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </div>

                            <div className="text-right">
                              <p className="text-xs text-[#222]/70">{months} cuotas de</p>
                              <p className="text-xl font-bold text-[#66B600]">
                                {money(PRICING.total / months)}
                              </p>
                              <p className="text-[11px] text-[#222]/60">
                                0 % TAE ·{" "}
                                <a href="#" className="underline underline-offset-2">
                                  Ver condiciones
                                </a>
                              </p>
                            </div>
                          </div>

                          <p className="mt-3 text-[11px] leading-relaxed text-[#222]/60">
                            Financiación ofrecida por Financiación Nomadica, E.F.C., S.A., y
                            sujeta a su aprobación. Podrás configurar la financiación más
                            adelante.
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </RadioGroup>
        )}
      />

      <div className="mt-4 flex gap-3 rounded-sm bg-[#EAF6D6] p-4 text-xs leading-relaxed text-[#2F4D10]">
        <p>
          <span className="font-bold uppercase">Pago seguro:</span> el importe de la reserva se
          procesa en euros. Si eliges el anticipo, el resto se cobrará automáticamente antes del{" "}
          {PRICING.paymentDeadline} con el medio de pago que indiques más abajo.
        </p>
      </div>
    </section>
  );
}
