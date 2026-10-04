"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    theme="light"
    className="toaster group"
    position="top-right"
    toastOptions={{
      classNames: {
        toast:
          "group toast group-[.toaster]:bg-white group-[.toaster]:text-[#222] group-[.toaster]:border group-[.toaster]:border-[#E5E5E5] group-[.toaster]:shadow-lg group-[.toaster]:rounded-sm",
        description: "group-[.toast]:text-[#666]",
        actionButton: "group-[.toast]:bg-[#66B600] group-[.toast]:text-white",
        cancelButton: "group-[.toast]:bg-[#F7F7F7] group-[.toast]:text-[#666]",
      },
    }}
    {...props}
  />
);

export { Toaster };
