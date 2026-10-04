"use client";

import { useState, type ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingSummary from "@/components/booking/BookingSummary";
import CancellationTimeline from "@/components/booking/CancellationTimeline";
import ExtrasSection from "@/components/booking/ExtrasSection";
import GeneralConditions from "@/components/booking/GeneralConditions";
import HolderForm from "@/components/booking/HolderForm";
import Observations from "@/components/booking/Observations";
import PaymentConditions from "@/components/booking/PaymentConditions";
import PaymentMethods from "@/components/booking/PaymentMethods";
import PriceTotal from "@/components/booking/PriceTotal";
import TravelersForm from "@/components/booking/TravelersForm";
import {
  checkoutSchema,
  defaultValues,
  type CheckoutFormValues,
} from "@/components/booking/checkout-data";

function InfoBox({
  tone,
  title,
  children,
}: {
  tone: "success" | "warning";
  title: string;
  children: ReactNode;
}) {
  const isSuccess = tone === "success";

  return (
    <div
      className={`flex gap-3 rounded-md border p-4 ${
        isSuccess ? "border-[#CBE8A0] bg-[#EAF6D6]" : "border-[#F2D9A5] bg-[#FFF4DC]"
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white ${
          isSuccess ? "bg-[#66B600]" : "bg-[#F08C00]"
        }`}
        aria-hidden
      >
        <Info className="h-3.5 w-3.5" />
      </span>
      <div
        className={`text-xs leading-relaxed ${isSuccess ? "text-[#2C4A10]" : "text-[#6B4E0E]"}`}
      >
        <p className="font-bold uppercase tracking-wide">{title}</p>
        <p className="mt-1">{children}</p>
      </div>
    </div>
  );
}

export default function CheckoutForm() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues,
    mode: "onTouched",
  });

  const conditionsAccepted = form.watch("conditionsAccepted");

  const onSubmit = (values: CheckoutFormValues) => {
    // Mock: aquí se llamaría a la API de reservas y a Stripe confirmPayment.
    console.log("[Nomadica Sahara] Reserva confirmada (mock)", values);
    setSubmitted(true);
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="min-h-screen bg-[#F7F7F7] pb-28 lg:pb-10"
      >
        <main className="mx-auto max-w-[1200px] px-3 py-4 md:py-6">
          <InfoBox tone="success" title="Es importante que leas esta información">
            Tu reserva incluye alojamientos y traslados operados por nuestros partners locales en
            Marruecos. Una vez hayas formalizado el pago, el sistema te enviará el voucher y el
            contacto de tu guía. Si todavía no dispones de una cuenta, podrás crearla en ese
            momento. Este paso es necesario para completar correctamente tu reserva.
          </InfoBox>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-start">
            {/* Columna izquierda (2/3) */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              <HolderForm />
              <TravelersForm />
              <ExtrasSection />
              <PaymentConditions />
              <PaymentMethods />
              <CancellationTimeline />

              <InfoBox tone="warning" title="Es importante que leas esta información">
                Durante el proceso de reserva deberás verificar los datos de los viajeros con
                nuestro operador local. Una vez verificados, recibirás el voucher definitivo por
                correo electrónico. Este paso es necesario para completar correctamente tu
                reserva.
              </InfoBox>

              <Observations />
              <GeneralConditions />

              <div className="flex flex-col items-end gap-3">
                <Button
                  type="submit"
                  disabled={!conditionsAccepted}
                  className="h-12 rounded-sm bg-[#66B600] px-8 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#559A00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Pagar y confirmar reserva
                </Button>
                {submitted ? (
                  <p className="text-sm font-medium text-[#66B600]">
                    Reserva confirmada (mock). Te enviaríamos el voucher por correo electrónico.
                  </p>
                ) : null}
              </div>
            </div>

            {/* Columna derecha (1/3) — resumen pegajoso */}
            <aside className="lg:sticky lg:top-4 lg:col-span-1">
              <BookingSummary />
            </aside>
          </div>
        </main>

        {/* Barra fija inferior (sólo móvil): total + botón de pago */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E5E5E5] bg-white px-3 py-2.5 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] lg:hidden">
          <PriceTotal variant="mobile" />
        </div>
      </form>
    </FormProvider>
  );
}
