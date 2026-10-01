"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type NavItem = {
  label: string;
  href: string;
  columns: { title: string; links: string[] }[];
  featured: {
    image: string;
    alt: string;
    badge: string;
    title: string;
    cta: string;
  };
};

const ITEMS: NavItem[] = [
  {
    label: "Ofertas",
    href: "#ofertas",
    columns: [
      {
        title: "Último minuto",
        links: ["Escapada a Marrakech", "Fin de semana en Essaouira", "Salidas de esta semana"],
      },
      {
        title: "Larga duración",
        links: ["Ruta de las mil kasbahs", "Ciudades imperiales en 7 días", "Sáhara y Atlas en 10 días"],
      },
      {
        title: "Familias",
        links: ["Niños gratis en julio", "Jaimas familiares en Merzouga", "Medinas y desierto en familia"],
      },
    ],
    featured: {
      image: "/images/tour-sahara-lux.jpg",
      alt: "Campamento de lujo entre las dunas del Sáhara",
      badge: "20% de descuento",
      title: "Sáhara premium: campamento de lujo",
      cta: "Reservar ahora",
    },
  },
  {
    label: "Destinos",
    href: "#destinos",
    columns: [
      {
        title: "Desierto",
        links: ["Merzouga y el Erg Chebbi", "Erg Chigaga", "Zagora y el valle del Draa"],
      },
      {
        title: "Ciudades imperiales",
        links: ["Marrakech", "Fez el-Bali", "Meknés", "Rabat", "Chefchaouen"],
      },
      {
        title: "Costa atlántica",
        links: ["Essaouira", "Agadir", "Taghazout", "Oualidia"],
      },
    ],
    featured: {
      image: "/images/tour-merzouga.jpg",
      alt: "Dunas del Erg Chebbi al atardecer en Merzouga",
      badge: "10% de descuento",
      title: "Noche de estrellas en Merzouga",
      cta: "Reservar ahora",
    },
  },
  {
    label: "Cruceros",
    href: "#cruceros",
    columns: [
      {
        title: "Costa atlántica",
        links: ["Essaouira y su puerto", "Tarifa y el estrecho", "Cabo San Vicente"],
      },
      {
        title: "Mediterráneo",
        links: ["Tánger y Ceuta", "Costa marroquí", "Algeciras – Tánger"],
      },
      {
        title: "En barco",
        links: ["Avistamiento de ballenas", "Paseo al atardecer", "Islas Chafarinas"],
      },
    ],
    featured: {
      image: "/images/banner-essaouira.jpg",
      alt: "Vista del puerto y las murallas de Essaouira sobre el Atlántico",
      badge: "10% de descuento",
      title: "Paseo en barco por Essaouira",
      cta: "Reservar ahora",
    },
  },
  {
    label: "Caribe",
    href: "#caribe",
    columns: [
      {
        title: "Islas",
        links: ["Cuba", "Jamaica", "República Dominicana"],
      },
      {
        title: "Playas",
        links: ["Cayo Coco", "Punta Cana", "Holguín"],
      },
      {
        title: "Paquetes",
        links: ["All inclusive", "Escapadas de 7 noches", "Lunas de miel"],
      },
    ],
    featured: {
      image: "/images/tour-costa.jpg",
      alt: "Barcas de pesca varadas en la costa",
      badge: "Vuelo + hotel",
      title: "Caribe: 7 noches all inclusive",
      cta: "Reservar ahora",
    },
  },
  {
    label: "Grandes viajes",
    href: "#grandes-viajes",
    columns: [
      {
        title: "Rutas clásicas",
        links: ["Ciudades imperiales esenciales", "Ruta del Sáhara", "Marruecos en 15 días"],
      },
      {
        title: "Aventura",
        links: ["Travesía del Alto Atlas", "4x4 por el Draa", "Travesía en dromedario"],
      },
      {
        title: "Experiencias",
        links: ["Sesión de astronomía", "Clase de cocina marroquí", "Noche en riad con terraza"],
      },
    ],
    featured: {
      image: "/images/tour-atlas.jpg",
      alt: "Senda de trekking entre pueblos bereberes del Alto Atlas",
      badge: "12% de descuento",
      title: "Trekking del Alto Atlas",
      cta: "Reservar ahora",
    },
  },
  {
    label: "Parques temáticos",
    href: "#parques-tematicos",
    columns: [
      {
        title: "Cine y desierto",
        links: ["Atlas Studios de Ouarzazate", "Aït Ben Haddou", "Kasbah de Taourirt"],
      },
      {
        title: "Naturaleza",
        links: ["Parque Nacional del Toubkal", "Palmeraies de Skoura", "Reserva de Souss-Massa"],
      },
      {
        title: "En familia",
        links: ["Jardín Majorelle", "Acuario de Agadir", "Oasis de Fint"],
      },
    ],
    featured: {
      image: "/images/tour-kasbahs.jpg",
      alt: "Fortaleza de adobe en la ruta de las kasbahs",
      badge: "5% de descuento",
      title: "Kasbahs y estudios de cine",
      cta: "Reservar ahora",
    },
  },
  {
    label: "Hoteles",
    href: "#hoteles",
    columns: [
      {
        title: "Riads",
        links: ["Riad en Marrakech", "Riad en la medina de Fez", "Casa en Chefchaouen"],
      },
      {
        title: "Desierto",
        links: ["Campamento de lujo en Merzouga", "Jaima con baño privado", "Bivouac en Erg Chigaga"],
      },
      {
        title: "Lujo",
        links: ["Hoteles kasbah", "Resorts en Agadir", "Riads de lujo"],
      },
    ],
    featured: {
      image: "/images/tour-fez.jpg",
      alt: "Vista de la medina de Fez",
      badge: "15% de descuento",
      title: "Riad con patio en la medina de Fez",
      cta: "Reservar ahora",
    },
  },
  {
    label: "Vuelos",
    href: "#vuelos",
    columns: [
      {
        title: "Rutas",
        links: ["Madrid – Marrakech", "Barcelona – Casablanca", "Vuelos a Fez"],
      },
      {
        title: "Aeropuertos",
        links: ["Marrakech Menara", "Casablanca Mohammed V", "Agadir Al Massira"],
      },
      {
        title: "Consejos",
        links: ["Equipaje facturado", "Escalas y tránsitos", "Mejores tarifas del año"],
      },
    ],
    featured: {
      image: "/images/hero.jpg",
      alt: "Paisaje del sur de Marruecos entre dunas y palmeras",
      badge: "Desde 89 €",
      title: "Vuelos a Marrakech desde 89 €",
      cta: "Reservar ahora",
    },
  },
  {
    label: "Más productos",
    href: "#mas-productos",
    columns: [
      {
        title: "Novedades",
        links: [
          "Sáhara premium: campamento de lujo",
          "La ruta de las mil kasbahs",
          "Fez y la medina eterna",
        ],
      },
      {
        title: "Duración",
        links: ["Escapadas de 1 día", "Viajes de 3 a 5 días", "Rutas de 7 días o más"],
      },
      {
        title: "Precio",
        links: ["Hasta 200 €", "De 200 a 500 €", "Más de 500 €"],
      },
    ],
    featured: {
      image: "/images/tour-gastronomia.jpg",
      alt: "Especias y puestos de color en los zocos de Marrakech",
      badge: "8% de descuento",
      title: "Sabores de Marrakech",
      cta: "Reservar ahora",
    },
  },
];

