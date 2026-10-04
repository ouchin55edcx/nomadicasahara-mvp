import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import MainNav from "@/components/MainNav";
import Footer from "@/components/Footer";
import { TourGallery, TourItinerary } from "@/components/tour-shared";

// Static for now: only the tours listed below are generated,
// everything else 404s (dynamicParams = false).
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { citySlug: "marrakech-tours", tourSlug: "agafay-quad" },
    { citySlug: "marrakech-tours", tourSlug: "marrakech-essaouira" },
    { citySlug: "essaouira-tours", tourSlug: "essaouira-kitesurf" },
  ];
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ citySlug: string; tourSlug: string }>;
}) {
  const { citySlug, tourSlug } = await params;
  const city = titleFromSlug(citySlug.replace(/-tours$/, ""));
  const tour = titleFromSlug(tourSlug);
  return {
    title: `${tour} — ${city} | Nomadica Sahara`,
    description:
      "Viaje de 7 días a Marrakech y Essaouira: medina, kasbahs y estancia en playa con vuelos, hoteles y traslados incluidos.",
  };
}

function PlaneIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  );
}

function VanIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M3 16V7a1 1 0 0 1 1-1h9l4 4h3a1 1 0 0 1 1 1v5M3 16h18M7 16a2 2 0 1 0 0 .01M17 16a2 2 0 1 0 0 .01"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
      className="text-muted"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.8v.2" strokeLinecap="round" />
    </svg>
  );
}

function TagIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M3 12.5V4a1 1 0 0 1 1-1h8.5L21 11.5 12.5 20 3 12.5zM7.5 7.5v.01"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EuroIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M17 6.5A6 6 0 1 0 17 17.5M4 10h9M4 14h9" strokeLinecap="round" />
    </svg>
  );
}

type Hotel = {
  name: string;
  stars: number;
  stay: string;
  room: string;
  rating: string;
  image: string;
  alt: string;
};

type Transfer = {
  from: string;
  fromType: string;
  to: string;
  toType: string;
  date: string;
  shared?: string;
  priv: string;
};

const FLIGHTS = [
  {
    route: "Madrid - Marrakech",
    date: "16/11/2026",
    from: "Madrid (MAD)",
    fromTime: "22:40",
    to: "Marrakech (RAK)",
    toTime: "23:45",
    duration: "2h 5m",
  },
  {
    route: "Marrakech - Madrid",
    date: "22/11/2026",
    from: "Marrakech (RAK)",
    fromTime: "9:20",
    to: "Madrid (MAD)",
    toTime: "12:20",
    duration: "2h 0m",
  },
];

