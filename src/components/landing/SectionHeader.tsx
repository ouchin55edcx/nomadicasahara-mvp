import { ArrowRight } from "lucide-react";
import {Link} from "@/i18n/navigation";

const labels = {
  more: "Ver más",
} as const;

type SectionHeaderProps = {
  title: string;
  description?: string;
  moreHref?: string;
  moreLabel?: string;
  id?: string;
};

export default function SectionHeader({
  title,
  description,
  moreHref,
  moreLabel = labels.more,
  id,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h2 id={id} className="text-[22px] font-semibold leading-tight text-ink sm:text-[26px]">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
      {moreHref ? (
        <Link
          href={moreHref}
          className="inline-flex min-h-12 shrink-0 items-center gap-1.5 self-start text-[13px] font-semibold uppercase tracking-nav text-[var(--accent-text)] transition-colors hover:text-[var(--accent-dark)] sm:self-end"
        >
          {moreLabel}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      ) : null}
    </div>
  );
}