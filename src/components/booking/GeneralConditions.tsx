"use client";

import { Fragment } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { generalLinks, ui, type CheckoutFormValues } from "./checkout-data";

export default function GeneralConditions() {
  const { control, formState } = useFormContext<CheckoutFormValues>();
  const acceptedError = formState.errors.conditionsAccepted;

  return (
    <section className={ui.card} aria-labelledby="conditions-title">
      <h2 id="conditions-title" className={ui.sectionTitle}>
        Condiciones generales
      </h2>

      <p className="mt-3 text-sm leading-relaxed text-[#222]">
        Al hacer clic en{" "}
        <span className="font-semibold">«PAGAR Y CONFIRMAR RESERVA»</span> estás aceptando las{" "}
        {generalLinks.map((label, i) => (
          <Fragment key={label}>
            <a
              href="#"
              className="font-medium text-[#222] underline underline-offset-2 hover:text-[#66B600]"
            >
              {label}
            </a>
            {i < generalLinks.length - 1 ? ", " : ""}
          </Fragment>
        ))}
        .
      </p>

      <Controller
        control={control}
        name="conditionsAccepted"
        render={({ field }) => (
          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-sm border border-[#E5E5E5] bg-[#FAFAFA] p-4">
            <Checkbox
              checked={field.value}
              onCheckedChange={(v) => field.onChange(Boolean(v))}
              className="mt-0.5 border-[#E5E5E5] data-[state=checked]:border-[#66B600] data-[state=checked]:bg-[#66B600]"
            />
            <span className="text-sm leading-relaxed text-[#222]">
              He leído y acepto las condiciones generales, la política de privacidad y las
              condiciones de cancelación de <span className="font-semibold">Nomadica Sahara</span>.
            </span>
          </label>
        )}
      />

      {acceptedError ? <p className={`mt-2 ${ui.error}`}>{acceptedError.message}</p> : null}
    </section>
  );
}
