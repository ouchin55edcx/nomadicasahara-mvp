"use client";

import { useEffect, useRef, useState } from "react";

type NavItem = {
  label: string;
  href: string;
  columns: { title: string; links: string[] }[];
};

function filterHref(label: string) {
  const filter = label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const routes: Record<string, string> = {
    "todas-las-excursiones": "/excursiones-marruecos",
    desierto: "/excursiones-desierto-marruecos",
    agafay: "/excursion-desierto-agafay",
    zagora: "/excursion-desierto-zagora",
    merzouga: "/excursion-desierto-merzouga",
    "salidas-desde": "/excursiones-marrakech",
    marrakech: "/excursiones-marrakech",
    saidia: "/excursiones-saidia",
    "excursiones-privadas": "/excursiones-privadas-marruecos",
    "traslados-aeropuerto": "/traslados-aeropuerto-marrakech",
    "cena-espectaculo": "/cena-espectaculo-marrakech",
    hoteles: "/hoteles-marrakech",
    "hammam-y-spa": "/hammam-spa-marrakech",
  };

  return routes[filter] ?? "/excursiones-marruecos";
}

const ITEMS: NavItem[] = [
  {
    label: "Desierto",
    href: filterHref("Desierto"),
    columns: [
      {
        title: "",
        links: ["Agafay", "Zagora", "Merzouga"],
      },
    ],
  },
  {
    label: "Salidas desde",
    href: filterHref("Salidas desde"),
    columns: [
      {
        title: "",
        links: ["Marrakech", "Saidia"],
      },
    ],
  },
  {
    label: "Excursiones privadas",
    href: filterHref("Excursiones privadas"),
    columns: [],
  },
  {
    label: "Traslados aeropuerto",
    href: filterHref("Traslados aeropuerto"),
    columns: [],
  },
  {
    label: "Cena espectáculo",
    href: filterHref("Cena espectáculo"),
    columns: [],
  },
  {
    label: "Hoteles",
    href: filterHref("Hoteles"),
    columns: [],
  },
  {
    label: "Hammam y spa",
    href: filterHref("Hammam y spa"),
    columns: [],
  },
];

const CHEVRON = "M6 9l6 6 6-6";

const script = {
  fontFamily: "'Brush Script MT', 'Snell Roundhand', 'Segoe Script', cursive",
};

