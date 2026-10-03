"use client";

import {
  Building2,
  ChevronDown,
  HelpCircle,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PARTNER } from "@/content/partner-mock";
import { logout } from "@/app/(auth)/partner/login/actions";

/** Las subsecciones de cuenta no tienen ruta propia todavía en el portal. */
function notifyUnavailable(section: string) {
  toast.info(section, {
    description: "Esta sección no forma parte de la demo del portal de socios.",
  });
}

export default function ProfileMenu() {
  function handleLogout() {
    void logout();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Menú de usuario"
          className="flex items-center gap-2 rounded-sm p-1 transition-colors duration-150 hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600]"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback>{PARTNER.initials}</AvatarFallback>
          </Avatar>
          <span className="hidden min-w-0 text-left lg:block">
            <span className="block truncate text-sm font-semibold leading-tight text-[#1A1A1A]">
              {PARTNER.contact}
            </span>
            <span className="block truncate text-[11px] leading-tight text-[#999]">
              {PARTNER.role}
            </span>
          </span>
          <ChevronDown className="hidden h-4 w-4 shrink-0 text-[#999] lg:block" aria-hidden />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <span className="block truncate text-sm font-semibold text-[#1A1A1A]">
            {PARTNER.contact}
          </span>
          <span className="block truncate text-xs text-[#666]">{PARTNER.email}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => notifyUnavailable("Mi perfil")}
          className="gap-2"
        >
          <User className="h-4 w-4 text-[#999]" aria-hidden />
          Mi perfil
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => notifyUnavailable("Datos de la empresa")}
          className="gap-2"
        >
          <Building2 className="h-4 w-4 text-[#999]" aria-hidden />
          Datos de la empresa
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={() => notifyUnavailable("Ajustes")} className="gap-2">
          <Settings className="h-4 w-4 text-[#999]" aria-hidden />
          Ajustes
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={() => notifyUnavailable("Ayuda")} className="gap-2">
          <HelpCircle className="h-4 w-4 text-[#999]" aria-hidden />
          Ayuda
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            handleLogout();
          }}
          className="gap-2 text-[#D93025] focus:bg-[#FDECEC] focus:text-[#D93025]"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
