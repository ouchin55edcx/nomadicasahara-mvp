"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  CalendarX2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Lock,
  LockOpen,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  getMonthAvailability,
  TIME_SLOTS,
  type DayAvailability,
  type DayState,
  type PartnerProduct,
} from "@/data/partner-mock";

const WEEK_HEADERS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const STATE_STYLES: Record<DayState, { cell: string; dot: string; label: string }> = {
  disponible: {
    cell: "border-[#CDE8A6] bg-[#EAF6D6] hover:border-[#67B500]",
    dot: "bg-[#67B500]",
    label: "Disponible",
  },
  pocas: {
    cell: "border-[#F5D08A] bg-[#FFF4DC] hover:border-[#F0A500]",
    dot: "bg-[#F0A500]",
    label: "Pocas plazas",
  },
  completo: {
    cell: "border-[#F0B8B2] bg-[#FDECEC] hover:border-[#D93025]",
    dot: "bg-[#D93025]",
    label: "Completo",
  },
  bloqueado: {
    cell: "border-[#E5E5E5] bg-[#EFEFEF] hover:border-[#BBB]",
    dot: "bg-[#999]",
    label: "Bloqueado",
  },
};

type DayOverrides = {
  blocked: boolean;
  capacity?: number;
  price?: number;
  slots: string[];
};