const CHEVRON = "M6 9l6 6 6-6";

const script = {
  fontFamily: "'Brush Script MT', 'Snell Roundhand', 'Segoe Script', cursive",
};

export default function MainNav() {
  const [active, setActive] = useState(4); // Grandes viajes underlined by default
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [openSection, setOpenSection] = useState<number | null>(0);
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
      <div className="flex h-11 items-center justify-between border-b border-line px-3 md:hidden">
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
      <div className="hidden border-b border-line md:block">
        <div className="mx-auto w-full max-w-[1200px] px-3">
          <ul className="flex h-[60px] items-stretch justify-between">
            {ITEMS.map((it, i) => (
              <li key={it.label} className="flex">
                <a
                  href={it.href}
                  aria-expanded={openMenu === i}
                  onMouseEnter={() => {
                    cancelClose();
                    setActive(i);
                    setOpenMenu(i);
                  }}
                  onFocus={() => {
                    setActive(i);
                    setOpenMenu(i);
                  }}
                  onClick={() => setActive(i)}
                  className={`flex select-none items-center self-stretch border-b-2 px-0.5 text-center text-[13px] uppercase tracking-nav transition-colors ${
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
      {item && (
        <div
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          className="absolute inset-x-0 top-full hidden border-b border-line bg-white shadow-[0_24px_40px_-32px_rgba(0,0,0,0.45)] md:block"
        >
          <div className="mx-auto w-full max-w-[1200px] px-3">
            <div className="grid gap-7 py-7 md:grid-cols-2 lg:grid-cols-[1fr_300px]">
              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {item.columns.map((col) => (
                  <div key={col.title}>
                    <h3 className="text-[12px] font-semibold uppercase tracking-nav text-muted">
                      {col.title}
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {col.links.map((link) => (
                        <li key={link}>
                          <a
                            href="#"
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

              <aside className="flex flex-col overflow-hidden border border-line bg-surface md:flex-row lg:flex-col">
                <div className="relative h-32 w-full shrink-0 md:h-auto md:w-36 lg:h-32 lg:w-full">
                  <Image
                    src={item.featured.image}
                    alt={item.featured.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 144px, 300px"
                  />
                  <span className="badge absolute left-3 top-3">
                    {item.featured.badge}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-[12px] uppercase tracking-nav text-muted">
                    Destacado
                  </p>
                  <h3 className="mt-1 text-[15px] font-semibold leading-snug">
                    {item.featured.title}
                  </h3>
                  <a href="#" className="btn btn-primary mt-auto w-full">
                    {item.featured.cta}
                  </a>
                </div>
              </aside>
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
          className="fixed inset-0 z-50 md:hidden"
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
                  <button
                    type="button"
                    aria-expanded={openSection === i}
                    onClick={() => {
                      setActive(i);
                      setOpenSection(openSection === i ? null : i);
                    }}
                    className={`flex w-full items-center justify-between gap-3 py-3.5 text-left text-[14px] font-medium uppercase tracking-nav transition-colors ${
                      active === i ? "text-brand" : "text-ink"
                    }`}
                  >
                    {it.label}
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

                  {openSection === i && (
                    <div className="pb-4">
                      {it.columns.map((col) => (
                        <div key={col.title} className="mb-3">
                          <p className="text-[12px] font-semibold uppercase tracking-nav text-muted">
                            {col.title}
                          </p>
                          <ul className="mt-1.5 space-y-1">
                            {col.links.map((link) => (
                              <li key={link}>
                                <a
                                  href="#"
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
                      <a
                        href="#"
                        onClick={() => setSheetOpen(false)}
                        className="btn btn-primary mt-1 w-full"
                      >
                        {it.featured.cta}
                      </a>
                    </div>
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
