"use client";

import Link from "next/link";

import { formatPrice } from "@/content/landing/types";

const labels = {
  from: "Desde",
} as const;

type MobileCtaBarProps = {
  href: string;
  ctaLabel: string;
  priceFrom?: number;
};

export default function MobileCtaBar({ href, ctaLabel, priceFrom }: MobileCtaBarProps) {
  return (
    <>
      <div aria-hidden="true" className="h-20 md:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur md:hidden">
        <div className="mx-auto flex w-full max-w-[1200px] items-center gap-3 px-3 py-2">
          {priceFrom ? (
            <p className="shrink-0 text-[12px] leading-tight text-muted">
              {labels.from}
              <span className="block text-[17px] font-semibold text-ink">{formatPrice(priceFrom)}</span>
            </p>
          ) : null}
          <Link href={href} className="btn-accent min-h-12 flex-1">
            {ctaLabel}
          </Link>
        </div>
      </div>
    </>
  );
}