export default function MainNav() {
  const [active, setActive] = useState(-1);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [openSection, setOpenSection] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    timer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenMenu(null);
      setSheetOpen(false);
    };
    document.addEventListener("keydown", onKey);

    const selectedIndex = ITEMS.findIndex(
      (it) =>
        it.href === window.location.pathname ||
        it.columns.some((column) =>
          column.links.some((link) => filterHref(link) === window.location.pathname),
        ),
    );
    if (selectedIndex >= 0) setActive(selectedIndex);

    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  useEffect(() => () => cancelClose(), []);

  const item = openMenu !== null ? ITEMS[openMenu] : null;

  return (
    <nav
      aria-label="Navegación principal"
      className="relative z-30 bg-white"
      onMouseLeave={scheduleClose}
    >
      {/* Mobile trigger */}
      <div className="flex h-11 items-center justify-between border-b border-line px-3 lg:hidden">
        <span className="text-[13px] font-medium uppercase tracking-nav">
          Menú
        </span>
        <button
          type="button"
          aria-label="Abrir menú"
          aria-expanded={sheetOpen}
          onClick={() => setSheetOpen(true)}
          className="-mr-2 p-2 text-ink"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 6h18M3 12h18M3 18h18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Desktop nav: category row spanning the full width, ECI-style */}
      <div className="hidden border-b border-line lg:block">
        <div className="mx-auto w-full max-w-[1200px] overflow-x-auto px-3">
          <ul className="flex h-[60px] w-max min-w-full items-stretch justify-between gap-6">
            {ITEMS.map((it, i) => (
              <li key={it.label} className="flex">
                <a
                  href={it.href}
                  aria-expanded={it.columns.length ? openMenu === i : undefined}
                  onMouseEnter={() => {
                    cancelClose();
                    setActive(i);
                    setOpenMenu(it.columns.length ? i : null);
                  }}
                  onFocus={() => {
                    setActive(i);
                    setOpenMenu(it.columns.length ? i : null);
                  }}
                  onClick={() => setActive(i)}
                  className={`flex select-none items-center self-stretch whitespace-nowrap border-b-2 px-0.5 text-center text-[13px] uppercase tracking-nav transition-colors ${
                    active === i
                      ? "border-ink font-semibold text-ink"
                      : "border-transparent font-medium text-ink hover:border-line-soft"
                  }`}
                >
                  {it.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mega menu */}
      {item && item.columns.length > 0 && (
        <div
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          className="absolute inset-x-0 top-full hidden border-b border-line bg-white shadow-[0_24px_40px_-32px_rgba(0,0,0,0.45)] lg:block"
        >
          <div className="mx-auto w-full max-w-[1200px] px-3">
            <div className="grid gap-7 py-6 sm:grid-cols-2 lg:grid-cols-3">
                {item.columns.map((col) => (
                  <div key={col.title}>
                    {col.title ? (
                      <h3 className="text-[12px] font-semibold uppercase tracking-nav text-muted">
                        {col.title}
                      </h3>
                    ) : null}
                    <ul className="mt-3 space-y-2">
                      {col.links.map((link) => (
                        <li key={link}>
                          <a
                            href={filterHref(link)}
                            className="text-[14px] leading-snug text-ink transition-colors hover:text-brand"
                          >
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile sheet */}
      {sheetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          className="fixed inset-0 z-50 lg:hidden"
        >
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setSheetOpen(false)}
            className="absolute inset-0 h-full w-full w-full bg-ink-dark/50"
          />
          <div className="absolute inset-y-0 right-0 flex w-[min(380px,90vw)] flex-col bg-white shadow-2xl">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4">
              <span className="flex items-baseline gap-1.5">
                <span className="text-[17px] font-medium">Nomadica</span>
                <span className="text-[22px] leading-none text-brand" style={script}>
                  Sahara
                </span>
              </span>
              <button
                type="button"
                aria-label="Cerrar menú"
                onClick={() => setSheetOpen(false)}
                className="-mr-2 p-2 text-ink"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-4">
              {ITEMS.map((it, i) => (
                <div key={it.label} className="border-b border-line">
                  {it.columns.length === 0 ? (
                    <a
                      href={it.href}
                      onClick={() => {
                        setActive(i);
                        setSheetOpen(false);
                      }}
                      className={`block py-3.5 text-[14px] font-medium uppercase tracking-nav transition-colors ${
                        active === i ? "text-brand" : "text-ink"
                      }`}
                    >
                      {it.label}
                    </a>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-3">
                        <a
                          href={it.href}
                          onClick={() => {
                            setActive(i);
                            setSheetOpen(false);
                          }}
                          className={`flex-1 py-3.5 text-[14px] font-medium uppercase tracking-nav transition-colors ${
                            active === i ? "text-brand" : "text-ink"
                          }`}
                        >
                          {it.label}
                        </a>
                        <button
                          type="button"
                          aria-label={`Mostrar opciones de ${it.label}`}
                          aria-expanded={openSection === i}
                          onClick={() => {
                            setActive(i);
                            setOpenSection(openSection === i ? null : i);
                          }}
                          className="p-2 text-muted"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                            className={`shrink-0 transition-transform ${
                              openSection === i
                                ? "rotate-180 text-brand"
                                : "text-muted"
                            }`}
                          >
                            <path
                              d={CHEVRON}
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>

                      {openSection === i && (
                        <div className="pb-4">
                          {it.columns.map((col) => (
                            <div key={col.title} className="mb-3">
                              {col.title ? (
                                <p className="text-[12px] font-semibold uppercase tracking-nav text-muted">
                                  {col.title}
                                </p>
                              ) : null}
                              <ul className="mt-1.5 space-y-1">
                                {col.links.map((link) => (
                                  <li key={link}>
                                    <a
                                      href={filterHref(link)}
                                      onClick={() => setSheetOpen(false)}
                                      className="block py-0.5 text-[14px] text-ink transition-colors hover:text-brand"
                                    >
                                      {link}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="shrink-0 space-y-3 border-t border-line p-4">
              <a
                href="tel:913300732"
                className="flex items-center gap-2 text-[13px] text-muted transition-colors hover:text-brand"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="text-brand"
                >
                  <path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                91 33 00 732
              </a>
              <div className="flex gap-2">
                <a href="#" className="btn btn-primary flex-1">
                  Reservar ahora
                </a>
                <a href="#" className="btn btn-secondary flex-1">
                  Iniciar sesión
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
