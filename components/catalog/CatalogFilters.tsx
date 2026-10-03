"use client";

import { usePathname } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import type { CatalogConfig, CatalogKind } from "@/content/catalog";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type Query = Record<string, string | string[] | undefined>;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-medium text-[#333]">{label}</span>{children}</label>;
}

function Control({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className="h-10 w-full rounded-sm border border-line bg-white px-3 text-sm text-ink focus:border-[#58B900] focus:outline-none focus:ring-2 focus:ring-[#58B900]/20">{children}</select>;
}

function FilterFields({ config, query }: { config: CatalogConfig; query: Query }) {
  const kind: CatalogKind = config.kind;
  const get = (name: string) => {
    const value = query[name];
    return Array.isArray(value) ? value[0] : value ?? "";
  };
  const isActivity = kind === "activity" || kind === "mixed";
  return (
    <>
      {(isActivity || kind === "hotel" || kind === "dinner" || kind === "hammam" || kind === "private-tour") ? (
        <Field label={kind === "hotel" ? "Fecha de entrada" : "Fecha"}><input name="fecha" type="date" defaultValue={get("fecha")} className="h-10 w-full rounded-sm border border-line px-3 text-sm focus:border-[#58B900] focus:outline-none focus:ring-2 focus:ring-[#58B900]/20" /></Field>
      ) : null}
      {config.destinations && config.destinations.length > 1 ? (
        <Field label="Destino"><Control name="destino" defaultValue={get("destino")}><option value="">Todos los destinos</option>{config.destinations.map((destination) => <option key={destination}>{destination}</option>)}</Control></Field>
      ) : null}
      {isActivity ? <>
        <Field label="Duración"><Control name="duracion" defaultValue={get("duracion")}><option value="">Cualquier duración</option><option value="0-4">Hasta 4 horas</option><option value="4-8">4-8 horas</option><option value="8-24">Día completo</option><option value="24-1000">Varios días</option></Control></Field>
        <Field label="Recogida"><Control name="recogida" defaultValue={get("recogida")}><option value="">Indiferente</option><option value="true">Incluida</option></Control></Field>
      </> : null}
      {kind === "hotel" ? <>
        <Field label="Categoría"><Control name="estrellas" defaultValue={get("estrellas")}><option value="">Todas las categorías</option><option value="3">3 estrellas o más</option><option value="4">4 estrellas o más</option><option value="5">5 estrellas</option></Control></Field>
        <Field label="Tipo de alojamiento"><Control name="categoria" defaultValue={get("categoria")}><option value="">Todos</option><option value="riad">Riad</option><option value="hotel">Hotel</option><option value="resort">Resort</option></Control></Field>
        <Field label="Servicios"><Control name="servicio" defaultValue={get("servicio")}><option value="">Todos los servicios</option><option>WiFi</option><option>Piscina</option><option>Spa</option><option>Desayuno</option></Control></Field>
      </> : null}
      {kind === "dinner" ? <>
        <Field label="Hora"><Control name="hora" defaultValue={get("hora")}><option value="">Cualquier hora</option><option value="19">Desde las 19:00</option><option value="20">Desde las 20:00</option></Control></Field>
        <Field label="Menú"><Control name="menu" defaultValue={get("menu")}><option value="">Todos los menús</option><option value="marroquí">Marroquí</option><option value="tradicional">Tradicional</option></Control></Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="espectaculo" value="true" defaultChecked={get("espectaculo") === "true"} className="h-4 w-4 accent-[#58B900]" />Espectáculo incluido</label>
      </> : null}
      {kind === "transfer" ? <>
        <Field label="Tipo de traslado"><Control name="tipo" defaultValue={get("tipo")}><option value="">Privado o compartido</option><option value="privado">Privado</option><option value="compartido">Compartido</option></Control></Field>
        <Field label="Vehículo"><Control name="vehiculo" defaultValue={get("vehiculo")}><option value="">Cualquier vehículo</option><option value="minivan">Minivan</option><option value="minibús">Minibús</option></Control></Field>
        <Field label="Pasajeros"><Control name="pasajeros" defaultValue={get("pasajeros")}><option value="">Cualquier capacidad</option><option value="2">Hasta 2</option><option value="4">Hasta 4</option><option value="8">Hasta 8</option></Control></Field>
        <Field label="Horario"><Control name="horario" defaultValue={get("horario")}><option value="">Cualquier horario</option><option value="24">Disponible 24/7</option></Control></Field>
      </> : null}
      {kind === "hammam" ? <>
        <Field label="Tratamiento"><Control name="tratamiento" defaultValue={get("tratamiento")}><option value="">Todos</option><option value="hammam">Hammam</option><option value="masaje">Masaje</option><option value="argán">Argán</option></Control></Field>
        <Field label="Duración"><Control name="duracion" defaultValue={get("duracion")}><option value="">Cualquiera</option><option value="60">60 minutos</option><option value="90">90 minutos o más</option></Control></Field>
      </> : null}
      {kind === "private-tour" ? <>
        <Field label="Tamaño del grupo"><Control name="personas" defaultValue={get("personas")}><option value="">Cualquier tamaño</option><option value="2">Hasta 2</option><option value="4">Hasta 4</option><option value="6">Hasta 6</option></Control></Field>
        <Field label="Recogida"><Control name="recogida" defaultValue={get("recogida")}><option value="">Indiferente</option><option value="true">Incluida</option></Control></Field>
      </> : null}
      <Field label={kind === "hotel" ? "Precio máximo por noche (€)" : "Precio máximo (€)"}><input name="precio_max" type="number" min="1" defaultValue={get("precio_max")} placeholder="Sin límite" className="h-10 w-full rounded-sm border border-line px-3 text-sm focus:border-[#58B900] focus:outline-none focus:ring-2 focus:ring-[#58B900]/20" /></Field>
      {kind !== "transfer" ? <Field label="Valoración mínima"><Control name="valoracion" defaultValue={get("valoracion")}><option value="">Cualquier valoración</option><option value="4">4+ estrellas</option><option value="4.5">4,5+ estrellas</option></Control></Field> : null}
    </>
  );
}

function FilterForm({ config, query, onApply }: { config: CatalogConfig; query: Query; onApply?: () => void }) {
  const pathname = usePathname();
  return <form action={pathname} method="get" className="space-y-4">
    <FilterFields config={config} query={query} />
    <button type="submit" onClick={onApply} className="min-h-11 w-full rounded-sm bg-[#58B900] px-4 text-sm font-semibold text-white hover:bg-[#468F00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#478F00]">Aplicar filtros</button>
  </form>;
}

export function CatalogFilterTrigger({ config, query }: { config: CatalogConfig; query: Query }) {
  const activeCount = Object.entries(query).filter(([key, value]) => key !== "page" && key !== "orden" && Boolean(value)).length;
  return <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild><button className="inline-flex h-11 items-center gap-2 rounded-sm border border-line bg-white px-4 text-sm font-semibold"><SlidersHorizontal className="h-4 w-4" />Filtros{activeCount ? <span className="rounded-full bg-[#58B900] px-1.5 py-0.5 text-xs text-white">{activeCount}</span> : null}</button></SheetTrigger>
        <SheetContent side="left" className="w-[min(88vw,380px)] overflow-y-auto p-5">
          <SheetTitle className="mb-5 pr-8">Filtrar experiencias</SheetTitle>
          <FilterForm config={config} query={query} />
        </SheetContent>
      </Sheet>
    </div>;
}

export default function CatalogFilters({ config, query }: { config: CatalogConfig; query: Query }) {
  return <aside className="hidden h-fit rounded-sm border border-line bg-white p-5 lg:block">
    <h2 className="mb-5 flex items-center gap-2 text-base font-semibold"><SlidersHorizontal className="h-4 w-4" />Filtrar experiencias</h2>
    <FilterForm config={config} query={query} />
  </aside>;
}