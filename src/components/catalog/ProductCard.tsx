import Image from "next/image";
import { ArrowRight, CalendarDays, CarFront, Check, Clock3, MapPin, Sparkles, Star, Users, Utensils, Waves } from "lucide-react";
import type { Product } from "@/data/catalog";
import {Link} from "@/i18n/navigation";

function Price({ product, suffix = "por persona" }: { product: Product; suffix?: string }) {
  return (
    <div className="shrink-0 md:min-w-[132px] md:border-l md:border-line md:pl-6">
      {product.discount ? <p className="mb-1 text-xs text-muted line-through">{(product.price / (1 - product.discount / 100)).toFixed(0)} €</p> : null}
      <p className="text-xs text-muted">Desde</p>
      <p className="text-[28px] font-semibold leading-tight text-[#478F00]">
        {product.price.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
        <span className="ml-1 text-base">{product.currency === "EUR" ? "€" : "MAD"}</span>
      </p>
      <p className="text-xs text-muted">{suffix}</p>
    </div>
  );
}

function Rating({ product, hotel = false }: { product: Product; hotel?: boolean }) {
  if (!product.rating) return null;
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <Star className="h-4 w-4 fill-[#E0A72E] text-[#E0A72E]" aria-hidden="true" />
      <span className="font-semibold">{product.rating.toFixed(1)}</span>
      <span className="text-muted">({product.reviewCount ?? 0} reseñas)</span>
      {hotel && product.stars ? (
        <span className="ml-2 flex text-[#E0A72E]" aria-label={`${product.stars} estrellas`}>
          {Array.from({ length: product.stars }, (_, index) => <Star key={index} className="h-3.5 w-3.5 fill-current" />)}
        </span>
      ) : null}
    </div>
  );
}

