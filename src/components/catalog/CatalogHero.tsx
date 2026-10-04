import Image from "next/image";
import { ArrowDownRight } from "lucide-react";
import type { ReactNode } from "react";
import {Link} from "@/i18n/navigation";

type CatalogHeroProps = {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
  badge?: ReactNode;
  children?: ReactNode;
  compact?: boolean;
  className?: string;
};

export default function CatalogHero({
  image,
  imageAlt,
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
  badge,
  children,
  compact = false,
  className = "",
}: CatalogHeroProps) {
  return (
    <section className={`relative ${className}`}>
      <div className={`catalog-hero-image ${compact ? "catalog-hero-image-compact" : ""}`}>
        <Image src={image} alt={imageAlt} fill priority sizes="(max-width: 1200px) 100vw, 1200px" className="object-cover" />
        <span className="absolute inset-0 bg-gradient-to-r from-[#101811]/75 via-[#101811]/25 to-transparent" />
        <div className="absolute inset-y-0 left-0 flex max-w-3xl flex-col justify-center px-5 text-white sm:px-10 lg:px-14">
          <p className="text-xs font-semibold uppercase text-white/75">{eyebrow}</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">{title}</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/85 sm:text-base">{description}</p>
          <Link href={actionHref} className="mt-5 inline-flex w-fit items-center gap-2 border-b border-white/60 pb-1 text-sm font-semibold text-white hover:border-white">
            {actionLabel}<ArrowDownRight className="h-4 w-4" />
          </Link>
        </div>
        {badge ? <div className="absolute right-5 top-5">{badge}</div> : null}
      </div>
      {children ? <div className="relative z-10 mx-auto -mt-1 max-w-[1120px] sm:-mt-8 sm:px-4">{children}</div> : null}
    </section>
  );
}