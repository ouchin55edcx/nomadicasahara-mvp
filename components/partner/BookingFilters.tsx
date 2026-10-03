"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { BOOKING_SORT_OPTIONS, products } from "@/content/partner-mock";
import type { BookingStatus, BookingSort } from "@/content/partner-mock";

export type StatusCounts = Partial<Record<BookingStatus | "all", number>>;

const TABS: { value: BookingStatus | "all"; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "Pendiente", label: "Pendientes" },
  { value: "Confirmada", label: "Confirmadas" },
  { value: "Completada", label: "Completadas" },
  { value: "Cancelada", label: "Canceladas" },
];

export default function BookingFilters({
  counts,
  totalCount,
}: {
  counts: StatusCounts;
  totalCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeStatus = (searchParams.get("status") ?? "all") as BookingStatus | "all";
  const activeSort = (searchParams.get("sort") ?? "actividad") as BookingSort;

  const [search, setSearch] = React.useState(searchParams.get("q") ?? "");

  const setParam = React.useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  // Búsqueda con debounce
  React.useEffect(() => {
    const t = setTimeout(() => {
      const current = searchParams.get("q") ?? "";
      if (search !== current) setParam("q", search || null);
    }, 350);
    return () => clearTimeout(t);
  }, [search, searchParams, setParam]);

  const hasFilters =
    (searchParams.get("q") ?? "") !== "" ||
    searchParams.has("status") ||
    searchParams.has("productId") ||
    searchParams.has("from") ||
    searchParams.has("to");

  function clearFilters() {
    setSearch("");
    router.replace(pathname, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Estado */}
      <div
        role="tablist"
        aria-label="Filtrar reservas por estado"
        className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1"
      >
        {TABS.map((tab) => {
          const selected = activeStatus === tab.value;
          const count = counts[tab.value] ?? 0;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setParam("status", tab.value === "all" ? null : tab.value)}
              className={cn(
                "flex h-9 shrink-0 items-center gap-2 rounded-sm px-3 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600]",
                selected
                  ? "bg-[#EAF6D6] font-semibold text-[#3D7A00]"
                  : "text-[#666] hover:bg-[#F7F7F7] hover:text-[#222]",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "rounded-sm px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
                  selected ? "bg-[#66B600] text-white" : "bg-[#F0F0F0] text-[#666]",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Búsqueda */}
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]"
          aria-hidden
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por ID, producto o viajero…"
          aria-label="Buscar por ID, producto o viajero"
          className="h-11 pl-9"
        />
      </div>

      {/* Producto · rango de fechas · orden */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-full sm:w-64">
          <Select
            value={searchParams.get("productId") ?? "all"}
            onValueChange={(v) => setParam("productId", v === "all" ? null : v)}
          >
            <SelectTrigger className="h-11" aria-label="Filtrar por producto">
              <SelectValue placeholder="Producto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los productos</SelectItem>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-from" className="text-xs font-medium text-[#666]">
            Desde
          </label>
          <Input
            id="filter-from"
            type="date"
            value={searchParams.get("from") ?? ""}
            onChange={(e) => setParam("from", e.target.value || null)}
            className="h-11 w-full sm:w-44"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-to" className="text-xs font-medium text-[#666]">
            Hasta
          </label>
          <Input
            id="filter-to"
            type="date"
            value={searchParams.get("to") ?? ""}
            onChange={(e) => setParam("to", e.target.value || null)}
            className="h-11 w-full sm:w-44"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-sort" className="text-xs font-medium text-[#666]">
            Ordenar por
          </label>
          <Select
            value={activeSort}
            onValueChange={(v) => setParam("sort", v === "actividad" ? null : v)}
          >
            <SelectTrigger id="filter-sort" className="h-11" aria-label="Ordenar reservas">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              {BOOKING_SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasFilters ? (
          <Button
            type="button"
            variant="ghost"
            onClick={clearFilters}
            className="h-11 gap-2 text-[#666] hover:text-[#D93025]"
          >
            <X className="h-4 w-4" aria-hidden /> Limpiar filtros
          </Button>
        ) : null}

        <p className="ml-auto text-sm text-[#666]" aria-live="polite">
          <span className="font-semibold text-[#1A1A1A]">{totalCount}</span>{" "}
          {totalCount === 1 ? "reserva" : "reservas"}
        </p>
      </div>
    </div>
  );
}
