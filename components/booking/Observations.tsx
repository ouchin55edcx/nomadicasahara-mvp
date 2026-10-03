"use client";

import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { observationBlocks, ui, type CheckoutFormValues } from "./checkout-data";

export default function Observations() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CheckoutFormValues>();

  return (
    <section className={ui.card} aria-labelledby="observations-title">
      <h2 id="observations-title" className={ui.sectionTitle}>
        Observaciones de la reserva
      </h2>

      <div className="mt-3 flex flex-col gap-4">
        {observationBlocks.map((block) => (
          <div key={block.heading}>
            <p className="text-xs font-bold text-[#1A1A1A]">{block.heading}</p>
            {block.paragraphs.map((paragraph, i) => (
              <p key={i} className="mt-1 text-xs leading-relaxed text-[#222]/75">
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>

      <label className="mt-5 flex flex-col gap-1.5">
        <span className={ui.label}>Comentarios o peticiones especiales (opcional)</span>
        <Textarea
          rows={4}
          placeholder="Por ejemplo: alergias alimentarias, horarios de llegada, celebraciones..."
          className="min-h-24 w-full rounded-sm border border-[#E5E5E5] bg-white px-3 py-2.5 text-sm text-[#222] outline-none placeholder:text-[#9CA3AF] focus:border-[#66B600] focus:ring-2 focus:ring-[#66B600]/30"
          {...register("comment")}
        />
        {errors.comment ? <span className={ui.error}>{errors.comment.message}</span> : null}
      </label>
    </section>
  );
}