const PLANS = [
  {
    key: "eco",
    title: "Selección Económica",
    oldPrice: "502 €",
    price: "452 €",
    perPerson: "226  € por persona",
    recommended: false,
    hotels: [
      {
        name: "Riad Full Moon",
        stars: 2,
        stay: "Marrakech - 2 noches",
        room: "Habitacion Estándar | Alojamiento y desayuno",
        rating: "8,0 Muy bueno",
        image: "/images/tour-fez.jpg",
        alt: "Patio interior de un riad en la medina de Fez",
      },
      {
        name: "Riad Al Khansaa",
        stars: 3,
        stay: "Essaouira - 3 noches",
        room: "Habitación Superior | Alojamiento y desayuno",
        rating: "8,0 Muy bueno",
        image: "/images/banner-essaouira.jpg",
        alt: "Vista del puerto y las murallas de Essaouira",
      },
      {
        name: "Riad Full Moon",
        stars: 2,
        stay: "Marrakech - 1 noche",
        room: "Habitacion Estándar | Alojamiento y desayuno",
        rating: "8,0 Muy bueno",
        image: "/images/tour-fez.jpg",
        alt: "Patio interior de un riad en la medina de Fez",
      },
    ],
    transfers: [
      { from: "Marrakech", fromType: "Aeropuerto", to: "Riad Full Moon", toType: "Hotel", date: "16/11/2026", shared: "Compartido + 20 €", priv: "Privado + 30 €" },
      { from: "Riad Full Moon", fromType: "Hotel", to: "Riad Al Khansaa", toType: "Hotel", date: "18/11/2026", priv: "Privado + 112 €" },
      { from: "Riad Al Khansaa", fromType: "Hotel", to: "Riad Full Moon", toType: "Hotel", date: "21/11/2026", priv: "Privado + 112 €" },
      { from: "Riad Full Moon", fromType: "Hotel", to: "Marrakech", toType: "Aeropuerto", date: "22/11/2026", shared: "Compartido + 20 €", priv: "Privado + 30 €" },
    ] as Transfer[],
  },
  {
    key: "rec",
    title: "Selección Recomendada",
    oldPrice: "1020 €",
    price: "918 €",
    perPerson: "459  € por persona",
    recommended: true,
    hotels: [
      {
        name: "Kenzi Club Agdal Medina- All Inclusive",
        stars: 5,
        stay: "Marrakech - 2 noches",
        room: "Habitación De Lujo Con Vista Al Jardín | Todo incluido",
        rating: "9,0 Excelente",
        image: "/images/tour-ciudades.jpg",
        alt: "Vista de Marrakech y su palmeral",
      },
      {
        name: "Riad Al Madina",
        stars: 3,
        stay: "Essaouira - 3 noches",
        room: "Habitación Estándar | Alojamiento y desayuno",
        rating: "8,0 Muy bueno",
        image: "/images/tour-costa.jpg",
        alt: "Barcas de pesca en la costa de Essaouira",
      },
      {
        name: "Kenzi Club Agdal Medina- All Inclusive",
        stars: 5,
        stay: "Marrakech - 1 noche",
        room: "Habitación De Lujo Con Vista Al Jardín | Todo incluido",
        rating: "8,0 Muy bueno",
        image: "/images/tour-ciudades.jpg",
        alt: "Vista de Marrakech y su palmeral",
      },
    ],
    transfers: [
      { from: "Marrakech", fromType: "Aeropuerto", to: "Kenzi Club Agdal Medina- All Inclusive", toType: "Hotel", date: "16/11/2026", shared: "Compartido + 20 €", priv: "Privado + 28 €" },
      { from: "Kenzi Club Agdal Medina- All Inclusive", fromType: "Hotel", to: "Riad Al Madina", toType: "Hotel", date: "18/11/2026", priv: "Privado + 112 €" },
      { from: "Riad Al Madina", fromType: "Hotel", to: "Kenzi Club Agdal Medina- All Inclusive", toType: "Hotel", date: "21/11/2026", priv: "Privado + 112 €" },
      { from: "Kenzi Club Agdal Medina- All Inclusive", fromType: "Hotel", to: "Marrakech", toType: "Aeropuerto", date: "22/11/2026", shared: "Compartido + 20 €", priv: "Privado + 28 €" },
    ] as Transfer[],
  },
];

