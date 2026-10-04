import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center whitespace-nowrap rounded-sm px-2 py-0.5 text-xs font-semibold uppercase leading-tight transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "bg-[#66B600] text-white",
        secondary: "bg-[#EAF6D6] text-[#2C4A10]",
        outline: "border border-[#E5E5E5] bg-white text-[#222]",
        warning: "bg-[#F08C00] text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
