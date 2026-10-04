import {
  Accessibility,
  Building2,
  Car,
  Clock3,
  Coffee,
  Dumbbell,
  MapPin,
  ShieldCheck,
  Sparkles,
  Wifi,
} from "lucide-react";
import type { Product } from "@/data/catalog";
import {Link} from "@/i18n/navigation";

const facilityGroups = [
  {
    title: "Comida y bebida",
    icon: Coffee,
    facilities: ["Desayuno", "Restaurante", "Servicio de habitaciones"],
  },
  {
    title: "Bienestar y ocio",
    icon: Sparkles,
    facilities: ["Piscina", "Spa", "Gimnasio", "Terraza"],
  },
  {
    title: "Servicios",
    icon: ShieldCheck,
    facilities: ["WiFi", "Recepción 24 h", "Consigna de equipaje"],
  },
  {
    title: "Accesibilidad y parking",
    icon: Accessibility,
    facilities: ["Parking", "Accesibilidad", "Ascensor"],
  },
];

export default function HotelInfo({ hotel }: { hotel: Product }) {
  const availableFacilities = new Set(hotel.hotelFacilities ?? []);
  const hotelLocation = hotel.location.toLowerCase().includes("marrakech")
    ? hotel.location
    : `${hotel.location}, Marrakech`;

  return (
    <section id="hotel-info" aria-labelledby="hotel-info-title" className="mt-10">
      <div className="mb-4 flex items-center gap-3">
        <h2 id="hotel-info-title" className="shrink-0 text-xl font-semibold">
          Sobre el alojamiento
        </h2>
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="divide-y divide-line border-y border-line">
        <div className="grid gap-3 py-5 sm:grid-cols-[190px_minmax(0,1fr)]">
          <h3 className="text-sm font-semibold">Descripción</h3>
          <p className="text-sm leading-6 text-muted">
            {hotel.description ??
              `${hotel.title} combina hospitalidad local y una ubicación práctica en ${hotel.location}. Disfruta de una estancia cómoda mientras descubres los zocos, jardines y lugares históricos de Marrakech.`}
          </p>
        </div>

        <div className="grid gap-3 py-5 sm:grid-cols-[190px_minmax(0,1fr)]">
          <h3 className="text-sm font-semibold">Cómo llegar</h3>
          <div>
            <p className="flex items-center gap-2 text-sm text-muted">
              <MapPin className="h-4 w-4 shrink-0 text-green-700" aria-hidden="true" />
              {hotelLocation}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              El alojamiento está en una zona de Marrakech con comercios,
              restaurantes y lugares de interés a poca distancia.
            </p>
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.title}, ${hotelLocation}`)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-green-700 underline decoration-green-500 underline-offset-2 hover:text-green-800"
            >
              Ver ubicación <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="grid gap-3 py-5 sm:grid-cols-[190px_minmax(0,1fr)]">
          <h3 className="text-sm font-semibold">Instalaciones y servicios</h3>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {facilityGroups.map((group) => {
              const Icon = group.icon;
              const matched = group.facilities.filter((facility) =>
                availableFacilities.has(facility),
              );
              if (!matched.length) return null;

              return (
                <div key={group.title}>
                  <h4 className="flex items-center gap-2 text-sm font-medium">
                    <Icon className="h-4 w-4 text-green-700" aria-hidden="true" />
                    {group.title}
                  </h4>
                  <ul className="mt-2 space-y-1.5 text-xs text-muted">
                    {matched.map((facility) => (
                      <li key={facility} className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-green-600" aria-hidden="true" />
                        {facility}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            {availableFacilities.has("WiFi") ? (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-medium">
                  <Wifi className="h-4 w-4 text-green-700" aria-hidden="true" />
                  Conexión
                </h4>
                <ul className="mt-2 space-y-1.5 text-xs text-muted">
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-green-600" aria-hidden="true" />
                    WiFi disponible en el alojamiento
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 py-5 sm:grid-cols-[190px_minmax(0,1fr)]">
          <h3 className="text-sm font-semibold">A tener en cuenta</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold">Horarios de entrada y salida</p>
                <p className="mt-1 text-xs text-muted">Entrada desde las 14:00 · Salida hasta las 12:00</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Car className="mt-0.5 h-4 w-4 shrink-0 text-green-700" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold">Servicios opcionales</p>
                <p className="mt-1 text-xs text-muted">Consulta disponibilidad de parking y transporte local directamente con el alojamiento.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:col-span-2">
              <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" aria-hidden="true" />
              <p className="text-xs leading-5 text-muted">
                Las instalaciones y servicios pueden variar según el tipo de habitación y el régimen seleccionado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}