import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-sm border border-[#E5E5E5] bg-white px-3 py-2 text-sm text-[#222] shadow-sm transition-colors outline-none placeholder:text-[#9CA3AF] focus-visible:border-[#66B600] focus-visible:ring-2 focus-visible:ring-[#66B600]/30 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
