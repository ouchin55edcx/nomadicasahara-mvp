import type { LucideIcon } from "lucide-react";

export type PromoCardProps = {
  icon: LucideIcon;
  tag: string;
  text: string;
};

export default function PromoCard({ icon: Icon, tag, text }: PromoCardProps) {
  return (
    <div className="flex items-start gap-3 border-b border-[#E5E5E5] py-3 last:border-b-0">
      <span className="flex shrink-0 items-center gap-1.5 rounded-sm border border-[#E5E5E5] bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#1A1A1A]">
        <Icon className="h-3.5 w-3.5 text-[#66B600]" aria-hidden />
        {tag}
      </span>
      <p className="text-xs leading-relaxed text-[#222]/80">{text}</p>
    </div>
  );
}
