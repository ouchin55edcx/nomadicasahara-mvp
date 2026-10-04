"use client";

import * as React from "react";
import {
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ClipboardList,
  LayoutDashboard,
  Package,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {Link, usePathname} from "@/i18n/navigation";

/* ------------------------------ Context ----------------------------- */

type SidebarState = {
  collapsed: boolean;
  mobileOpen: boolean;
  toggleCollapsed: () => void;
  setMobileOpen: (open: boolean) => void;
};

const SidebarContext = React.createContext<SidebarState | null>(null);

const STORAGE_KEY = "partner-sidebar-collapsed";

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored !== null) setCollapsed(stored === "1");
    } catch {
      // localStorage no disponible (modo privado, SSR…) — ignorar.
    }
  }, []);

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        // localStorage no disponible — mantener solo en memoria.
      }
      return next;
    });
  }, []);

  const value = React.useMemo(
    () => ({ collapsed, mobileOpen, toggleCollapsed, setMobileOpen }),
    [collapsed, mobileOpen, toggleCollapsed],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar debe usarse dentro de SidebarProvider");
  return ctx;
}

/* -------------------------------- Nav ------------------------------- */

type NavChild = { href: string; label: string; canonical?: boolean };

type NavEntry =
  | { type: "link"; id: string; label: string; href: string; icon: LucideIcon }
  | {
      type: "group";
      id: string;
      label: string;
      href: string;
      icon: LucideIcon;
      children: NavChild[];
    };

/**
 * Sibling entries that point at a route already owned by another item (Pagos,
 * Facturas, Reseñas) are navigable but never `canonical`, so the active
 * highlight always maps 1:1 to the current URL.
 */
const NAV: NavEntry[] = [
  { type: "link", id: "resumen", label: "Resumen", href: "/partner/dashboard", icon: LayoutDashboard },
  {
    type: "group",
    id: "reservas",
    label: "Reservas",
    href: "/partner/dashboard/bookings",
    icon: ClipboardList,
    children: [
      { href: "/partner/dashboard/bookings", label: "Lista de reservas", canonical: true },
      { href: "/partner/dashboard/availability", label: "Disponibilidad", canonical: true },
      { href: "/partner/dashboard/performance", label: "Reseñas" },
    ],
  },
  {
    type: "group",
    id: "productos",
    label: "Productos",
    href: "/partner/dashboard/products",
    icon: Package,
    children: [
      { href: "/partner/dashboard/products", label: "Lista de productos", canonical: true },
      { href: "/partner/dashboard/products/new", label: "Crear producto", canonical: true },
    ],
  },
  {
    type: "group",
    id: "finanzas",
    label: "Finanzas",
    href: "/partner/dashboard/finance",
    icon: Wallet,
    children: [
      { href: "/partner/dashboard/finance", label: "Resumen financiero", canonical: true },
      { href: "/partner/dashboard/finance", label: "Pagos" },
      { href: "/partner/dashboard/finance", label: "Facturas" },
    ],
  },
  {
    type: "link",
    id: "rendimiento",
    label: "Rendimiento",
    href: "/partner/dashboard/performance",
    icon: TrendingUp,
  },
];

function isEntryActive(pathname: string, entry: NavEntry): boolean {
  if (entry.type === "link") return pathname === entry.href;
  return entry.children.some((child) => child.canonical && pathname === child.href);
}

/** Ids of the groups whose subtree owns the current route. */
function activeGroupIds(pathname: string): string[] {
  return NAV.filter((entry) => entry.type === "group" && isEntryActive(pathname, entry)).map(
    (entry) => entry.id,
  );
}

function ActiveBar() {
  return (
    <span
      className="pointer-events-none absolute inset-y-0 left-0 w-[3px] rounded-r-sm bg-[#66B600]"
      aria-hidden
    />
  );
}

/* --------------------------- Collapsed group ------------------------ */

