"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {Link, usePathname} from "@/i18n/navigation";

type Crumb = { label: string; href?: string };

type Rule = {
  /** Matched against the full pathname. */
  match: (pathname: string) => boolean;
  crumbs: (pathname: string) => Crumb[];
};

const RULES: Rule[] = [
  {
    match: (p) => p === "/partner/dashboard",
    crumbs: () => [{ label: "Resumen" }],
  },
  {
    match: (p) => p.startsWith("/partner/dashboard/bookings/"),
    crumbs: () => [
      { label: "Reservas", href: "/partner/dashboard/bookings" },
      { label: "Detalle de reserva" },
    ],
  },
  {
    match: (p) => p === "/partner/dashboard/bookings",
    crumbs: () => [{ label: "Reservas" }, { label: "Lista de reservas" }],
  },
  {
    match: (p) => p.startsWith("/partner/dashboard/availability"),
    crumbs: () => [{ label: "Reservas" }, { label: "Disponibilidad" }],
  },
  {
    match: (p) => p.startsWith("/partner/dashboard/products/new"),
    crumbs: () => [
      { label: "Productos", href: "/partner/dashboard/products" },
      { label: "Crear producto" },
    ],
  },
  {
    match: (p) => p.startsWith("/partner/dashboard/products"),
    crumbs: () => [{ label: "Productos" }, { label: "Lista de productos" }],
  },
  {
    match: (p) => p.startsWith("/partner/dashboard/finance"),
    crumbs: () => [{ label: "Finanzas" }, { label: "Resumen financiero" }],
  },
  {
    match: (p) => p.startsWith("/partner/dashboard/performance"),
    crumbs: () => [{ label: "Rendimiento" }],
  },
];

function crumbsFor(pathname: string): Crumb[] {
  const rule = RULES.find((r) => r.match(pathname));
  if (rule) return rule.crumbs(pathname);
  return [{ label: "Portal de socios" }];
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const crumbs = React.useMemo(() => crumbsFor(pathname), [pathname]);

  return (
    <nav aria-label="Ruta de navegación" className="min-w-0">
      <ol className="flex items-center gap-1 text-sm">
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={`${crumb.label}-${i}`} className="flex min-w-0 items-center gap-1">
              {i > 0 && (
                <ChevronRight
                  className="h-3.5 w-3.5 shrink-0 text-[#CCC]"
                  aria-hidden
                />
              )}
              {crumb.href && !last ? (
                <Link
                  href={crumb.href}
                  className="truncate rounded-sm text-[#666] transition-colors duration-150 hover:text-[#67B500] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67B500]"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={cn(
                    "truncate",
                    last ? "font-semibold text-[#1A1A1A]" : "text-[#666]",
                  )}
                >
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
