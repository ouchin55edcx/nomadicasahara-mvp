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

export function generateMetadata({
  params,
}: {
  params: { citySlug: string; tourSlug: string };
}) {
  const city = titleFromSlug(params.citySlug.replace(/-tours$/, ""));
  const tour = titleFromSlug(params.tourSlug);
  return {
    title: `${tour} — ${city} | Nomadica Sahara`,
    description:
      "Experiencias locales y alojamiento en Marrakech, con atención de anfitriones de la ciudad.",
  };
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
  title: string;
  stars: number;
  location: string;
  nights: number;
  roomType: string;
  mealPlan: string;
  ratingScore: number;
  ratingText: string;
  image: string;
  alt: string;
};

type Transfer = {
  from: string;
  fromType: string;
  to: string;
  toType: string;
  date: string;
  shared: string;
  priv: string;
};

const PLANS = [
  {
    key: "riad-full-moon",
    title: "Riad en la Medina",
    oldPrice: "540 €",
    price: "450 €",
    perPerson: "225 € por persona",
    recommended: false,
    hotels: [
      {
        title: "Riad Full Moon",
        stars: 2,
        location: "Marrakech Medina",
        nights: 6,
        roomType: "Habitación Estándar",
        mealPlan: "Alojamiento y desayuno",
        ratingScore: 8.0,
        ratingText: "Muy bueno",
        image: "/images/tour-fez.jpg",
        alt: "Patio interior de un riad en Marrakech",
      },
    ],
    transfers: [
      { from: "Marrakech Medina", fromType: "Zona de Marrakech", to: "Gueliz", toType: "Zona de Marrakech", date: "16/11/2026", shared: "Compartido + 20 €", priv: "Privado + 30 €" },
      { from: "Gueliz", fromType: "Zona de Marrakech", to: "Palmeraie", toType: "Zona de Marrakech", date: "19/11/2026", shared: "Compartido + 20 €", priv: "Privado + 30 €" },
    ] as Transfer[],
  },
  {
    key: "riad-dar-anika",
    title: "Riad con Encanto",
    oldPrice: "720 €",
    price: "630 €",
    perPerson: "315 € por persona",
    recommended: true,
    hotels: [
      {
        title: "Riad Dar Anika",
        stars: 4,
        location: "Marrakech Medina",
        nights: 6,
        roomType: "Habitación Doble Superior",
        mealPlan: "Alojamiento y desayuno",
        ratingScore: 8.9,
        ratingText: "Excelente",
        image: "/images/tour-ciudades.jpg",
        alt: "Riad con patio tradicional en Marrakech",
      },
    ],
    transfers: [
      { from: "Marrakech Medina", fromType: "Zona de Marrakech", to: "Hivernage", toType: "Zona de Marrakech", date: "17/11/2026", shared: "Compartido + 20 €", priv: "Privado + 32 €" },
      { from: "Hivernage", fromType: "Zona de Marrakech", to: "Marrakech Medina", toType: "Zona de Marrakech", date: "20/11/2026", shared: "Compartido + 20 €", priv: "Privado + 32 €" },
    ] as Transfer[],
  },
  {
    key: "melia-marrakech",
    title: "Hotel Urbano",
    oldPrice: "980 €",
    price: "840 €",
    perPerson: "420 € por persona",
    recommended: false,
    hotels: [
      {
        title: "Meliá Marrakech",
        stars: 4,
        location: "Hivernage, Marrakech",
        nights: 6,
        roomType: "Habitación Deluxe",
        mealPlan: "Alojamiento y desayuno",
        ratingScore: 8.7,
        ratingText: "Fabuloso",
        image: "/images/tour-sahara-lux.jpg",
        alt: "Hotel urbano con piscina en Marrakech",
      },
    ],
    transfers: [
      { from: "Hivernage", fromType: "Zona de Marrakech", to: "Marrakech Medina", toType: "Zona de Marrakech", date: "16/11/2026", shared: "Compartido + 20 €", priv: "Privado + 35 €" },
      { from: "Marrakech Medina", fromType: "Zona de Marrakech", to: "Gueliz", toType: "Zona de Marrakech", date: "21/11/2026", shared: "Compartido + 20 €", priv: "Privado + 35 €" },
    ] as Transfer[],
  },
  {
    key: "atlas-palace",
    title: "Hotel Boutique",
    oldPrice: "1080 €",
    price: "960 €",
    perPerson: "480 € por persona",
    recommended: true,
    hotels: [
      {
        title: "Atlas Palace & Spa",
        stars: 5,
        location: "Gueliz, Marrakech",
        nights: 6,
        roomType: "Habitación Deluxe con Terraza",
        mealPlan: "Media pensión",
        ratingScore: 9.2,
        ratingText: "Fantástico",
        image: "/images/tour-ciudades.jpg",
        alt: "Hotel boutique con jardín en Marrakech",
      },
    ],
    transfers: [
      { from: "Gueliz", fromType: "Zona de Marrakech", to: "Agdal", toType: "Zona de Marrakech", date: "18/11/2026", shared: "Compartido + 20 €", priv: "Privado + 35 €" },
      { from: "Agdal", fromType: "Zona de Marrakech", to: "Gueliz", toType: "Zona de Marrakech", date: "21/11/2026", shared: "Compartido + 20 €", priv: "Privado + 35 €" },
    ] as Transfer[],
  },
  {
    key: "palmeraie-oasis",
    title: "Resort en Palmeraie",
    oldPrice: "900 €",
    price: "780 €",
    perPerson: "390 € por persona",
    recommended: false,
    hotels: [
      {
        title: "Palmeraie Oasis Resort",
        stars: 5,
        location: "Palmeraie, Marrakech",
        nights: 6,
        roomType: "Suite Jardín",
        mealPlan: "Alojamiento y desayuno",
        ratingScore: 9.0,
        ratingText: "Excelente",
        image: "/images/tour-merzouga.jpg",
        alt: "Resort con jardines en la Palmeraie de Marrakech",
      },
    ],
    transfers: [
      { from: "Palmeraie", fromType: "Zona de Marrakech", to: "Marrakech Medina", toType: "Zona de Marrakech", date: "17/11/2026", shared: "Compartido + 25 €", priv: "Privado + 40 €" },
      { from: "Marrakech Medina", fromType: "Zona de Marrakech", to: "Palmeraie", toType: "Zona de Marrakech", date: "20/11/2026", shared: "Compartido + 25 €", priv: "Privado + 40 €" },
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
        {plan.hotels.map((h: Hotel) => (
          <div
            key={h.title}
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
                    {h.title}
                  </p>
                  <p className="mt-1 text-[13px]">
                    <span className="text-amber-500">
                      {"★".repeat(h.stars)}
                    </span>{" "}
                    <span className="text-[12px] text-muted">
                      {h.location} · {h.nights} noches
                    </span>
                  </p>
                  <p className="mt-1 text-[12px] text-muted">{h.roomType}</p>
                  <p className="mt-1 text-[12px] text-muted">{h.mealPlan}</p>
                  <p className="mt-1 text-[12px] font-semibold">
                    {h.ratingScore.toFixed(1)} · {h.ratingText}
                  </p>
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
        <Link href={resumenHref} className="btn btn-primary px-12">
          Reservar
        </Link>
      </div>
    </article>
  );
}

export default function TourPage({
  params,
}: {
  params: { citySlug: string; tourSlug: string };
}) {
  const resumenHref = `/${params.citySlug}/${params.tourSlug}/resumen`;
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
              Marrakech
            </h1>
            <p className="mt-1 text-[15px] font-semibold">
              Experiencias locales y estancia en la ciudad
            </p>
            <p className="mt-5 text-[13px] leading-relaxed text-muted">
              Zona: Marrakech <span className="mx-1.5">|</span> 16/11/2026 -
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
