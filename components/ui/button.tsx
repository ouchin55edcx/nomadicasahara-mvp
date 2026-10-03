import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-semibold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600]/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#66B600] text-white hover:bg-[#559A00]",
        secondary: "bg-[#EAF6D6] text-[#2C4A10] hover:bg-[#DDEFB9]",
        outline: "border border-[#E5E5E5] bg-white text-[#222] hover:bg-[#F7F7F7]",
        ghost: "text-[#222] hover:bg-[#F7F7F7]",
        link: "text-[#66B600] underline underline-offset-4 hover:text-[#559A00]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

/** Slot mínimo: fusiona props/className en el hijo único (estilo shadcn sin dependencia extra). */
const Slot = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }
>(function Slot({ children, className, ...props }, ref) {
  if (!React.isValidElement(children)) return null;
  const child = children as React.ReactElement<Record<string, unknown>>;
  const childProps = child.props as { className?: string };
  return React.cloneElement(child, {
    ...props,
    className: cn(className, childProps.className),
    ref,
  } as Record<string, unknown>);
});

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }));
    if (asChild) {
      return (
        <Slot className={classes} ref={ref} {...props}>
          {children}
        </Slot>
      );
    }
    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
