import Image from "next/image";
import type { Tour } from "@/lib/tours";

export default function TourCard({ t }: { t: Tour }) {
  return (
    <article className="flex flex-col overflow-hidden border border-line bg-white transition-colors hover:border-brand">
      <div className="relative h-44">
        <Image
          src={t.image}
          alt={t.alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <span className="badge absolute left-3 top-3">{t.badge}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-medium leading-snug">{t.title}</h3>
        <span className="inline-flex w-fit items-center rounded-sm bg-surface px-2 py-0.5 text-[12px] font-medium uppercase tracking-nav text-muted">
          {t.pill}
        </span>
        <p className="text-sm leading-[1.5] text-muted">{t.desc}</p>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-3">
          <div>
            <p className="text-[12px] uppercase tracking-nav text-muted">
              desde
            </p>
            <p className="text-[22px] font-bold leading-none">
              {t.price}€
            </p>
            <p className="mt-1 text-xs text-muted">{t.duration}</p>
          </div>
          <a href="#" className="btn btn-primary">
            Reservar ahora
          </a>
        </div>
      </div>
    </article>
  );
}
