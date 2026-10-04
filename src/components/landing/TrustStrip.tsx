import { BadgeCheck, CreditCard, Headphones, Plane, ShieldCheck, Tag, UserCheck } from "lucide-react";

import type { TrustItem } from "@/data/landing/types";

const labels = {
  heading: "Por qué reservar con nosotros",
} as const;

const icons = [ShieldCheck, UserCheck, Tag, CreditCard, Plane, BadgeCheck, Headphones] as const;

export default function TrustStrip({ items }: { items: TrustItem[] }) {
  if (items.length === 0) return null;

  return (
    <section aria-label={labels.heading} className="border-y border-line bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-3 py-10">
        <h2 className="text-[18px] font-semibold text-ink">{labels.heading}</h2>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <li key={item.title} className="flex gap-3">
                <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[var(--accent-text)]" />
                <div>
                  <h3 className="text-[15px] font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1 text-[14px] leading-relaxed text-muted">{item.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}