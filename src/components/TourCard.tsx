import Image from "next/image";
import {Link} from "@/i18n/navigation";
import type {OffersHref, TourDetailHref} from "@/lib/hrefs";

export type TourCardProps = {
  image: string;
  imageAlt: string;
  title: string;
  tag?: string;
  meta?: string;
  description?: string;
  price?: string;
  duration?: string;
  actionLabel?: string;
  actionHref: string | TourDetailHref | OffersHref;
  priceLabel?: string;
};

export default function TourCard({
  image,
  imageAlt,
  title,
  tag,
  meta,
  description,
  price,
  duration,
  actionLabel = "RESERVA YA",
  actionHref,
  priceLabel = "desde",
}: TourCardProps) {
  return (
    <Link href={actionHref} className="group flex min-w-0 flex-col overflow-hidden border border-[#c6ccca] bg-white transition-shadow hover:shadow-[0_14px_32px_-24px_rgba(0,0,0,.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006D41]">
      <div className="relative h-[164px] shrink-0">
        <Image src={image} alt={imageAlt} fill sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 270px" className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
        {tag ? <span className="absolute left-1.5 right-1.5 top-1.5 overflow-hidden bg-[#60b900] px-2 py-1 text-center text-xs font-bold leading-4 text-white">{tag}</span> : null}
      </div>
      <div className="flex min-h-[245px] flex-1 flex-col p-2.5">
        <h3 className="text-[17px] font-bold leading-[1.2] text-[#293b45]">{title}</h3>
        {meta ? <p className="mt-1.5 bg-[#ffecd1] px-2 py-2 text-xs font-semibold leading-tight text-[#3d4542]">{meta}</p> : null}
        {description ? <p className="mt-1.5 line-clamp-4 text-[13px] leading-[1.35] text-[#505854]">{description}</p> : null}
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <span className="flex min-w-0 flex-col text-[11px] leading-tight text-[#758078]">
            {price ? <><span>{priceLabel}</span><b className="text-[27px] leading-[1.05] text-[#59ad00]">{price}</b></> : null}
            {duration ? <span className="mt-0.5 text-[10px]">{duration}</span> : null}
          </span>
          <span className="inline-flex min-h-10 shrink-0 items-center gap-1.5 border border-[#60b61a] bg-white px-3 text-xs font-semibold text-[#438d25] transition-colors group-hover:bg-[#60b61a] group-hover:text-white">
            {actionLabel}<span aria-hidden="true" className="text-lg leading-none">›</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
