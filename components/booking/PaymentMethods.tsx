"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ui, type CheckoutFormValues } from "./checkout-data";

const cardBrands = [
  { label: "VISA", className: "text-[#1A1F71]" },
  { label: "MASTERCARD", className: "text-[#EB001B]" },
  { label: "AMEX", className: "text-[#006FCF]" },
  { label: "CARNÉ", className: "text-[#1A1A1A]" },
];

const methods = [
  {
    id: "tarjeta" as const,
    title: "Tarjeta de crédito o débito",
    description: "Visa, Mastercard, American Express y tarjetas adheridas a Bizum.",
  },
  {
    id: "alternativo" as const,
    title: "Bizum, PayPal y Apple Pay",
    description: "Paga desde tu móvil sin introducir los datos de tu tarjeta.",
  },
];

export default function PaymentMethods() {
  const { control, watch } = useFormContext<CheckoutFormValues>();
  const method = watch("paymentMethod");

  return (
    <section className={ui.card} aria-labelledby="payment-methods-title">
      <h2 id="payment-methods-title" className={ui.sectionTitle}>
        Formas de pago
      </h2>

      <Controller
        control={control}
        name="paymentMethod"
        render={({ field }) => (
          <RadioGroup
            className="mt-4 flex flex-col gap-4"
            value={field.value}
            onValueChange={field.onChange}
          >
            <div className="rounded-sm border border-[#E5E5E5] p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <RadioGroupItem
                    value="tarjeta"
                    id="method-tarjeta"
                    className="mt-0.5 border-[#66B600] text-[#66B600]"
                  />
                  <div>
                    <Label htmlFor="method-tarjeta" className="text-sm font-semibold text-[#1A1A1A]">
                      {methods[0].title}
                    </Label>
                    <p className="mt-1 text-xs text-[#222]/70">{methods[0].description}</p>
                  </div>
                </div>

                <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
                  {cardBrands.map((brand) => (
                    <span
                      key={brand.label}
                      className={`rounded-sm border border-[#E5E5E5] bg-white px-1.5 py-1 text-[9px] font-bold tracking-wide ${brand.className}`}
                    >
                      {brand.label}
                    </span>
                  ))}
                </div>
              </div>

              {method === "tarjeta" ? (
                <div className="mt-4">
                  {/* TODO: sustituir este bloque por el Stripe PaymentElement
                      (StripeProvider + <Elements> + elements.create("payment", {...})).
                      El formulario seguro de tarjeta lo gestiona Stripe: no recoger
                      aquí número, caducidad ni CVV. */}
                  <div className="flex h-32 items-center justify-center rounded-sm border-2 border-dashed border-[#E5E5E5] bg-[#FAFAFA] px-4 text-center text-xs leading-relaxed text-[#222]/60">
                    Formulario seguro de pago — aquí se montará el Stripe PaymentElement
                    <br />
                    (tarjeta, Bizum y wallets soportados por Stripe)
                  </div>

                  <div className="mt-4 flex gap-3 rounded-sm bg-[#FFF4DC] p-4 text-xs leading-relaxed text-[#6B4E0E]">
                    <p>
                      <span className="font-bold uppercase">Importante:</span> sé conveniente que
                      tengas a tu mano tu teléfono móvil, la app de tu banco o la tarjeta de
                      coordendas. Si necesitas más información, ponte en contacto con tu banco.
                    </p>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-[#222]/70">
                    Puedes consultar los detalles del{" "}
                    <a href="#" className="font-medium text-[#222] underline underline-offset-2">
                      tratamiento de los datos de tu tarjeta de pago
                    </a>{" "}
                    en nuestra{" "}
                    <a href="#" className="font-medium text-[#222] underline underline-offset-2">
                      política de privacidad</a>.
                  </p>
                </div>
              ) : null}
            </div>

            <div className="rounded-sm border border-[#E5E5E5] p-4">
              <div className="flex items-start gap-3">
                <RadioGroupItem
                  value="alternativo"
                  id="method-alternativo"
                  className="mt-0.5 border-[#66B600] text-[#66B600]"
                />
                <div>
                  <Label
                    htmlFor="method-alternativo"
                    className="text-sm font-semibold text-[#1A1A1A]"
                  >
                    {methods[1].title}
                  </Label>
                  <p className="mt-1 text-xs text-[#222]/70">{methods[1].description}</p>
                </div>
              </div>
            </div>
          </RadioGroup>
        )}
      />

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#E5E5E5] pt-4">
        <p className="text-xs text-[#222]/70">
          Te recordamos que todo el proceso de reserva se realiza en{" "}
          <span className="font-semibold text-[#222]">entorno seguro</span> (HTTPS + 3-D Secure).
        </p>
        <span className="flex items-center gap-1.5 rounded-sm border border-[#E5E5E5] bg-[#FAFAFA] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#1A1A1A]">
          <Lock className="h-3.5 w-3.5 text-[#66B600]" aria-hidden />
          Pago seguro
        </span>
      </div>
    </section>
  );
}
