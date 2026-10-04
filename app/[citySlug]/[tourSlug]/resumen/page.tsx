import Image from "next/image";
import Header from "@/components/Header";
import MainNav from "@/components/MainNav";
import Footer from "@/components/Footer";
import { TourGallery, TourItinerary } from "@/components/tour-shared";
import SaveBudgetModal from "@/components/SaveBudgetModal";
import RouteMap from "@/components/RouteMap";

// Static for now: only the tours listed below are generated.
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
    title: `Resumen — ${tour} | ${city} | Nomadica Sahara`,
    description:
      "Resumen del viaje: alojamiento, transporte, servicios incluidos y condiciones de tu reserva.",
  };
}

function InfoIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      className="text-brand-dark"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.8v.2" strokeLinecap="round" />
    </svg>
  );
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

function PriceBar({ autoOpen = false }: { autoOpen?: boolean }) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-sm bg-brand-soft px-5 py-4">
      <p className="text-[17px] font-medium md:text-[19px]">
        El precio final de tu reserva es de{" "}
        <span className="text-[22px] text-muted line-through">1020 €</span>{" "}
        <span className="text-[26px] font-bold md:text-[30px]">918 €</span>
      </p>
      <div className="flex items-center gap-3">
        <SaveBudgetModal
          autoOpen={autoOpen}
          triggerClassName="rounded-sm border border-brand bg-white px-4 py-2.5 text-[13px] font-semibold transition-colors hover:bg-brand-soft"
        />
        <button type="button" className="btn btn-primary px-8">
          Reservar
        </button>
      </div>
    </div>
  );
}

