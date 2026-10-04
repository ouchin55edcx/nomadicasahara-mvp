import Image from "next/image";
import { ArrowRight, MapPin, Star } from "lucide-react";
import type { Product } from "@/data/catalog";
import {Link} from "@/i18n/navigation";

export default function HotelHero({ hotel }: { hotel: Product }) {
  const stayNights = 6;
  const stayTotal = hotel.price * stayNights;
  const gallery = [
    hotel.image,
    "/images/tour-ciudades.jpg",
    "/images/tour-fez.jpg",
    "/images/tour-costa.jpg",
    ...(hotel.gallery ?? []),
  ].filter((image, index, images) => images.indexOf(image) === index).slice(0, 3);
  const hotelLocation = hotel.location.toLowerCase().includes("marrakech")
    ? hotel.location
    : `${hotel.location}, Marrakech`;

  return (
    <section aria-labelledby="hotel-title">
      <nav aria-label="Migas de pan" className="mb-3 flex items-center gap-2 text-xs text-muted">
        <Link href="/" className="hover:text-green-700">Inicio</Link>
        <span aria-hidden="true">/</span>
        <Link href="/hoteles-marrakech" className="hover:text-green-700">Hoteles</Link>
        <span aria-hidden="true">/</span>
        <span className="truncate text-ink">{hotel.title}</span>
      </nav>

      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h1 id="hotel-title" className="text-2xl font-semibold leading-tight sm:text-3xl">
              {hotel.title}
            </h1>
            <span className="flex items-center text-amber-500" aria-label={`${hotel.stars ?? 0} estrellas`}>
              {Array.from({ length: hotel.stars ?? 0 }, (_, index) => (
                <Star key={index} className="h-4 w-4 fill-current" aria-hidden="true" />
              ))}
            </span>
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-muted">
            <span>{hotelLocation}</span>
            <span aria-hidden="true">·</span>
            <MapPin className="h-3.5 w-3.5 text-green-700" aria-hidden="true" />
            <a href="#hotel-map" className="underline decoration-green-600 underline-offset-2 hover:text-green-700">
              Ver mapa
            </a>
          </p>
        </div>
        {hotel.category ? (
          <span className="border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-800">
            {hotel.category}
          </span>
        ) : null}
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_270px]">
        <div className="grid h-[290px] grid-cols-[0.72fr_1.5fr] grid-rows-2 gap-2 sm:h-[390px]">
          {gallery.slice(1, 3).map((image, index) => (
            <div key={`${image}-${index}`} className="relative min-h-0 overflow-hidden bg-surface">
              <Image
                src={image}
                alt={`${hotel.title}, vista ${index + 2}`}
                fill
                sizes="(max-width: 640px) 35vw, 260px"
                className="object-cover"
              />
            </div>
          ))}
          <div className="relative col-start-2 row-span-2 row-start-1 overflow-hidden bg-surface">
            <Image
              src={gallery[0]}
              alt={hotel.title}
              fill
              priority
              sizes="(max-width: 1024px) 65vw, 620px"
              className="object-cover"
            />
            <div className="absolute bottom-3 right-3 bg-white/95 px-3 py-2 text-right shadow-sm">
              <p className="flex items-center justify-end gap-1 text-sm font-semibold">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                {hotel.rating?.toFixed(1) ?? "9.0"}
              </p>
              <p className="text-[11px] text-muted">{hotel.reviewCount ?? 0} opiniones</p>
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-2">
          <a
            id="hotel-map"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.title}, ${hotelLocation}`)}`}
            target="_blank"
            rel="noreferrer"
            className="relative flex min-h-[120px] flex-1 items-center justify-center overflow-hidden border border-line bg-[#edf2ec] text-sm font-medium text-ink sm:min-h-[150px]"
          >
            <span className="absolute inset-0 opacity-60 [background-image:linear-gradient(32deg,transparent_46%,#fff_47%,#fff_51%,transparent_52%),linear-gradient(118deg,transparent_39%,#d8e2d4_40%,#d8e2d4_44%,transparent_45%),linear-gradient(160deg,transparent_58%,#fff_59%,#fff_63%,transparent_64%)]" />
            <span className="relative inline-flex items-center gap-1.5 border border-white bg-white/90 px-3 py-2 shadow-sm">
              <MapPin className="h-4 w-4 text-green-700" aria-hidden="true" />
              Ver mapa
            </span>
          </a>

          <div className="border border-line bg-white p-4 text-center">
            <p className="bg-ink px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Mejor precio disponible
            </p>
            <p className="mt-3 text-sm font-medium">Habitación seleccionada</p>
            <p className="text-xs text-muted">2 adultos · 6 noches</p>
            <p className="mt-2 text-3xl font-semibold text-green-700">
              {stayTotal.toLocaleString("es-ES")} €
            </p>
            <p className="text-xs text-muted">Precio final · {stayNights} noches</p>
            <p className="mt-1 text-[11px] text-muted">
              {hotel.price.toLocaleString("es-ES")} € por noche · {Math.round(hotel.price / 2)} € por persona/noche
            </p>
            <Link
              href="#rooms"
              className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 bg-green-700 px-3 text-xs font-semibold uppercase text-white transition-colors hover:bg-green-800"
            >
              Reservar ahora <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <p className="mt-2 text-[11px] text-muted">Precio sujeto a disponibilidad</p>
          </div>
        </aside>
      </div>

      {hotel.hotelFacilities?.length ? (
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 border border-green-100 bg-green-50 px-3 py-2 text-xs text-ink">
          <span className="font-semibold">Servicios destacados:</span>
          {hotel.hotelFacilities.slice(0, 4).map((facility) => (
            <span key={facility}>{facility}</span>
          ))}
          {hotel.hotelFacilities.length > 4 ? (
            <a href="#hotel-info" className="font-medium text-green-800 underline underline-offset-2">
              +{hotel.hotelFacilities.length - 4} servicios más
            </a>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}