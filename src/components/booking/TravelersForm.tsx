"use client";

import type { ReactNode } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ui, type CheckoutFormValues } from "./checkout-data";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={ui.label}>{label}</span>
      {children}
      {error ? <span className={ui.error}>{error}</span> : null}
    </label>
  );
}

const documentTypes = [
  { value: "dni", label: "DNI" },
  { value: "nie", label: "NIE" },
  { value: "pasaporte", label: "Pasaporte" },
  { value: "conductor", label: "Carné de conducir" },
];

const nationalities = [
  { value: "esp", label: "España" },
  { value: "mar", label: "Marruecos" },
  { value: "fra", label: "Francia" },
  { value: "deu", label: "Alemania" },
  { value: "ita", label: "Italia" },
  { value: "gbr", label: "Reino Unido" },
];

export default function TravelersForm() {
  const { control, register, watch, setValue, formState } = useFormContext<CheckoutFormValues>();
  const { fields } = useFieldArray({ control, name: "travelers" });
  const travelersErrors = formState.errors.travelers;

  return (
    <section className={ui.card} aria-labelledby="travelers-title">
      <h2 id="travelers-title" className={ui.sectionTitle}>
        Datos de los pasajeros
      </h2>
      <p className={ui.sectionLead}>
        Introduce los datos de los pasajeros para poder continuar con la reserva
      </p>

      <div className="mt-5 flex flex-col gap-6">
        {fields.map((field, index) => {
          const errs = travelersErrors?.[index];
          const specialNeeds = watch(`travelers.${index}.specialNeeds`);

          return (
            <div key={field.id} className={index > 0 ? `pt-6 ${ui.divider}` : ""}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[#222]/60">
                Viajero {index + 1} — adulto
              </p>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Field label="Título *" error={errs?.title?.message}>
                  <Controller
                    control={control}
                    name={`travelers.${index}.title`}
                    render={({ field: f }) => (
                      <Select value={f.value} onValueChange={f.onChange}>
                        <SelectTrigger className={ui.select} aria-label="Título">
                          <SelectValue placeholder="Sr." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sr">Sr.</SelectItem>
                          <SelectItem value="sra">Sra.</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>

                <Field label="Nombre *" error={errs?.firstName?.message}>
                  <Input
                    placeholder="Nombre *"
                    className={ui.input}
                    {...register(`travelers.${index}.firstName`)}
                  />
                </Field>

                <Field label="Apellidos *" error={errs?.lastName?.message}>
                  <Input
                    placeholder="Apellidos *"
                    className={ui.input}
                    {...register(`travelers.${index}.lastName`)}
                  />
                </Field>

                <Field label="Documento *" error={errs?.documentType?.message}>
                  <Controller
                    control={control}
                    name={`travelers.${index}.documentType`}
                    render={({ field: f }) => (
                      <Select value={f.value} onValueChange={f.onChange}>
                        <SelectTrigger className={ui.select} aria-label="Documento">
                          <SelectValue placeholder="Pasaporte" />
                        </SelectTrigger>
                        <SelectContent>
                          {documentTypes.map((d) => (
                            <SelectItem key={d.value} value={d.value}>
                              {d.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>

                <Field label="Número *" error={errs?.documentNumber?.message}>
                  <Input
                    placeholder="Número de documento"
                    className={ui.input}
                    {...register(`travelers.${index}.documentNumber`)}
                  />
                </Field>

                <Field label="Caducidad documento *" error={errs?.documentExpiry?.message}>
                  <Input type="date" className={ui.input} {...register(`travelers.${index}.documentExpiry`)} />
                </Field>

                <Field label="Nacionalidad *" error={errs?.nationality?.message}>
                  <Controller
                    control={control}
                    name={`travelers.${index}.nationality`}
                    render={({ field: f }) => (
                      <Select value={f.value} onValueChange={f.onChange}>
                        <SelectTrigger className={ui.select} aria-label="Nacionalidad">
                          <SelectValue placeholder="España" />
                        </SelectTrigger>
                        <SelectContent>
                          {nationalities.map((n) => (
                            <SelectItem key={n.value} value={n.value}>
                              {n.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>

                <Field label="Fecha de nacimiento *" error={errs?.birthDate?.message}>
                  <Input type="date" className={ui.input} {...register(`travelers.${index}.birthDate`)} />
                </Field>
              </div>

              <label className="mt-4 flex items-start gap-2 text-sm text-[#222]">
                <Checkbox
                  checked={specialNeeds}
                  onCheckedChange={(v) => setValue(`travelers.${index}.specialNeeds`, Boolean(v))}
                  className="mt-0.5 border-[#E5E5E5] data-[state=checked]:border-[#66B600] data-[state=checked]:bg-[#66B600]"
                />
                <Label className="font-normal text-[#222]">
                  ¿Necesita alguna asistencia especial (movilidad, alimentación o salud) que
                  debamos conocer antes del viaje?
                </Label>
              </label>
            </div>
          );
        })}
      </div>
    </section>
  );
}
