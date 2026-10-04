"use client";

import * as React from "react";
import { useRouter } from "@/i18n/navigation";
import Image from "next/image";
import { toast } from "sonner";
import {
  Copy,
  Eye,
  LayoutGrid,
  MoreHorizontal,
  Pencil,
  Pause,
  Play,
  Plus,
  Search,
  Star,
  Trash2,
  Rows3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmptyState from "./EmptyState";
import StatusBadge from "./StatusBadge";
import { formatMoney } from "./BookingsTable";
import { CITIES, type PartnerProduct, type ProductStatus } from "@/data/partner-mock";
import { Package, PackageX } from "lucide-react";
import { cn } from "@/lib/utils";
import {Link} from "@/i18n/navigation";

type StatusFilter = ProductStatus | "all";
type CityFilter = string | "all";

export default function ProductsTable({ products }: { products: PartnerProduct[] }) {
  const [view, setView] = React.useState<"table" | "cards">("table");
  const [query, setQuery] = React.useState("");
  const [city, setCity] = React.useState<CityFilter>("all");
  const [status, setStatus] = React.useState<StatusFilter>("all");
  const [items, setItems] = React.useState(products);

  React.useEffect(() => setItems(products), [products]);

  const filtered = items.filter((p) => {
    if (query && !p.title.toLowerCase().includes(query.toLowerCase())) return false;
    if (city !== "all" && p.city !== city) return false;
    if (status !== "all" && p.status !== status) return false;
    return true;
  });

  function handleAction(action: string, product: PartnerProduct) {
    switch (action) {
      case "edit":
        toast.info(`Editando «${product.title}»`, { description: "Demo: el editor no está conectado." });
        break;
      case "duplicate": {
        const copy: PartnerProduct = {
          ...product,
          id: `${product.id}-copy-${Date.now()}`,
          title: `${product.title} (copia)`,
          status: "Borrador",
          bookingsCount: 0,
          views: 0,
          conversion: 0,
        };
        setItems((prev) => [copy, ...prev]);
        toast.success("Producto duplicado", { description: "La copia se ha creado como borrador." });
        break;
      }
      case "pause":
        setItems((prev) =>
          prev.map((p) =>
            p.id === product.id
              ? { ...p, status: p.status === "Pausado" ? "Activo" : "Pausado" }
              : p,
          ),
        );
        toast.success(
          product.status === "Pausado"
            ? `«${product.title}» reactivado`
            : `«${product.title}» pausado`,
        );
        break;
      case "delete":
        setItems((prev) => prev.filter((p) => p.id !== product.id));
        toast.success(`«${product.title}» eliminado`);
        break;
    }
  }

  const hasFilters = query !== "" || city !== "all" || status !== "all";

  return (
    <div className="flex flex-col gap-4">
      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar producto…"
            aria-label="Buscar producto"
            className="h-11 pl-9"
          />
        </div>

        <Select value={city} onValueChange={(v) => setCity(v)}>
          <SelectTrigger className="h-11 w-full sm:w-44" aria-label="Filtrar por ciudad">
            <SelectValue placeholder="Ciudad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las ciudades</SelectItem>
            {CITIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
          <SelectTrigger className="h-11 w-full sm:w-44" aria-label="Filtrar por estado">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="Activo">Activo</SelectItem>
            <SelectItem value="Borrador">Borrador</SelectItem>
            <SelectItem value="Pausado">Pausado</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1 rounded-sm border border-[#E5E5E5] bg-white p-1">
          <button
            type="button"
            onClick={() => setView("table")}
            aria-label="Vista de tabla"
            aria-pressed={view === "table"}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600]",
              view === "table" ? "bg-[#EAF6D6] text-[#3D7A00]" : "text-[#666] hover:bg-[#F7F7F7]",
            )}
          >
            <Rows3 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setView("cards")}
            aria-label="Vista de tarjetas"
            aria-pressed={view === "cards"}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600]",
              view === "cards" ? "bg-[#EAF6D6] text-[#3D7A00]" : "text-[#666] hover:bg-[#F7F7F7]",
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>

        <Button asChild className="h-11 gap-2">
          <Link href="/partner/dashboard/products/new">
            <Plus className="h-4 w-4" /> Crear producto
          </Link>
        </Button>
      </div>

      {filtered.length === 0 ? (
        hasFilters ? (
          <EmptyState
            icon={PackageX}
            title="Sin resultados"
            description="No hay productos que coincidan con la búsqueda."
            action={
              <Button
                type="button"
                variant="outline"
                className="mt-2"
                onClick={() => {
                  setQuery("");
                  setCity("all");
                  setStatus("all");
                }}
              >
                Limpiar filtros
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={Package}
            title="Aún no tienes productos"
            description="Crea tu primera excursión para empezar a recibir reservas."
            action={
              <Button asChild className="mt-2">
                <Link href="/partner/dashboard/products/new">Crear producto</Link>
              </Button>
            }
          />
        )
      ) : view === "table" ? (
        <div className="rounded-sm border border-[#E5E5E5] bg-white">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Producto</TableHead>
                <TableHead className="hidden md:table-cell">Ciudad</TableHead>
                <TableHead className="hidden sm:table-cell">Precio</TableHead>
                <TableHead className="hidden lg:table-cell">Reservas</TableHead>
                <TableHead className="hidden lg:table-cell">Valoración</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[60px]" aria-label="Acciones" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id} className="odd:bg-white even:bg-[#FBFBFB]">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image
                        src={p.image}
                        alt=""
                        width={48}
                        height={36}
                        className="h-9 w-12 shrink-0 rounded-sm object-cover"
                      />
                      <div className="min-w-0">
                        <p className="line-clamp-1 font-medium text-[#1A1A1A]">{p.title}</p>
                        <p className="text-xs text-[#999]">{p.category}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-sm md:table-cell">{p.city}</TableCell>
                  <TableCell className="hidden font-semibold sm:table-cell">
                    {formatMoney(p.price)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{p.bookingsCount}</TableCell>
                  <TableCell className="hidden items-center gap-1 lg:flex">
                    <Star className="h-3.5 w-3.5 fill-[#F0A500] text-[#F0A500]" />
                    <span className="text-sm font-medium">{p.rating.toFixed(1)}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} />
                  </TableCell>
                  <TableCell>
                    <RowMenu product={p} onAction={handleAction} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="flex flex-col overflow-hidden rounded-sm border border-[#E5E5E5] bg-white"
            >
              <div className="relative h-40">
                <Image src={p.image} alt={p.title} fill className="object-cover" />
                <span className="absolute left-3 top-3">
                  <StatusBadge status={p.status} />
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="line-clamp-1 font-semibold text-[#1A1A1A]">{p.title}</p>
                    <p className="text-xs text-[#999]">
                      {p.city} · {p.category}
                    </p>
                  </div>
                  <RowMenu product={p} onAction={handleAction} />
                </div>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="text-lg font-bold text-[#66B600]">
                    {formatMoney(p.price)}
                  </span>
                  <span className="flex items-center gap-3 text-xs text-[#666]">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" /> {p.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-[#F0A500] text-[#F0A500]" />
                      {p.rating.toFixed(1)}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <p className="text-sm text-[#666]">
          Mostrando <span className="font-semibold text-[#1A1A1A]">{filtered.length}</span> de{" "}
          {items.length} productos
          {hasFilters ? " (con filtros)" : ""}
        </p>
      ) : null}
    </div>
  );
}

function RowMenu({
  product,
  onAction,
}: {
  product: PartnerProduct;
  onAction: (action: string, product: PartnerProduct) => void;
}) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Acciones de ${product.title}`}
          className="flex h-9 w-9 items-center justify-center rounded-sm text-[#666] transition-colors hover:bg-[#F7F7F7] hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600]"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onSelect={() => { onAction("edit", product); router.push("/partner/dashboard/products/new"); }}>
          <Pencil className="h-4 w-4" /> Editar
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onAction("duplicate", product)}>
          <Copy className="h-4 w-4" /> Duplicar
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onAction("pause", product)}>
          {product.status === "Pausado" ? (
            <>
              <Play className="h-4 w-4" /> Reactivar
            </>
          ) : (
            <>
              <Pause className="h-4 w-4" /> Pausar
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => onAction("delete", product)}
          className="text-[#D93025] focus:text-[#D93025]"
        >
          <Trash2 className="h-4 w-4" /> Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
