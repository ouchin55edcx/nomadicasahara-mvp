import Image from "next/image";

const DAYS = [
  { n: 1, date: "LU, 16 NOV.", hotel: "Marrakech" },
  { n: 2, date: "MA, 17 NOV.", hotel: "Marrakech" },
  { n: 3, date: "MI, 18 NOV.", hotel: "Marrakech" },
  { n: 4, date: "JU, 19 NOV.", hotel: "Marrakech" },
  { n: 5, date: "VI, 20 NOV.", hotel: "Marrakech" },
  { n: 6, date: "SÁ, 21 NOV.", hotel: "Marrakech" },
  { n: 7, date: "DO, 22 NOV.", hotel: "Marrakech" },
];

function BedIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path
        d="M3 18v-6h18v6M3 12V7M7 12V9h5v3M21 18v2M3 18v2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Hero photo for the Marrakech itinerary. */
export function TourGallery() {
  return (
    <div className="relative h-[240px] overflow-hidden rounded-sm md:h-[320px]">
      <Image
        src="/images/tour-ciudades.jpg"
        alt="Arquitectura de Marrakech"
        fill
        priority
        className="object-cover"
        sizes="(max-width: 1200px) 100vw, 1200px"
      />
    </div>
  );
}

/** "Itinerario del viaje": one card per day. */
export function TourItinerary() {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold">Itinerario del viaje</h2>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {DAYS.map((d) => (
          <div
            key={d.n}
            className="overflow-hidden rounded-sm border border-line bg-white"
          >
            <div className="flex items-center gap-2 border-b border-line bg-surface px-3 py-2">
              <span className="text-[13px] font-semibold">{d.n}</span>
              <span className="text-[11px] uppercase tracking-nav text-muted">
                {d.date}
              </span>
            </div>
            <div className="space-y-2 px-3 py-3 text-[13px]">
              {d.hotel && (
                <p className="flex items-center gap-2 font-medium text-amber-600">
                  <BedIcon />
                  {d.hotel}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
