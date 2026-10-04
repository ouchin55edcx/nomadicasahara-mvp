import { MapPin, Star } from "lucide-react";
import type { Product } from "@/data/catalog";

const reviewItems = [
  {
    name: "Carlos M.",
    location: "Madrid, España",
    date: "18/09/2026",
    title: "Una estancia estupenda",
    body: "El personal fue muy amable y la habitación estaba impecable. La ubicación nos permitió recorrer Marrakech con facilidad.",
  },
  {
    name: "Fatima R.",
    location: "Valencia, España",
    date: "12/09/2026",
    title: "Muy recomendable",
    body: "Desayuno variado, zonas comunes cuidadas y un equipo atento. Volveríamos sin dudarlo.",
  },
  {
    name: "James W.",
    location: "London, UK",
    date: "04/09/2026",
    title: "Perfecto para visitar la ciudad",
    body: "Cómodo y tranquilo después de un día en la medina. Buena relación calidad-precio.",
  },
  {
    name: "Nadia B.",
    location: "Lyon, France",
    date: "29/08/2026",
    title: "Atención excelente",
    body: "Nos ayudaron con recomendaciones locales y todo fue tal como se describía en la reserva.",
  },
];

const criteria = [
  ["Ubicación", 4.7],
  ["Silencio en la habitación", 4.4],
  ["Habitaciones", 4.6],
  ["Servicio", 4.8],
  ["Calidad-precio", 4.5],
  ["Limpieza", 4.8],
] as const;

export default function HotelReviews({ hotel }: { hotel: Product }) {
  const score = hotel.rating ?? 9;
  const scoreOutOfFive = score / 2;

  return (
    <section aria-labelledby="hotel-reviews-title" className="mt-10">
      <div className="mb-4 flex items-center gap-3">
        <h2 id="hotel-reviews-title" className="shrink-0 text-xl font-semibold">
          Opiniones del alojamiento
        </h2>
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="border border-line bg-white p-4">
          <p className="text-xs font-medium uppercase text-muted">Opiniones destacadas</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full border-[5px] border-green-600 text-2xl font-semibold text-ink">
              {score.toFixed(1)}
            </span>
            <div>
              <p className="font-semibold">Muy bueno</p>
              <p className="mt-0.5 text-xs text-muted">
                Basado en {hotel.reviewCount ?? 120} opiniones
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2.5">
            {criteria.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[1fr_auto] items-center gap-2 text-xs">
                <span>{label}</span>
                <span className="flex items-center gap-1.5">
                  <span className="flex gap-0.5" aria-label={`${value} sobre 5`}>
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        className={`h-3 w-3 ${index < Math.round(value) ? "fill-green-600 text-green-600" : "text-gray-300"}`}
                        aria-hidden="true"
                      />
                    ))}
                  </span>
                  <span className="font-medium">{value.toFixed(1)}</span>
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-line pt-3 text-xs text-muted">
            <p className="font-medium text-ink">Opiniones verificadas</p>
            <p className="mt-1">Las puntuaciones resumen experiencias recientes de huéspedes.</p>
          </div>
        </aside>

        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2">
            <p className="text-xs text-muted">
              Mostrando {reviewItems.length} opiniones destacadas de {hotel.reviewCount ?? 120}
            </p>
            <button type="button" className="text-xs font-medium text-green-700 hover:text-green-800">
              Ver todas las opiniones
            </button>
          </div>
          <article className="border border-green-100 bg-green-50/60 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-800">
                  {reviewItems[0].name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold">{reviewItems[0].name}</p>
                  <p className="flex items-center gap-1 text-[11px] text-muted">
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                    {reviewItems[0].location}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-muted">{reviewItems[0].date}</p>
                <span className="mt-1 inline-flex gap-0.5" aria-label="5 de 5 estrellas">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star key={index} className="h-3 w-3 fill-green-600 text-green-600" aria-hidden="true" />
                  ))}
                </span>
              </div>
            </div>
            <h3 className="mt-3 text-sm font-semibold">“{reviewItems[0].title}”</h3>
            <p className="mt-1 text-sm leading-6 text-[#4E554E]">{reviewItems[0].body}</p>
          </article>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {reviewItems.slice(1).map((review) => (
              <article key={review.name} className="border border-line bg-white p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold">{review.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted">
                      <MapPin className="h-3 w-3" aria-hidden="true" />
                      {review.location}
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 gap-0.5" aria-label="5 de 5 estrellas">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star key={index} className="h-3 w-3 fill-green-600 text-green-600" aria-hidden="true" />
                    ))}
                  </span>
                </div>
                <p className="mt-3 text-xs font-semibold">“{review.title}”</p>
                <p className="mt-1 text-xs leading-5 text-muted">{review.body}</p>
                <p className="mt-2 text-[10px] text-muted">{review.date}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}