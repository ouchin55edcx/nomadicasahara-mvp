import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, MapPin, Star } from "lucide-react";
import type { CatalogConfig, Product } from "@/content/catalog";
import { getCatalogProducts } from "@/content/catalog";
import CatalogFilters, { CatalogFilterTrigger } from "@/components/catalog/CatalogFilters";
import { HotelCompactCard } from "@/components/catalog/ProductCard";
import CatalogHero from "@/components/catalog/CatalogHero";

type Query = Record<string, string | string[] | undefined>;

function queryValue(query: Query, key: string) {
  const value = query[key];
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function HotelLine({ product }: { product: Product }) {
  return (
    <Link href={`/hoteles/${product.id}`} className="group flex min-h-[76px] items-center justify-between gap-3 border-b border-line py-2.5 last:border-0">
      <div className="min-w-0">
        <p className="line-clamp-1 text-[13px] font-semibold leading-snug group-hover:text-[#478F00]">{product.title}<span className="ml-1 text-[#D79A1B]">{"★".repeat(product.stars ?? 0)}</span></p>
        <p className="mt-1 flex items-center gap-1 text-[11px] text-muted"><MapPin className="h-3 w-3" />{product.location}</p>
        <p className="mt-1 flex items-center gap-1 text-[11px] text-[#478F00]"><Star className="h-3 w-3 fill-current" />{product.rating?.toFixed(1)} · {product.reviewCount} opiniones</p>
      </div>
      <p className="shrink-0 text-right text-[10px] text-muted">Desde <span className="block text-lg font-semibold leading-tight text-[#478F00]">{product.price} €</span></p>
    </Link>
  );
}

function HotelCollection({ title, tag, products, id }: { title: string; tag: string; products: Product[]; id: string }) {
  const collection = products.filter((product) => product.tags?.includes(tag));
  if (!collection.length) return null;
  const [featured, ...others] = collection;
  return (
    <section id={id} className="min-w-0">
      <div className="mb-3 flex items-center justify-between gap-3 border-b border-[#B8B8B8] pb-2">
        <h2 className="text-[17px] font-medium text-[#303632]">{title}</h2>
        <Link href={`?coleccion=${tag}`} className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-[#303632] hover:text-[#478F00]">Ver más <ChevronRight className="h-3.5 w-3.5" /></Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <HotelCompactCard product={featured} />
        <div className="border border-line bg-white px-3 py-2">
          <p className="mb-1 flex items-center gap-1.5 text-sm font-medium text-[#444]"><span className="text-[#627661]">⌂</span> Recomendados</p>
          {others.length ? others.slice(0, 3).map((product) => <HotelLine key={product.id} product={product} />) : <HotelLine product={featured} />}
        </div>
      </div>
    </section>
  );
}

function StaySearch({ config, query }: { config: CatalogConfig; query: Query }) {
  return (
    <form action={config.path} method="get" className="grid gap-px bg-[#222] p-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_auto]">
      <label className="bg-white px-3 py-2">
        <span className="block text-[10px] font-medium text-[#777]">Destino, región o alojamiento</span>
        <span className="mt-1 flex items-center gap-2"><MapPin className="h-4 w-4 text-[#687267]" /><input name="destino" defaultValue={queryValue(query, "destino") || "Marrakech"} aria-label="Destino" className="min-w-0 flex-1 text-sm text-[#222] outline-none" /></span>
      </label>
      <label className="bg-white px-3 py-2">
        <span className="block text-[10px] font-medium text-[#777]">Fecha de entrada</span>
        <input name="fecha" type="date" defaultValue={queryValue(query, "fecha")} aria-label="Fecha de entrada" className="mt-1 w-full text-sm text-[#222] outline-none" />
      </label>
      <label className="bg-white px-3 py-2">
        <span className="block text-[10px] font-medium text-[#777]">Fecha de salida</span>
        <input name="salida" type="date" defaultValue={queryValue(query, "salida")} aria-label="Fecha de salida" className="mt-1 w-full text-sm text-[#222] outline-none" />
      </label>
      <label className="bg-white px-3 py-2">
        <span className="block text-[10px] font-medium text-[#777]">Viajeros y habitaciones</span>
        <select name="personas" defaultValue={queryValue(query, "personas") || "2"} aria-label="Viajeros y habitaciones" className="mt-1 w-full bg-white text-sm text-[#222] outline-none"><option value="1">1 huésped, 1 habitación</option><option value="2">2 huéspedes, 1 habitación</option><option value="3">3 huéspedes, 1 habitación</option><option value="4">4 huéspedes, 2 habitaciones</option></select>
      </label>
      <button type="submit" className="min-h-12 bg-[#58B900] px-6 text-sm font-semibold uppercase text-white transition-colors hover:bg-[#478F00]">Buscar</button>
    </form>
  );
}

function HotelSearchResults({ products }: { products: Product[] }) {
  if (!products.length) return <div className="border border-line bg-white px-6 py-12 text-center"><h2 className="text-xl font-semibold">No encontramos alojamientos</h2><p className="mt-2 text-sm text-muted">Prueba a ampliar el precio o cambiar los servicios seleccionados.</p><Link href="/hoteles-marrakech" className="mt-4 inline-block text-sm font-semibold text-[#478F00]">Ver todos los hoteles</Link></div>;
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <HotelCompactCard key={product.id} product={product} />)}</div>;
}

