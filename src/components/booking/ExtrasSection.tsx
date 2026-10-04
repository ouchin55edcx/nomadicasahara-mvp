"use client";

import { Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { money, mockTravelers, tourExtras, ui, type CheckoutFormValues } from "./checkout-data";
import { useFormContext } from "react-hook-form";

export default function ExtrasSection() {
  const { watch, setValue } = useFormContext<CheckoutFormValues>();
  const extrasValues = watch("extras");

  const toggle = (key: string, checked: boolean) =>
    setValue(`extras.${key}`, checked, { shouldDirty: true });

  return (
    <section className={ui.card} aria-labelledby="extras-title">
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="extras-title" className={ui.sectionTitle}>
          Extras del viaje
        </h2>
        <Badge className="rounded-sm bg-[#66B600] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white hover:bg-[#66B600]">
          Nuevo
        </Badge>
        <Badge className="rounded-sm bg-[#F08C00] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white hover:bg-[#F08C00]">
          Opcional
        </Badge>
      </div>
      <p className={ui.sectionLead}>
        A continuación te ofrecemos servicios extra para que tu paso por Marruecos sea cómodo,
        rápido y memorable.
      </p>

      <div className="mt-4 flex gap-3 rounded-sm bg-[#EAF6D6] p-4">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#559A00]" aria-hidden />
        <div className="text-xs leading-relaxed text-[#2F4D10]">
          <p className="font-bold uppercase tracking-wide">
            Ventajas de reservar tus extras ahora
          </p>
          <ul className="mt-1 list-disc pl-4">
            <li>Ahorrarás dinero: los precios pueden subir hasta un 50 % más tarde.</li>
            <li>Garantizas disponibilidad: los extras se contratan por grupo y tienen plazas limitadas.</li>
          </ul>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-6">
        {tourExtras.map((extra) => {
          const totalEnabled = mockTravelers.filter(
            (t) => extrasValues[`${extra.id}_${t.id}`],
          ).length;

          return (
            <div key={extra.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">{extra.title}</p>
                  <p className="text-xs text-[#222]/70">{extra.description}</p>
                </div>
                <p className="text-sm font-semibold text-[#66B600]">
                  {money(extra.price)}{" "}
                  <span className="text-xs font-normal text-[#222]/60">/ persona</span>
                </p>
              </div>

              <div className="mt-2 rounded-sm border border-[#E5E5E5]">
                {mockTravelers.map((traveler, i) => {
                  const key = `${extra.id}_${traveler.id}`;
                  const enabled = Boolean(extrasValues[key]);

                  return (
                    <div
                      key={traveler.id}
                      className={`flex items-center justify-between gap-4 px-4 py-3 ${
                        i > 0 ? "border-t border-[#E5E5E5]" : ""
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-[#222]">{traveler.label}</p>
                        <p className="text-xs text-[#222]/60">
                          {extra.title} · {enabled ? "añadido" : "no añadido"}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <span
                          className={`text-sm font-semibold ${
                            enabled ? "text-[#66B600]" : "text-[#222]/50"
                          }`}
                        >
                          + {enabled ? money(extra.price) : "0,00 €"}
                        </span>
                        <span className="w-7 text-right text-[11px] font-bold text-[#222]/60">
                          {enabled ? "SÍ" : "NO"}
                        </span>
                        <Switch
                          checked={enabled}
                          onCheckedChange={(v) => toggle(key, v)}
                          aria-label={`Añadir ${extra.title} para ${traveler.label}`}
                          className="data-[state=checked]:bg-[#66B600]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalEnabled > 0 && (
                <p className="mt-2 text-right text-xs font-semibold text-[#66B600]">
                  Subtotal extra: {money(extra.price * totalEnabled)}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-xs text-[#222]/70">
        Los extras se contratan para el conjunto del grupo y quedan sujetos a disponibilidad una
        vez confirmada la reserva.
      </p>
    </section>
  );
}
