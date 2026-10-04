"use client";

import type { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ui, type CheckoutFormValues } from "./checkout-data";

function Field({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className={ui.label}>{label}</span>
      {children}
      {error ? <span className={ui.error}>{error}</span> : null}
    </label>
  );
}

const phoneWrapper =
  "flex h-12 w-full overflow-hidden rounded-sm border border-[#E5E5E5] bg-white transition-colors focus-within:border-[#66B600] focus-within:ring-2 focus-within:ring-[#66B600]/30";
const phonePrefix =
  "flex items-center gap-1 border-r border-[#E5E5E5] bg-[#F7F7F7] px-3 text-sm text-[#222] select-none";
const phoneInput =
  "h-full min-w-0 flex-1 border-0 bg-white px-3 text-sm text-[#222] outline-none placeholder:text-[#9CA3AF]";

export default function HolderForm() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CheckoutFormValues>();

  const holder = errors.holder;
  const wantsInvoice = watch("holder.wantsInvoice");

  return (
    <section className={ui.card} aria-labelledby="holder-title">
      <h2 id="holder-title" className={ui.sectionTitle}>
        Datos del titular
      </h2>
      <p className={ui.sectionLead}>Inicia sesión para recuperar tus datos y agilizar tu compra</p>

      <Button type="button" className={`mt-4 ${ui.button}`}>
        Iniciar sesión
      </Button>

      <p className={`mt-6 pt-5 text-sm text-[#222] ${ui.divider}`}>
        O bien introduce los siguientes datos para continuar con la reserva
      </p>

      <RadioGroup
        className="mt-4 flex items-center gap-6"
        value={watch("holder.title")}
        onValueChange={(v) => setValue("holder.title", v as "sr" | "sra")}
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="sr" id="holder-sr" className="border-[#66B600] text-[#66B600]" />
          <Label htmlFor="holder-sr" className="text-sm font-normal text-[#222]">
            Sr.
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="sra" id="holder-sra" className="border-[#66B600] text-[#66B600]" />
          <Label htmlFor="holder-sra" className="text-sm font-normal text-[#222]">
            Sra.
          </Label>
        </div>
      </RadioGroup>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field label="Nombre *" error={holder?.firstName?.message}>
          <Input placeholder="Nombre *" className={ui.input} {...register("holder.firstName")} />
        </Field>

        <Field label="Apellidos *" error={holder?.lastName?.message}>
          <Input placeholder="Apellidos *" className={ui.input} {...register("holder.lastName")} />
        </Field>

        <Field label="Teléfono Móvil *" error={holder?.phone?.message}>
          <span className={phoneWrapper}>
            <span className={phonePrefix}>
              <span aria-hidden>🇪🇸</span>
              <span className="text-xs text-[#222]/60">+34</span>
            </span>
            <input
              type="tel"
              inputMode="tel"
              placeholder="600 000 000"
              className={phoneInput}
              {...register("holder.phone")}
            />
          </span>
        </Field>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Email *" error={holder?.email?.message}>
          <Input
            type="email"
            placeholder="nombre@correo.com"
            className={ui.input}
            {...register("holder.email")}
          />
        </Field>

        <Field label="Confirmar e-mail *" error={holder?.confirmEmail?.message}>
          <Input
            type="email"
            placeholder="nombre@correo.com"
            className={ui.input}
            {...register("holder.confirmEmail")}
          />
        </Field>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field label="Código postal *" error={holder?.postalCode?.message}>
          <span className={phoneWrapper}>
            <span className={phonePrefix}>
              <span aria-hidden>🇪🇸</span>
            </span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="28013"
              className={phoneInput}
              {...register("holder.postalCode")}
            />
          </span>
        </Field>
      </div>

      <label className="mt-5 flex w-fit items-center gap-2 text-sm text-[#222]">
        <Checkbox
          checked={wantsInvoice}
          onCheckedChange={(v) => setValue("holder.wantsInvoice", Boolean(v))}
          className="border-[#E5E5E5] data-[state=checked]:border-[#66B600] data-[state=checked]:bg-[#66B600]"
        />
        Quiero factura
      </label>
    </section>
  );
}
