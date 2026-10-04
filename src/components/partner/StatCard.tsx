import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatCardProps = {
  label: string;
  value: string;
  trend: string;
  positive: boolean;
  hint: string;
  icon: LucideIcon;
};

export default function StatCard({
  label,
  value,
  trend,
  positive,
  hint,
  icon: Icon,
}: StatCardProps) {
  const TrendIcon = positive ? TrendingUp : TrendingDown;

  return (
    <div className="rounded-sm border border-[#E5E5E5] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#666]">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#EAF6D6]">
          <Icon className="h-[18px] w-[18px] text-[#559A00]" aria-hidden />
        </span>
      </div>

      <p className="mt-3 text-[28px] font-bold leading-none text-[#1A1A1A]">{value}</p>

      <div className="mt-3 flex items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-xs font-semibold",
            positive ? "bg-[#EAF6D6] text-[#3D7A00]" : "bg-[#FDECEC] text-[#D93025]",
          )}
        >
          <TrendIcon className="h-3.5 w-3.5" aria-hidden />
          {trend}
        </span>
        <span className="truncate text-xs text-[#999]">{hint}</span>
      </div>
    </div>
  );
}
