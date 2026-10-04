import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-20 w-full rounded-sm border border-[#E5E5E5] bg-white px-3 py-2.5 text-sm text-[#222] shadow-sm transition-colors outline-none placeholder:text-[#9CA3AF] focus-visible:border-[#66B600] focus-visible:ring-2 focus-visible:ring-[#66B600]/30 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export { Textarea };