export default function HotelCatalogPage({ config, query }: { config: CatalogConfig; query: Query }) {
  const result = getCatalogProducts(config, query);
  const hasSearch = Object.entries(query).some(([key, value]) => key !== "page" && key !== "orden" && Boolean(value));
  const sortValue = queryValue(query, "orden") || "recomendados";
  const nonSortParams = Object.entries(query).filter(([key]) => key !== "orden" && key !== "page");
  const collections = [
    { title: "Escapadas urbanas", tag: "urban", id: "urbanas" },
    { title: "Hoteles con piscina", tag: "pool", id: "piscina" },
    { title: "Riads de la medina", tag: "medina", id: "riads" },
    { title: "Hoteles con spa", tag: "spa", id: "spa" },
  ];
  const discovery = [
    { title: "Riads con encanto", detail: "Patios tranquilos en el corazón de la medina.", tag: "medina", image: "/images/tour-fez.jpg" },
    { title: "Piscinas y jardines", detail: "Un descanso fresco después de recorrer la ciudad.", tag: "pool", image: "/images/tour-sahara-lux.jpg" },
    { title: "Bienestar y hammam", detail: "Estancias con spa y rituales tradicionales.", tag: "spa", image: "/images/tour-gastronomia.jpg" },
    { title: "Hoteles boutique", detail: "Diseño local y hospitalidad a escala humana.", tag: "boutique", image: "/images/tour-ciudades.jpg" },
  ];

  return (
    <main className="min-h-screen bg-white text-[#252925]">
      <div className="mx-auto max-w-[1200px] px-3 pb-14 pt-4 sm:px-5 lg:px-6">
        <nav aria-label="Migas de pan" className="mb-3 flex items-center gap-1.5 text-[11px] text-muted"><Link href="/" className="hover:text-[#478F00]">Inicio</Link><ChevronRight className="h-3 w-3" /><span>Hoteles</span></nav>

        <CatalogHero
          className="mb-12"
          compact
          image="/images/tour-ciudades.jpg"
          imageAlt="Arquitectura y alojamientos de Marrakech"
          eyebrow="Nomadica Sahara / Marrakech"
          title="Hoteles en Marrakech"
          description={config.description}
          actionHref="#alojamientos"
          actionLabel="Ver alojamientos"
        >
          <StaySearch config={config} query={query} />
        </CatalogHero>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <CatalogFilterTrigger config={config} query={query} />
            <p className="text-sm text-muted">{result.total} alojamientos seleccionados</p>
            <details className="relative hidden lg:block">
              <summary className="cursor-pointer list-none border border-line px-3 py-2 text-sm font-medium hover:border-[#58B900]">Filtrar hoteles</summary>
              <div className="absolute left-0 top-11 z-20 w-[300px] shadow-xl"><CatalogFilters config={config} query={query} /></div>
            </details>
          </div>
          <form action={config.path} method="get" className="flex items-center gap-2">
            {nonSortParams.map(([key, value]) => Array.isArray(value) ? value.map((item, index) => <input key={`${key}-${index}`} type="hidden" name={key} value={item} />) : value ? <input key={key} type="hidden" name={key} value={value} /> : null)}
            <label htmlFor="hotel-sort" className="text-xs text-muted sm:text-sm">Ordenar</label>
            <select id="hotel-sort" name="orden" defaultValue={sortValue} className="h-10 max-w-[170px] border border-line bg-white px-2 text-xs sm:text-sm"><option value="recomendados">Recomendados</option><option value="popularidad">Más populares</option><option value="precio-asc">Precio más bajo</option><option value="rating">Mejor valorados</option></select>
            <button type="submit" className="h-10 border border-line px-3 text-xs font-medium hover:border-[#58B900]">Aplicar</button>
          </form>
        </div>

        {hasSearch ? <section aria-label="Resultados de hoteles" className="mb-12"><HotelSearchResults products={result.products} /></section> : <>
          <div className="grid gap-x-6 gap-y-10 lg:grid-cols-2">
            {collections.map((collection) => <HotelCollection key={collection.tag} {...collection} products={result.products} />)}
          </div>

          <section className="mt-12 border-y border-line py-7">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div><p className="text-[11px] font-semibold uppercase text-[#478F00]">Encuentra tu estancia</p><h2 className="mt-1 text-xl font-medium">Una Marrakech a tu manera</h2></div>
              <Link href="#alojamientos" className="hidden items-center gap-1 text-xs hover:text-[#478F00] sm:flex">Más alojamientos <ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {discovery.map((item) => <Link key={item.tag} href={`?coleccion=${item.tag}`} className="group min-w-0 border border-line bg-white transition-colors hover:border-[#58B900]">
                <div className="relative aspect-[16/10] overflow-hidden"><Image src={item.image} alt="" fill sizes="(max-width: 640px) 50vw, 280px" className="object-cover transition-transform duration-500 group-hover:scale-105" /></div>
                <div className="p-3"><h3 className="text-sm font-semibold">{item.title}</h3><p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{item.detail}</p></div>
              </Link>)}
            </div>
          </section>

          <section id="alojamientos" className="mt-9 grid gap-8 border-b border-line pb-9 md:grid-cols-[190px_1fr]">
            <h2 className="text-lg font-medium">Más alojamientos</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs sm:grid-cols-3">
              {["Hoteles en la Medina", "Riads con terraza", "Hoteles en Hivernage", "Estancias con piscina", "Hoteles con spa", "Alojamientos boutique", "Hoteles de cinco estrellas", "Estancias para familias", "Hoteles cerca de la Koutoubia"].map((label) => <Link key={label} href="#urbanas" className="hover:text-[#478F00]">{label}</Link>)}
            </div>
          </section>

          <section className="mt-8 grid gap-6 border border-line p-5 sm:grid-cols-[190px_1fr] sm:p-6">
            <h2 className="text-sm font-semibold uppercase">Hoteles en Marrakech</h2>
            <div className="space-y-3 text-xs leading-relaxed text-[#5B5F5A]">
              <p>Descubre Marrakech desde un riad tradicional en la medina, un hotel boutique entre sus patios o una estancia tranquila con piscina y spa. Cada barrio ofrece una forma distinta de vivir la ciudad, desde los zocos históricos hasta los jardines y cafés de Hivernage.</p>
              <p>Compara ubicación, categoría y servicios antes de reservar. Los precios se muestran por habitación y noche, y las valoraciones reúnen opiniones recientes de viajeros. Para una estancia más personal, elige un riad con desayuno, terraza y atención local.</p>
              <p>Explora la ciudad a pie, visita la plaza Jemaa el-Fna al atardecer y reserva tiempo para descansar entre excursiones. Nuestro catálogo reúne alojamientos seleccionados para escapadas culturales, viajes en pareja y vacaciones familiares.</p>
            </div>
          </section>
        </>}
      </div>
    </main>
  );
}