function PlanPanel({
  plan,
  resumenHref,
}: {
  plan: (typeof PLANS)[number];
  resumenHref: string;
}) {
  return (
    <article className="overflow-hidden rounded-sm border border-line bg-white">
      {/* Header: title + price + actions */}
      <div
        className={`p-4 sm:p-5 ${plan.recommended ? "bg-brand-soft" : "bg-white"}`}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-[21px] font-bold leading-[1.15]">{plan.title}</h2>
          <div className="text-right">
            <p className="text-[12px] font-semibold text-muted">Precio Total</p>
            <p className="mt-1 leading-none">
              <span className="text-[15px] text-muted line-through">
                {plan.oldPrice}
              </span>{" "}
              <span className="text-[28px] font-bold text-brand-dark">
                {plan.price}
              </span>
            </p>
            <p className="mt-1.5 text-[11px] text-muted">{plan.perPerson}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-line bg-white">
            <EuroIcon />
          </span>
          <span className="flex items-center gap-1.5 rounded-sm border border-brand bg-white px-2.5 py-2 text-[12px] font-semibold">
            <TagIcon className="text-brand-dark" />
            -10% Descuento
          </span>
          <button
            type="button"
            className="rounded-sm border border-brand bg-white px-4 py-2 text-[12px] font-semibold uppercase tracking-nav transition-colors hover:bg-brand-soft"
          >
            Guardar presupuesto
          </button>
          <Link href={resumenHref} className="btn btn-primary px-5 py-2.5">
            Ver resumen
          </Link>
        </div>
      </div>

      {/* Alojamiento */}
      <section className="border-t border-line p-4">
        <h3 className="text-[12px] font-semibold uppercase tracking-nav">
          Alojamiento
        </h3>
        {plan.hotels.map((h: Hotel, i) => (
          <div
            key={i}
            className="mt-3 flex gap-3 border-t border-line pt-3 first:border-t-0 first:pt-0"
          >
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-sm">
              <Image
                src={h.image}
                alt={h.alt}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold leading-tight">
                    {h.name}
                  </p>
                  <p className="mt-1 text-[13px]">
                    <span className="text-amber-500">
                      {"★".repeat(h.stars)}
                    </span>{" "}
                    <span className="text-[12px] text-muted">{h.stay}</span>
                  </p>
                  <p className="mt-1 text-[12px] text-muted">{h.room}</p>
                  <p className="mt-1 text-[12px] font-semibold">{h.rating}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <InfoIcon />
                  <button
                    type="button"
                    className="rounded-sm border border-line bg-white px-3 py-1.5 text-[12px] font-medium transition-colors hover:border-brand"
                  >
                    Cambiar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Transporte */}
      <section className="border-t border-line p-4">
        <h3 className="text-[12px] font-semibold uppercase tracking-nav">
          Transporte
        </h3>
        {FLIGHTS.map((f) => (
          <div
            key={f.route}
            className="mt-3 border-t border-line pt-3 first:border-t-0 first:pt-0"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-[13px] font-semibold">
                {f.route}
                <span className="ml-2 text-[11px] font-normal text-muted">
                  {f.date}
                </span>
              </p>
              <InfoIcon />
            </div>
            <div className="mt-2 flex items-center gap-3">
              <div className="w-[120px] shrink-0">
                <p className="flex items-center gap-1.5 text-[13px] font-semibold leading-tight">
                  <PlaneIcon className="text-amber-500" />
                  {f.from}
                </p>
                <p className="mt-0.5 text-[12px] text-muted">{f.fromTime}</p>
              </div>
              <div className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center gap-2">
                  <span className="h-px flex-1 bg-line" />
                  <PlaneIcon className="text-brand" />
                  <span className="h-px flex-1 bg-line" />
                </div>
                <p className="mt-1 text-[11px]">{f.duration}</p>
                <p className="text-[11px] text-muted">Vuelo directo</p>
              </div>
              <div className="w-[120px] shrink-0 text-right">
                <p className="text-[13px] font-semibold leading-tight">{f.to}</p>
                <p className="mt-0.5 text-[12px] text-muted">{f.toTime}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            className="rounded-sm border border-line bg-white px-3 py-1.5 text-[12px] font-medium transition-colors hover:border-brand"
          >
            Cambiar
          </button>
        </div>
      </section>

      {/* Traslados */}
      <section className="border-t border-line p-4">
        <h3 className="text-[12px] font-semibold uppercase tracking-nav">
          Traslados
        </h3>
        {plan.transfers.map((t, i) => (
          <div
            key={i}
            className="mt-3 border-t border-line pt-3 first:border-t-0 first:pt-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-[110px] shrink-0">
                <p className="text-[13px] font-semibold leading-tight">
                  {t.from}
                </p>
                <p className="text-[11px] text-muted">{t.fromType}</p>
              </div>
              <div className="flex flex-1 flex-col items-center gap-1">
                <span className="h-px w-full bg-line" />
                <span className="flex items-center gap-1.5 text-[11px] text-muted">
                  <VanIcon />
                  {t.date}
                </span>
                <span className="h-px w-full bg-line" />
              </div>
              <div className="w-[130px] shrink-0 text-right">
                <p className="text-[13px] font-semibold leading-tight">{t.to}</p>
                <p className="text-[11px] text-muted">{t.toType}</p>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 rounded-sm bg-surface p-2 sm:grid-cols-3">
              <div className="text-center">
                <p className="text-[12px] text-muted">Sin transfers</p>
                <p className="text-[12px] font-semibold text-brand-dark">
                  Seleccionado
                </p>
              </div>
              {t.shared && (
                <div className="text-center">
                  <p className="text-[12px] font-semibold">{t.shared}</p>
                  <button
                    type="button"
                    className="mt-1 rounded-sm border border-line bg-white px-3 py-1 text-[12px] transition-colors hover:border-brand"
                  >
                    Cambiar
                  </button>
                </div>
              )}
              <div className="text-center">
                <p className="text-[12px] font-semibold">{t.priv}</p>
                <button
                  type="button"
                  className="mt-1 rounded-sm border border-line bg-white px-3 py-1 text-[12px] transition-colors hover:border-brand"
                >
                  Cambiar
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      <div className="flex justify-center border-t border-line p-4">
        <button type="button" className="btn btn-primary px-12">
          Reservar
        </button>
      </div>
    </article>
  );
}

export default async function TourPage({
  params,
}: {
  params: Promise<{ citySlug: string; tourSlug: string }>;
}) {
  const { citySlug, tourSlug } = await params;
  const resumenHref = `/${citySlug}/${tourSlug}/resumen`;
  return (
    <>
      <Header />
      <MainNav />

      <main className="mx-auto w-full max-w-[1200px] px-3 pb-10 pt-4">
        <TourGallery />

        {/* Title block */}
        <div className="mt-5 flex items-start justify-between gap-6">
          <div>
            <p className="text-[13px] text-muted">Marruecos, 7 dias</p>
            <h1 className="mt-1 text-[30px] font-bold leading-tight md:text-[34px]">
              Marrakech y Essaouira
            </h1>
            <p className="mt-1 text-[15px] font-semibold">
              A tu aire con estancia en playa
            </p>
            <p className="mt-5 text-[13px] leading-relaxed text-muted">
              Origen : Madrid <span className="mx-1.5">|</span> 16/11/2026 -
              22/11/2026 <span className="mx-1.5">|</span> 6 noches
              <span className="mx-1.5">|</span> 2 Personas
              <span className="mx-1.5">|</span> 1 Habitación
            </p>
          </div>
          <button
            type="button"
            className="mt-1 shrink-0 rounded-sm border border-brand bg-white px-5 py-2 text-[13px] font-semibold transition-colors hover:bg-brand-soft"
          >
            Cambiar
          </button>
        </div>

        {/* Registered-only promo bar */}
        <div className="mt-5 flex items-center justify-between gap-4 rounded-sm bg-ink-dark px-5 py-3.5 text-white">
          <span className="flex-1 text-center text-[14px] font-medium">
            ¡Ofertas exclusivas solo para clientes registrados! Inicia sesión y
            no te pierdas nada
          </span>
          <button
            type="button"
            className="hidden shrink-0 rounded-sm border border-white/70 px-4 py-1.5 text-[13px] font-semibold transition-colors hover:bg-white hover:text-ink sm:block"
          >
            Inicia Sesión
          </button>
        </div>
        <TourItinerary />
        {/* Two selection panels */}
        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          {PLANS.map((p) => (
            <PlanPanel key={p.key} plan={p} resumenHref={resumenHref} />
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
}
