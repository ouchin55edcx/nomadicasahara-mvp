"use client";

import * as React from "react";
import { Bell, Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Breadcrumbs from "./Breadcrumbs";
import ProfileMenu from "./ProfileMenu";
import { partnerNotifications } from "@/data/partner-mock";
import { useSidebar } from "./Sidebar";
import {Link, useRouter} from "@/i18n/navigation";

export default function Topbar() {
  const router = useRouter();
  const { setMobileOpen } = useSidebar();
  const [query, setQuery] = React.useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/partner/dashboard/bookings?q=${encodeURIComponent(q)}` : "/partner/dashboard/bookings");
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-[#E5E5E5] bg-white px-4 md:px-6">
      {/* Hamburguesa — solo móvil */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menú de navegación"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm text-[#444] transition-colors duration-150 hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600] md:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>

      <div className="min-w-0 flex-1">
        <Breadcrumbs />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2 md:gap-3">
        {/* Búsqueda */}
        <form onSubmit={handleSearch} className="relative hidden sm:block" role="search">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar reservas…"
            aria-label="Buscar reservas"
            className="h-9 w-52 rounded-sm bg-[#F7F7F7] pl-9 text-sm focus-visible:bg-white lg:w-64"
          />
        </form>

        {/* Notificaciones */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label={`Notificaciones (${partnerNotifications.length} sin leer)`}
              className="relative flex h-9 w-9 items-center justify-center rounded-sm text-[#444] transition-colors duration-150 hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600]"
            >
              <Bell className="h-5 w-5" aria-hidden />
              <span
                className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#66B600] ring-2 ring-white"
                aria-hidden
              />
            </button>
          </PopoverTrigger>

          <PopoverContent align="end" sideOffset={8} className="w-80 p-2">
            <div className="flex items-center justify-between px-2 py-1.5">
              <p className="text-sm font-semibold text-[#1A1A1A]">Notificaciones</p>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-[#66B600]">
                {partnerNotifications.length} nuevas
              </span>
            </div>

            <ul className="flex flex-col gap-0.5">
              {partnerNotifications.map((n) => (
                <li key={n.id}>
                  <PopoverClose
                    className="block w-full rounded-sm px-2 py-2 text-left transition-colors duration-150 hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600]"
                    asChild
                  >
                    <Link href={n.href}>
                      <span className="flex items-start gap-2">
                        <span
                          className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#66B600]"
                          aria-hidden
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-[#1A1A1A]">
                            {n.title}
                          </span>
                          <span className="block truncate text-xs text-[#666]">{n.body}</span>
                          <span className="mt-0.5 block text-[11px] text-[#999]">{n.time}</span>
                        </span>
                      </span>
                    </Link>
                  </PopoverClose>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>

        <ProfileMenu />
      </div>
    </header>
  );
}