function ProductFrame({ product, children }: { product: Product; children: React.ReactNode }) {
  return (
    <article className="group overflow-hidden rounded-sm border border-line bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_35px_-24px_rgba(0,0,0,0.45)] focus-within:ring-2 focus-within:ring-[#58B900]/50 md:flex">
      <div className="relative aspect-[16/9] shrink-0 overflow-hidden bg-[#ECEEE9] md:aspect-auto md:min-h-[232px] md:w-[34%]">
        <Image src={product.image} alt={product.title} fill sizes="(max-width: 768px) 100vw, 360px" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        {product.discount ? <span className="absolute left-3 top-3 rounded-sm bg-[#58B900] px-2.5 py-1 text-xs font-semibold text-white">-{product.discount}%</span> : null}
        {product.featured ? <span className="absolute bottom-3 left-3 rounded-sm bg-white/95 px-2.5 py-1 text-[11px] font-semibold uppercase text-[#222]">Más reservado</span> : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-5 p-4 md:flex-row md:items-center md:p-5">
        {children}
      </div>
    </article>
  );
}

function Action({ product, children, href }: { product: Product; children: string; href?: string }) {
  return (
    <Link href={href ?? product.href ?? `/booking/checkout?producto=${encodeURIComponent(product.slug)}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-[#60B61A] bg-white px-4 text-sm font-semibold text-[#438D25] transition-colors hover:bg-[#60B61A] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#478F00]">
      {children}<ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}

function ActivityCard({ product }: { product: Product }) {
  return (
    <ProductFrame product={product}>
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-sm bg-[#EDF7E4] px-2 py-1 text-xs font-semibold text-[#427D0D]">{product.destination}</span>
          {product.category ? <span className="text-xs text-muted">{product.category}</span> : null}
        </div>
        <h2 className="text-lg font-semibold leading-snug text-[#222]">{product.title}</h2>
        <div className="mt-2"><Rating product={product} /></div>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted"><MapPin className="h-4 w-4" />{product.location}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#454545]">
          {product.duration ? <span className="flex items-center gap-1.5"><Clock3 className="h-4 w-4 text-[#478F00]" />{product.duration}</span> : null}
          {product.pickupIncluded ? <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-[#478F00]" />Recogida incluida</span> : null}
        </div>
        {product.availability ? <p className="mt-3 border-l-2 border-[#58B900] bg-[#F5FAF0] px-2.5 py-1.5 text-xs font-medium text-[#3D6F13]">Disponible: {product.availability}</p> : null}
      </div>
      <div className="flex items-end justify-between gap-4 border-t border-line pt-4 md:flex-col md:items-stretch md:justify-center md:border-l-0 md:border-t-0 md:pt-0">
        <Price product={product} />
        <Action product={product}>Ver actividad</Action>
      </div>
    </ProductFrame>
  );
}

function HotelCard({ product }: { product: Product }) {
  return (
    <ProductFrame product={product}>
      <div className="min-w-0 flex-1">
        <p className="mb-2 text-xs font-semibold uppercase text-[#478F00]">{product.category ?? "Alojamiento"}</p>
        <h2 className="text-xl font-semibold leading-snug">{product.title}</h2>
        <div className="mt-2"><Rating product={product} hotel /></div>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted"><MapPin className="h-4 w-4" />{product.location}, Marruecos</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {product.hotelFacilities?.map((facility) => <span key={facility} className="rounded-sm border border-line px-2 py-1 text-xs text-[#454545]">{facility}</span>)}
        </div>
      </div>
      <div className="flex items-end justify-between gap-4 border-t border-line pt-4 md:flex-col md:items-stretch md:justify-center md:border-t-0 md:pt-0">
        <Price product={product} suffix="por noche" />
        <Action product={product} href={`/hoteles/${product.id}`}>Ver detalles</Action>
      </div>
    </ProductFrame>
  );
}

export function HotelCompactCard({ product }: { product: Product }) {
  const hotelHref = `/hoteles/${product.id}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-line bg-white transition-shadow hover:shadow-[0_12px_28px_-20px_rgba(0,0,0,0.42)]">
      <Link href={hotelHref} className="relative block aspect-[4/3] overflow-hidden bg-[#ECEEE9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#58B900]">
        <Image src={product.image} alt={product.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        {product.discount ? <span className="absolute left-2 top-2 bg-[#58B900] px-2 py-1 text-[11px] font-semibold text-white">-{product.discount}%</span> : null}
        {product.featured || product.tags?.includes("featured") ? <span className="absolute bottom-2 left-2 bg-white/95 px-2 py-1 text-[10px] font-semibold uppercase text-[#222]">Selección local</span> : null}
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-muted">{product.category} · {product.stars} estrellas</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold"><Star className="h-3 w-3 fill-[#E0A72E] text-[#E0A72E]" />{product.rating?.toFixed(1)}</span>
        </div>
        <Link href={hotelHref} className="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug text-[#262626] hover:text-[#478F00]">{product.title}</Link>
        <p className="mt-1 text-xs text-muted">{product.location}</p>
        <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-[#555]">
          {product.hotelFacilities?.slice(0, 3).map((facility) => <span key={facility}>{facility}</span>)}
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 border-t border-line pt-3">
          <p className="text-[11px] leading-tight text-muted">Desde <span className="block text-xl font-semibold text-[#478F00]">{product.price} €</span><span>por noche</span></p>
          <Link href={hotelHref} className="inline-flex min-h-9 items-center gap-1 border border-[#58B900] px-2.5 text-[11px] font-semibold uppercase text-[#427D0D] transition-colors hover:bg-[#58B900] hover:text-white">Ver detalles <ArrowRight className="h-3 w-3" /></Link>
        </div>
      </div>
    </article>
  );
}

export function ActivityTileCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full min-h-[420px] flex-col overflow-hidden border border-[#C6CCCA] bg-white transition-shadow hover:shadow-[0_16px_35px_-24px_rgba(0,0,0,0.42)]">
      <Link href={product.href ?? `/booking/checkout?producto=${encodeURIComponent(product.slug)}`} className="relative block h-[164px] shrink-0 overflow-hidden bg-[#E8ECE6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#58B900]">
        <Image src={product.image} alt={product.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
        <span className="absolute left-2 top-2 bg-[#60B900] px-2.5 py-1 text-[11px] font-bold text-white">{product.category ?? product.destination}</span>
        {product.discount ? <span className="absolute right-2 top-2 bg-[#60B900] px-2 py-1 text-[11px] font-bold text-white">-{product.discount}%</span> : null}
      </Link>
      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
        <Link href={product.href ?? `/booking/checkout?producto=${encodeURIComponent(product.slug)}`} className="text-[17px] font-bold leading-tight text-[#293B45] hover:text-[#478F00]">{product.title}</Link>
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 bg-[#FFECD1] px-2 py-1.5 text-[11px] font-semibold text-[#3D4542]">
          <span>{product.destination}{product.category ? ` · ${product.category}` : ""}</span>
          {product.rating ? <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-[#D99A25] text-[#D99A25]" />{product.rating.toFixed(1)} ({product.reviewCount ?? 0})</span> : null}
        </div>
        <p className="mt-2 line-clamp-4 min-h-[64px] text-[12px] leading-[1.35] text-[#505854]">{product.description ?? `${product.location}. Una experiencia local seleccionada para descubrir Marruecos.`}</p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#606A64]">
          {product.duration ? <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3 text-[#65844C]" />{product.duration}</span> : null}
          {product.pickupIncluded ? <span className="inline-flex items-center gap-1"><Check className="h-3 w-3 text-[#65844C]" />Recogida incluida</span> : null}
          {product.availability ? <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3 text-[#65844C]" />{product.availability}</span> : null}
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 border-t border-[#E1E3E1] pt-2.5">
          <p className="flex min-w-0 flex-col text-[11px] leading-tight text-[#758078]">Desde <span className="text-[25px] font-bold leading-none text-[#59AD00]">{product.price.toLocaleString("es-ES")} €</span><span className="mt-0.5 text-[9px]">por persona</span></p>
          <Link href={product.href ?? `/booking/checkout?producto=${encodeURIComponent(product.slug)}`} className="inline-flex min-h-10 shrink-0 items-center gap-1.5 border border-[#60B61A] bg-white px-3 text-[11px] font-bold text-[#438D25] transition-colors hover:bg-[#60B61A] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#478F00]">VER ACTIVIDAD <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
      </div>
    </article>
  );
}

export function HammamTreatmentCard({ product }: { product: Product }) {
  return (
    <article className="group grid overflow-hidden border border-line bg-white transition-shadow hover:shadow-[0_16px_35px_-24px_rgba(0,0,0,0.42)] sm:grid-cols-[0.92fr_1.08fr]">
      <Link href={product.href ?? `/booking/checkout?producto=${encodeURIComponent(product.slug)}`} className="relative block min-h-[220px] overflow-hidden bg-[#ECEEE9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#58B900] sm:min-h-[310px]">
        <Image src={product.image} alt={product.title} fill sizes="(max-width: 640px) 100vw, 420px" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 bg-[#EDF7E4]/95 px-3 py-1.5 text-xs font-semibold text-[#427D0D]"><Sparkles className="h-3.5 w-3.5" />Ritual local</span>
        {product.discount ? <span className="absolute bottom-4 left-4 bg-[#58B900] px-3 py-1.5 text-xs font-semibold text-white">-{product.discount}%</span> : null}
      </Link>
      <div className="flex flex-col justify-center bg-white p-5 sm:p-8">
        <p className="text-[11px] font-semibold uppercase text-[#478F00]">Marrakech · Hammam & Spa</p>
        <h2 className="mt-2 text-xl font-bold leading-tight text-[#293B45]">{product.title}</h2>
        <div className="mt-3"><Rating product={product} /></div>
        <p className="mt-4 max-w-lg text-sm leading-6 text-[#505854]">{product.treatment}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {(product.treatment?.split(/,| y /i).map((item) => item.trim()).filter(Boolean) ?? []).slice(0, 3).map((item) => <span key={item} className="border border-[#E9D8BD] bg-[#FFECD1] px-2.5 py-1.5 text-xs text-[#3D4542]">{item}</span>)}
        </div>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#505854]">
          <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#478F00]" />{product.treatmentDuration}</span>
          <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[#478F00]" />{product.location}</span>
        </div>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-5">
          <p className="text-xs text-muted">Desde <span className="ml-1 text-3xl font-bold text-[#59AD00]">{product.price} €</span><span className="ml-1">/ persona</span></p>
          <Action product={product}>Ver tratamiento</Action>
        </div>
      </div>
    </article>
  );
}

function DinnerCard({ product }: { product: Product }) {
  return (
    <ProductFrame product={product}>
      <div className="min-w-0 flex-1">
        <p className="mb-2 text-xs font-semibold uppercase text-[#478F00]">Cena espectáculo · {product.destination}</p>
        <h2 className="text-lg font-bold leading-snug text-[#293B45]">{product.title}</h2>
        <div className="mt-2"><Rating product={product} /></div>
        <p className="mt-3 flex items-center gap-2 text-sm text-[#505854]"><Utensils className="h-4 w-4 text-[#478F00]" />{product.menuType}</p>
        <p className="mt-2 flex items-center gap-2 text-sm text-[#505854]"><Waves className="h-4 w-4 text-[#478F00]" />{product.showIncluded ? "Espectáculo y música en directo" : "Cena tradicional"}</p>
        <p className="mt-2 flex items-center gap-2 text-sm text-muted"><Clock3 className="h-4 w-4 text-[#478F00]" />{product.time} · {product.availability}</p>
      </div>
      <div className="flex items-end justify-between gap-4 border-t border-line pt-4 md:flex-col md:items-stretch md:justify-center md:border-t-0 md:pt-0">
        <Price product={product} suffix="por persona" />
        <Action product={product}>Ver experiencia</Action>
      </div>
    </ProductFrame>
  );
}

function TransferCard({ product }: { product: Product }) {
  return (
    <ProductFrame product={product}>
      <div className="min-w-0 flex-1">
        <p className="mb-2 text-xs font-semibold uppercase text-[#478F00]">Traslado {product.category?.toLowerCase()}</p>
        <h2 className="text-lg font-bold leading-snug text-[#293B45]">{product.title}</h2>
        <p className="mt-3 flex items-center gap-2 text-sm text-[#505854]"><MapPin className="h-4 w-4 text-[#478F00]" />Aeropuerto <ArrowRight className="h-3 w-3" /> Hotel</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#505854]">
          <span className="flex items-center gap-1.5"><CarFront className="h-4 w-4 text-[#478F00]" />{product.vehicleType}</span>
          <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-[#478F00]" />Hasta {product.passengers} pasajeros</span>
        </div>
        <p className="mt-2 text-sm font-medium text-[#478F00]">{product.availability}</p>
      </div>
      <div className="flex items-end justify-between gap-4 border-t border-line pt-4 md:flex-col md:items-stretch md:justify-center md:border-t-0 md:pt-0">
        <Price product={product} suffix="por vehículo" />
        <Action product={product}>Reservar traslado</Action>
      </div>
    </ProductFrame>
  );
}

function HammamCard({ product }: { product: Product }) {
  return (
    <ProductFrame product={product}>
      <div className="min-w-0 flex-1">
        <p className="mb-2 text-xs font-semibold uppercase text-[#478F00]">Bienestar · Marrakech</p>
        <h2 className="text-lg font-bold leading-snug text-[#293B45]">{product.title}</h2>
        <div className="mt-2"><Rating product={product} /></div>
        <p className="mt-3 flex items-center gap-2 text-sm font-medium text-[#505854]"><Clock3 className="h-4 w-4 text-[#478F00]" />{product.treatmentDuration}</p>
        <p className="mt-2 text-sm text-[#505854]">{product.treatment}</p>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted"><MapPin className="h-4 w-4 text-[#478F00]" />{product.location}</p>
      </div>
      <div className="flex items-end justify-between gap-4 border-t border-line pt-4 md:flex-col md:items-stretch md:justify-center md:border-t-0 md:pt-0">
        <Price product={product} suffix="por persona" />
        <Action product={product}>Ver tratamiento</Action>
      </div>
    </ProductFrame>
  );
}

function PrivateTourCard({ product }: { product: Product }) {
  return (
    <ProductFrame product={product}>
      <div className="min-w-0 flex-1">
        <span className="mb-2 inline-flex w-fit rounded-sm bg-[#EDF7E4] px-2 py-1 text-[11px] font-semibold uppercase text-[#427D0D]">Privado · A medida</span>
        <h2 className="text-lg font-bold leading-snug text-[#293B45]">{product.title}</h2>
        <div className="mt-2"><Rating product={product} /></div>
        <p className="mt-3 flex items-center gap-1.5 text-sm text-[#505854]"><MapPin className="h-4 w-4 text-[#478F00]" />{product.destination} · {product.location}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#505854]">
          <span className="flex items-center gap-1.5"><CarFront className="h-4 w-4 text-[#478F00]" />Recogida incluida</span>
          <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-[#478F00]" />{product.privateGroupSize}</span>
          <span className="flex items-center gap-1.5"><Clock3 className="h-4 w-4 text-[#478F00]" />{product.duration}</span>
        </div>
      </div>
      <div className="flex items-end justify-between gap-4 border-t border-line pt-4 md:flex-col md:items-stretch md:justify-center md:border-t-0 md:pt-0">
        <Price product={product} />
        <Action product={product}>Personalizar</Action>
      </div>
    </ProductFrame>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  switch (product.type) {
    case "hotel": return <HotelCard product={product} />;
    case "dinner": return <DinnerCard product={product} />;
    case "transfer": return <TransferCard product={product} />;
    case "hammam": return <HammamCard product={product} />;
    case "private-tour": return <PrivateTourCard product={product} />;
    case "activity": return <ActivityCard product={product} />;
  }
}