export default function AvailabilityCalendar({ products }: { products: PartnerProduct[] }) {
  const activeProducts = React.useMemo(() => products.filter((p) => p.status !== "Borrador"), [products]);

  const [productId, setProductId] = React.useState(activeProducts[0]?.id ?? "");
  const [month, setMonth] = React.useState(9); // Octubre (0-indexed)
  const [year, setYear] = React.useState(2026);

  const [selected, setSelected] = React.useState<string | null>(null);
  const [overrides, setOverrides] = React.useState<Record<string, DayOverrides>>({});
  const [bulkOpen, setBulkOpen] = React.useState(false);
  const [bulkFrom, setBulkFrom] = React.useState("");
  const [bulkTo, setBulkTo] = React.useState("");

  const product = activeProducts.find((p) => p.id === productId);

  const days = React.useMemo(() => {
    if (!product) return [] as DayAvailability[];
    return getMonthAvailability(product, year, month);
  }, [product, year, month]);

  const selectedDay = days.find((d) => d.date === selected) ?? null;
  const selectedOverride = selected ? overrides[selected] : undefined;

  function shiftMonth(delta: number) {
    setSelected(null);
    setMonth((m) => {
      const next = m + delta;
      if (next < 0) {
        setYear((y) => y - 1);
        return 11;
      }
      if (next > 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return next;
    });
  }

  function stateFor(day: DayAvailability): DayState {
    const o = overrides[day.date];
    if (o) return o.blocked ? "bloqueado" : day.state === "bloqueado" ? "disponible" : day.state;
    return day.state;
  }

  function saveDay() {
    if (!selectedDay) return;
    const form = document.getElementById("day-panel-form") as HTMLFormElement | null;
    if (!form) return;

    const data = new FormData(form);
    const capacity = Number(data.get("capacity"));
    const price = Number(data.get("price"));
    const blocked = data.get("blocked") === "on";
    const slots = TIME_SLOTS.filter((s) => data.get(`slot-${s}`) === "on");

    setOverrides((prev) => ({
      ...prev,
      [selectedDay.date]: { blocked, capacity, price, slots },
    }));
    toast.success(`Día ${selectedDay.date} actualizado`, {
      description: blocked ? "Marcado como bloqueado." : `${capacity} plazas · ${price} €`,
    });
  }

  function runBulkBlock() {
    if (!bulkFrom || !bulkTo) {
      toast.error("Selecciona las dos fechas del rango");
      return;
    }
    const affected = days.filter((d) => d.date >= bulkFrom && d.date <= bulkTo);
    if (affected.length === 0) {
      toast.error("El rango no incluye días de este mes");
      return;
    }
    setOverrides((prev) => {
      const next = { ...prev };
      for (const d of affected) {
        next[d.date] = { blocked: true, slots: [] };
      }
      return next;
    });
    setBulkOpen(false);
    setBulkFrom("");
    setBulkTo("");
    toast.success(`${affected.length} días bloqueados`, {
      description: `Del ${bulkFrom} al ${bulkTo}`,
    });
  }

  function toggleBlockSelected() {
    if (!selectedDay) return;
    const current = overrides[selectedDay.date]?.blocked ?? selectedDay.state === "bloqueado";
    setOverrides((prev) => ({
      ...prev,
      [selectedDay.date]: {
        blocked: !current,
        slots: prev[selectedDay.date]?.slots ?? [],
        capacity: prev[selectedDay.date]?.capacity,
        price: prev[selectedDay.date]?.price,
      },
    }));
    toast.success(!current ? "Día bloqueado" : "Día desbloqueado", {
      description: selectedDay.date,
    });
  }

  const leadingBlanks = days.length > 0 ? days[0].weekday : 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Controles */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-full sm:w-72">
          <Select value={productId} onValueChange={(v) => { setProductId(v); setSelected(null); }}>
            <SelectTrigger className="h-11" aria-label="Seleccionar producto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {activeProducts.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1 rounded-sm border border-[#E5E5E5] bg-white">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            aria-label="Mes anterior"
            className="flex h-11 w-11 items-center justify-center text-[#444] transition-colors hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67B500]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[150px] px-2 text-center text-sm font-semibold text-[#1A1A1A]">
            {MONTH_NAMES[month]} {year}
          </span>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            aria-label="Mes siguiente"
            className="flex h-11 w-11 items-center justify-center text-[#444] transition-colors hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67B500]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <Button variant="outline" className="h-11 gap-2" onClick={() => setBulkOpen(true)}>
          <CalendarX2 className="h-4 w-4" /> Bloquear rango de fechas
        </Button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Calendario */}
        <div className="flex-1">
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {WEEK_HEADERS.map((h) => (
              <div
                key={h}
                className="py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-[#999]"
              >
                {h}
              </div>
            ))}

            {Array.from({ length: leadingBlanks }).map((_, i) => (
              <div key={`blank-${i}`} aria-hidden />
            ))}

            {days.map((day) => {
              const state = stateFor(day);
              const style = STATE_STYLES[state];
              const isSelected = selected === day.date;

              return (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => setSelected(isSelected ? null : day.date)}
                  aria-label={`${day.date} — ${style.label}`}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex min-h-[68px] flex-col items-start gap-1 rounded-sm border p-1.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67B500] sm:min-h-[80px]",
                    style.cell,
                    isSelected && "ring-2 ring-[#67B500] ring-offset-1",
                    day.past && "opacity-50",
                  )}
                >
                  <span className="text-xs font-semibold text-[#1A1A1A]">{day.day}</span>
                  <span className="mt-auto flex items-center gap-1 text-[10px] font-medium text-[#444]">
                    <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} aria-hidden />
                    {state === "bloqueado"
                      ? "—"
                      : `${day.remaining} libres`}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Leyenda */}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-sm border border-[#E5E5E5] bg-white p-3">
            {(Object.keys(STATE_STYLES) as DayState[]).map((s) => (
              <span key={s} className="flex items-center gap-2 text-xs text-[#444]">
                <span
                  className={cn("h-3 w-3 rounded-sm", STATE_STYLES[s].dot)}
                  aria-hidden
                />
                {STATE_STYLES[s].label}
              </span>
            ))}
          </div>
        </div>

        {/* Panel lateral del día */}
        {selectedDay ? (
          <aside
            className="w-full shrink-0 rounded-sm border border-[#E5E5E5] bg-white p-5 lg:w-[320px]"
            aria-label={`Panel del día ${selectedDay.date}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#999]">
                  Día seleccionado
                </p>
                <p className="text-base font-semibold text-[#1A1A1A]">{selectedDay.date}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Cerrar panel"
                className="flex h-8 w-8 items-center justify-center rounded-sm text-[#666] transition-colors hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67B500]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              id="day-panel-form"
              className="mt-4 flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                saveDay();
              }}
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="day-capacity" className="flex items-center gap-1.5 text-xs font-medium">
                  <Users className="h-3.5 w-3.5 text-[#999]" /> Capacidad
                </Label>
                <Input
                  id="day-capacity"
                  name="capacity"
                  type="number"
                  min={0}
                  defaultValue={selectedOverride?.capacity ?? selectedDay.capacity}
                  className="h-11"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="day-price" className="text-xs font-medium">
                  Precio override (€)
                </Label>
                <Input
                  id="day-price"
                  name="price"
                  type="number"
                  min={0}
                  defaultValue={selectedOverride?.price ?? selectedDay.price}
                  className="h-11"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <p className="flex items-center gap-1.5 text-xs font-medium">
                  <Clock className="h-3.5 w-3.5 text-[#999]" /> Franjas horarias
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {TIME_SLOTS.map((slot) => {
                    const defaultChecked = selectedOverride
                      ? selectedOverride.slots.includes(slot)
                      : slot === "09:30"; // mock por defecto
                    return (
                      <label
                        key={slot}
                        className="cursor-pointer rounded-sm border border-[#E5E5E5] px-2 py-1 text-xs font-medium text-[#444] has-[:checked]:border-[#67B500] has-[:checked]:bg-[#EAF6D6] has-[:checked]:text-gray-900"
                      >
                        <input
                          type="checkbox"
                          name={`slot-${slot}`}
                          defaultChecked={defaultChecked}
                          className="sr-only"
                        />
                        {slot}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-sm bg-[#FFF4DC] px-3 py-2 text-xs text-[#8A6100]">
                Estado actual:{" "}
                <span className="font-semibold">{STATE_STYLES[stateFor(selectedDay)].label}</span>
              </div>

              <div className="flex flex-col gap-2">
                <Button type="submit" className="h-11">
                  Guardar cambios
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={toggleBlockSelected}
                  className="h-11 gap-2"
                >
                  {stateFor(selectedDay) === "bloqueado" ? (
                    <>
                      <LockOpen className="h-4 w-4" /> Desbloquear día
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" /> Bloquear día
                    </>
                  )}
                </Button>
              </div>
            </form>
          </aside>
        ) : null}
      </div>

      {/* Bloqueo masivo */}
      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bloquear rango de fechas</DialogTitle>
            <DialogDescription>
              Los días seleccionados dejarán de aceptar reservas hasta que los desbloquees.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bulk-from" className="text-xs font-medium">
                Desde
              </Label>
              <Input
                id="bulk-from"
                type="date"
                value={bulkFrom}
                onChange={(e) => setBulkFrom(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bulk-to" className="text-xs font-medium">
                Hasta
              </Label>
              <Input
                id="bulk-to"
                type="date"
                value={bulkTo}
                onChange={(e) => setBulkTo(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkOpen(false)}>
              Volver
            </Button>
            <Button onClick={runBulkBlock} className="gap-2">
              <Lock className="h-4 w-4" /> Bloquear rango
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