function CollapsedGroup({
  entry,
  pathname,
  open,
  onOpenChange,
  onNavigate,
}: {
  entry: Extract<NavEntry, { type: "group" }>;
  pathname: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate?: () => void;
}) {
  const Icon = entry.icon;
  const groupActive = isEntryActive(pathname, entry);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onMouseEnter={() => onOpenChange(true)}
          onFocus={() => onOpenChange(true)}
          aria-label={entry.label}
          title={entry.label}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600]",
            groupActive || open
              ? "bg-[#EAF6D6] text-[#3D7A00]"
              : "text-[#444] hover:bg-[#F7F7F7] hover:text-[#222]",
          )}
        >
          <Icon className="h-[18px] w-[18px]" aria-hidden />
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="right"
        align="start"
        sideOffset={10}
        className="w-60 p-2"
        onMouseLeave={() => onOpenChange(false)}
      >
        <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#999]">
          {entry.label}
        </p>
        <ul className="flex flex-col gap-0.5">
          {entry.children.map((child) => {
            const active = Boolean(child.canonical) && pathname === child.href;
            return (
              <li key={child.label}>
                <Link
                  href={child.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex h-9 items-center gap-2 rounded-sm pl-3 pr-2 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600]",
                    active
                      ? "bg-[#EAF6D6] font-semibold text-[#3D7A00]"
                      : "text-[#444] hover:bg-[#F7F7F7] hover:text-[#222]",
                  )}
                >
                  {active && <ActiveBar />}
                  <span className="truncate">{child.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

/* ---------------------------- Expanded group ------------------------ */

function ExpandedGroup({
  entry,
  pathname,
  open,
  onOpenChange,
  onNavigate,
}: {
  entry: Extract<NavEntry, { type: "group" }>;
  pathname: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate?: () => void;
}) {
  const Icon = entry.icon;
  const active = isEntryActive(pathname, entry);

  return (
    <Collapsible open={open} onOpenChange={onOpenChange} className="flex flex-col">
      <CollapsibleTrigger
        className={cn(
          "group flex h-10 items-center gap-3 rounded-sm px-3 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600] focus-visible:ring-offset-1",
          active
            ? "font-semibold text-[#3D7A00]"
            : "font-medium text-[#444] hover:bg-[#F7F7F7] hover:text-[#222]",
        )}
      >
        {active && <ActiveBar />}
        <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
        <span className="flex-1 truncate text-left">{entry.label}</span>
        <ChevronRight
          className="h-4 w-4 shrink-0 text-[#999] transition-transform duration-150 group-data-[state=open]:rotate-90"
          aria-hidden
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down">
        <ul className="ml-[26px] mt-0.5 flex flex-col gap-0.5 border-l border-[#E5E5E5] pl-2">
          {entry.children.map((child) => {
            const isActive = Boolean(child.canonical) && pathname === child.href;
            return (
              <li key={child.label}>
                <Link
                  href={child.href}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative flex h-9 items-center gap-2 rounded-sm pl-3 pr-2 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600] focus-visible:ring-offset-1",
                    isActive
                      ? "bg-[#EAF6D6] font-semibold text-[#3D7A00]"
                      : "text-[#666] hover:bg-[#F7F7F7] hover:text-[#222]",
                  )}
                >
                  {isActive && <ActiveBar />}
                  <span className="truncate">{child.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

/* ------------------------------- Nav list --------------------------- */

function NavList({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();

  // The group owning the active page starts open; the rest start closed.
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(activeGroupIds(pathname).map((id) => [id, true])),
  );
  const [flyout, setFlyout] = React.useState<string | null>(null);

  React.useEffect(() => {
    setOpenGroups((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const id of activeGroupIds(pathname)) {
        if (next[id] === undefined) {
          next[id] = true;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
    setFlyout(null);
  }, [pathname]);

  return (
    <nav
      className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-3"
      aria-label="Navegación del portal"
    >
      {NAV.map((entry) => {
        if (entry.type === "group") {
          return collapsed ? (
            <div key={entry.id} className="flex justify-center">
              <CollapsedGroup
                entry={entry}
                pathname={pathname}
                open={flyout === entry.id}
                onOpenChange={(open) => setFlyout(open ? entry.id : null)}
                onNavigate={onNavigate}
              />
            </div>
          ) : (
            <ExpandedGroup
              key={entry.id}
              entry={entry}
              pathname={pathname}
              open={openGroups[entry.id] ?? false}
              onOpenChange={(open) => setOpenGroups((prev) => ({ ...prev, [entry.id]: open }))}
              onNavigate={onNavigate}
            />
          );
        }

        const active = isEntryActive(pathname, entry);
        const Icon = entry.icon;

        const link = (
          <Link
            href={entry.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            aria-label={collapsed ? entry.label : undefined}
            className={cn(
              "relative flex h-10 items-center gap-3 rounded-sm text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600] focus-visible:ring-offset-1",
              active
                ? "bg-[#EAF6D6] font-semibold text-[#3D7A00]"
                : "font-medium text-[#444] hover:bg-[#F7F7F7] hover:text-[#222]",
              collapsed ? "w-10 justify-center px-0" : "px-3",
            )}
          >
            {active && <ActiveBar />}
            <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
            {!collapsed && <span className="truncate">{entry.label}</span>}
          </Link>
        );

        return (
          <div key={entry.id}>
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{entry.label}</TooltipContent>
              </Tooltip>
            ) : (
              link
            )}
          </div>
        );
      })}
    </nav>
  );
}

/* ------------------------------ Collapse ----------------------------- */

function CollapseToggle({ collapsed }: { collapsed: boolean }) {
  const { toggleCollapsed } = useSidebar();

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label="Expandir barra lateral"
            aria-expanded={false}
            className="flex h-10 w-full items-center justify-center rounded-sm text-[#666] transition-colors duration-150 hover:bg-[#F7F7F7] hover:text-[#222] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600]"
          >
            <ChevronsRight className="h-[18px] w-[18px]" aria-hidden />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">Expandir</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleCollapsed}
      aria-label="Contraer barra lateral"
      aria-expanded
      className="flex h-10 w-full items-center gap-3 rounded-sm px-3 text-sm font-medium text-[#666] transition-colors duration-150 hover:bg-[#F7F7F7] hover:text-[#222] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600]"
    >
      <ChevronsLeft className="h-[18px] w-[18px] shrink-0" aria-hidden />
      <span className="truncate">Contraer</span>
    </button>
  );
}

/* ------------------------------- Chrome ----------------------------- */

function SidebarLogo({ collapsed }: { collapsed: boolean }) {
  return (
    <div
      className={cn(
        "flex h-16 shrink-0 items-center gap-2.5 border-b border-[#E5E5E5] px-4",
        collapsed && "justify-center px-0",
      )}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-[#66B600] text-xs font-bold text-white">
        NS
      </span>
      {!collapsed && (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold leading-tight text-[#1A1A1A]">
            Nomadica Sahara
          </p>
          <p className="truncate text-[11px] leading-tight text-[#999]">Portal de socios</p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------- Desktop ---------------------------- */

export function Sidebar() {
  const { collapsed, mobileOpen, setMobileOpen } = useSidebar();

  return (
    <TooltipProvider delayDuration={100}>
      {/* Escritorio */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-[#E5E5E5] bg-white transition-[width] duration-200 md:flex",
          collapsed ? "w-[72px]" : "w-[260px]",
        )}
        aria-label="Barra lateral"
      >
        <SidebarLogo collapsed={collapsed} />
        <NavList collapsed={collapsed} />
        <div className="shrink-0 border-t border-[#E5E5E5] p-3">
          <CollapseToggle collapsed={collapsed} />
        </div>
      </aside>

      {/* Móvil */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="flex w-72 flex-col p-0 sm:max-w-xs">
          <SheetTitle className="sr-only">Navegación del portal</SheetTitle>
          <SidebarLogo collapsed={false} />
          <NavList collapsed={false} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}

/* -------------------------------- Shell ----------------------------- */

export function SidebarShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <div
      className="min-h-screen bg-[#F7F7F7] text-[14px] text-[#222]"
      style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}
    >
      <Sidebar />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding] duration-200",
          collapsed ? "md:pl-[72px]" : "md:pl-[260px]",
        )}
      >
        {children}
      </div>
    </div>
  );
}
