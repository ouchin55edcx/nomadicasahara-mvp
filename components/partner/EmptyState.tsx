import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

export default function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
}: {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F7F7]">
        <Icon className="h-6 w-6 text-[#999]" aria-hidden />
      </span>
      <div>
        <p className="text-sm font-semibold text-[#1A1A1A]">{title}</p>
        <p className="mt-1 max-w-sm text-sm text-[#666]">{description}</p>
      </div>
      {action}
    </div>
  );
}