function PromosCard() {
  return (
    <div className="mt-3 rounded-sm border border-line bg-white px-5 py-4">
      <h2 className="text-[16px] font-semibold">
        Promociones aplicadas a tu reserva…
      </h2>
      <div className="mt-3 flex flex-wrap items-start gap-x-16 gap-y-3">
        <div className="flex items-center gap-3">
          <span className="flex items-start gap-1.5 rounded-sm border border-brand bg-white px-2 py-1.5">
            <TagIcon className="mt-0.5 text-brand-dark" />
            <span className="text-[11px] font-semibold leading-tight">
              -10%
              <br />
              Descuento
            </span>
          </span>
          <div>
            <p className="text-[13px] font-semibold">10% de descuento</p>
            <p className="text-[13px] text-muted">10% de descuento</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-line">
            <EuroIcon />
          </span>
          <div>
            <p className="text-[13px] font-semibold">
              Aplaza el pago y disfruta viajando
            </p>
            <p className="text-[13px] font-semibold text-brand-dark">
              ¡Financiable!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const SUMMARY_HOTELS = [
  {
    name: "Kenzi Club Agdal Medina- All Inclusive",
    stars: 5,
    stay: "Marrakech - 2 noches",
    room: "1 Habitación De Lujo Con Vista Al Jardín | Todo incluido",
    image: "/images/tour-ciudades.jpg",
    alt: "Vista de Marrakech y su palmeral",
  },
  {
    name: "Riad Al Madina",
    stars: 3,
    stay: "Essaouira - 3 noches",
    room: "1 Habitación Estándar | Alojamiento y desayuno",
    image: "/images/tour-costa.jpg",
    alt: "Barcas de pesca en la costa de Essaouira",
  },
  {
    name: "Kenzi Club Agdal Medina- All Inclusive",
    stars: 5,
    stay: "Marrakech - 1 noche",
    room: "1 Habitación De Lujo Con Vista Al Jardín | Todo incluido",
    image: "/images/tour-ciudades.jpg",
    alt: "Vista de Marrakech y su palmeral",
  },
];

const SUMMARY_FLIGHTS = [
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

function ResumenCard() {
  return (
    <section className="mt-8 overflow-hidden rounded-sm border border-line bg-white">
      <div className="bg-[#12652C] px-5 py-3">
        <h2 className="text-[19px] font-bold text-white">Resumen del Viaje</h2>
      </div>
      <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)]">
        {/* Left: alojamiento + transporte */}
        <div className="lg:border-r lg:border-line lg:pr-6">
          <h3 className="text-[12px] font-semibold uppercase tracking-nav">
            Alojamiento
          </h3>
          {SUMMARY_HOTELS.map((h, i) => (
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
                    <p className="mt-1 text-[14px] text-amber-500">
                      {"★".repeat(h.stars)}
                    </p>
                    <p className="text-[13px] text-muted">{h.stay}</p>
                    <p className="text-[13px] text-muted">{h.room}</p>
                  </div>
                  <InfoIcon />
                </div>
              </div>
            </div>
          ))}

          <h3 className="mt-6 text-[12px] font-semibold uppercase tracking-nav">
            Transporte
          </h3>
          {SUMMARY_FLIGHTS.map((f) => (
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
        </div>

        {/* Right: description, services, map, notes, itinerary */}
        <div>
          <h3 className="text-[19px] font-bold">
            “ Descubre Marrakech y Essaouira ”
          </h3>
          <p className="mt-3 text-[13.5px] leading-[1.65] text-ink">
            Este viaje de 7 días combina la ciudad imperial de Marrakech con la
            costa atlántica de Essaouira. Empezarás entre la medina, los zocos
            y las palmeras al pie del Atlas, con su plaza de Jemaa el-Fna y sus
            riads de patio interior, y terminarás frente al océano, entre las
            murallas del siglo XVIII, las barcas del puerto y los cafés con
            vistas al mar. Dos ciudades, dos ritmos y un mismo viaje, con
            vuelos, hoteles y seguros incluidos.
          </p>

          <h4 className="mt-5 text-[14px] font-semibold">
            Servicios incluidos en el viaje
          </h4>
          <ul className="mt-2 space-y-1.5 text-[13.5px]">
            {[
              "Vuelo de ida y vuelta.",
              "Estancia en el hotel seleccionado en Marrakech.",
              "Régimen seleccionado en Marrakech.",
              "Estancia en el hotel seleccionado en Essaouira.",
              "Régimen seleccionado en Essaouira.",
              "Seguro de viaje.",
            ].map((s) => (
              <li key={s} className="flex gap-2">
                <span className="font-bold text-brand-dark">✓</span>
                {s}
              </li>
            ))}
          </ul>

          <h4 className="mt-5 text-[14px] font-semibold">
            Servicios NO incluidos
          </h4>
          <ul className="mt-2 space-y-1.5 text-[13.5px]">
            {[
              "Traslado desde el aeropuerto al hotel en Marrakech.",
              "Traslado desde el hotel en Marrakech al hotel en Essaouira.",
              "Traslado desde el hotel en Essaouira al hotel en Marrakech.",
              "Traslado desde el hotel en Marrakech al aeropuerto.",
            ].map((s) => (
              <li key={s} className="flex gap-2 text-muted">
                <span className="font-bold text-ink">✗</span>
                {s}
              </li>
            ))}
          </ul>

          {/* Route map (Mapbox) */}
          <div className="mt-5 overflow-hidden rounded-sm border border-line">
            <RouteMap />
          </div>

          {/* Important notes */}
          <h4 className="mt-6 text-[14px] font-semibold">Notas importantes</h4>
          <div className="mt-2 space-y-2 text-[13px] leading-[1.6] text-muted">
            <p>
              - Marruecos es un país musulmán y durante el Ramadán los horarios
              de ocio y restauración se reducen en la mayor parte del país; el
              consumo de alcohol está restringido en muchos establecimientos y
              algunos negocios reducen su horario de atención.
            </p>
            <p>
              - Las habitaciones triples suelen ser habitaciones con dos camas
              individuales o una doble más una cama adicional; por las molestias
              que ello puede suponer, desaconsejamos su uso salvo que sea
              imprescindible.
            </p>
            <p>
              - La hora de entrada a los hoteles el día de llegada depende de
              cada establecimiento, pero en ningún caso será antes de las 15h,
              salvo que se indique lo contrario.
            </p>
            <p>
              - La tarjeta de crédito está considerada una garantía, por lo que
              a veces su uso es imprescindible para registrarse en los hoteles.
            </p>
            <p>
              - Normalmente los hoteles disponen de cuna para los bebés; de lo
              contrario, tendrán que compartir cama con un adulto.
            </p>
            <p>
              - Consultar documentación necesaria para entrar a los destinos
              visitados y para el tránsito en los países en los que se realicen
              escalas aéreas.
            </p>
          </div>

          {/* Day by day */}
          <h4 className="mt-6 text-[14px] font-semibold">Itinerario</h4>
          <div className="mt-2 space-y-3 text-[13px] leading-[1.6]">
            {[
              {
                t: "Día 1: CIUDAD DE ORIGEN - MARRAKECH",
                d: "Salida con destino Marrakech. Llegada y traslado desde el aeropuerto al hotel seleccionado en Marrakech por cuenta propia. Resto del día libre. Alojamiento.",
              },
              { t: "Día 2: MARRAKECH", d: "Día libre. Alojamiento." },
              {
                t: "Día 3: MARRAKECH - ESSAOUIRA",
                d: "Traslado desde el hotel seleccionado en Marrakech al hotel seleccionado en Essaouira por cuenta propia. Resto del día libre. Alojamiento.",
              },
              { t: "Día 4: ESSAOUIRA", d: "Día libre. Alojamiento." },
              { t: "Día 5: ESSAOUIRA", d: "Día libre. Alojamiento." },
              {
                t: "Día 6: ESSAOUIRA - MARRAKECH",
                d: "Traslado desde el hotel seleccionado en Essaouira al hotel seleccionado en Marrakech por cuenta propia. Resto del día libre. Alojamiento.",
              },
              {
                t: "Día 7: CIUDAD DE ORIGEN",
                d: "Traslado al aeropuerto por cuenta propia. Vuelo con destino a la ciudad de origen. Llegada. Fin del viaje y de nuestros servicios.",
              },
            ].map((day) => (
              <div key={day.t}>
                <p className="font-bold text-brand-dark">{day.t}</p>
                <p className="text-muted">{day.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ResumenPage() {
  return (
    <>
      <Header />
      <MainNav />

      <main className="mx-auto w-full max-w-[1200px] px-3 pb-10 pt-4">
        <TourGallery />

        <div className="mt-5">
          <p className="text-[13px] text-muted">Marruecos, 7 dias</p>
          <h1 className="mt-1 text-[30px] font-bold leading-tight md:text-[34px]">
            Marrakech y Essaouira
          </h1>
          <p className="mt-1 text-[15px] font-semibold">
            A tu aire con estancia en playa
          </p>
        </div>

        <TourItinerary />

        <PriceBar autoOpen />
        <PromosCard />

        <ResumenCard />

        <PriceBar />
        <PromosCard />
      </main>

      <Footer />
    </>
  );
}
