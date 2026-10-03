import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, CalendarDays, Check, ChevronRight, Clock3, Compass, MapPin, Search, ShieldCheck, Sparkles, Users } from "lucide-react";
import type { CatalogConfig, CatalogKind, Product } from "@/content/catalog";
import { getCatalogProducts } from "@/content/catalog";
import ProductCard, { ActivityTileCard, HammamTreatmentCard } from "@/components/catalog/ProductCard";
import CatalogHero from "@/components/catalog/CatalogHero";

type Query = Record<string, string | string[] | undefined>;

const heroImages: Record<string, string> = {
  "/excursiones-marruecos": "/images/hero.jpg",
  "/excursiones-desierto-marruecos": "/images/hero.jpg",
  "/excursion-desierto-agafay": "/images/tour-atlas.jpg",
  "/excursion-desierto-zagora": "/images/tour-kasbahs.jpg",
  "/excursion-desierto-merzouga": "/images/tour-merzouga.jpg",
  "/excursiones-marrakech": "/images/tour-ciudades.jpg",
  "/excursiones-saidia": "/images/tour-costa.jpg",
  "/excursiones-privadas-marruecos": "/images/tour-sahara-lux.jpg",
  "/traslados-aeropuerto-marrakech": "/images/tour-ciudades.jpg",
  "/cena-espectaculo-marrakech": "/images/tour-gastronomia.jpg",
  "/hammam-spa-marrakech": "/images/hammam-wellness.jpg",
};

const destinationPaths: Record<string, string> = {
  Agafay: "/excursion-desierto-agafay",
  Zagora: "/excursion-desierto-zagora",
  Merzouga: "/excursion-desierto-merzouga",
  Marrakech: "/excursiones-marrakech",
  Saidia: "/excursiones-saidia",
};

function valueFor(query: Query, key: string) {
  const value = query[key];
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function SearchField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block min-w-0 bg-white px-3 py-2.5"><span className="mb-1 block text-[10px] font-semibold uppercase text-[#757A72]">{label}</span>{children}</label>;
}

function SearchControl({ children, name, defaultValue, ariaLabel }: { children: React.ReactNode; name: string; defaultValue?: string; ariaLabel: string }) {
  return <select name={name} defaultValue={defaultValue} aria-label={ariaLabel} className="h-7 w-full min-w-0 bg-transparent text-sm text-[#252925] outline-none focus-visible:ring-2 focus-visible:ring-[#58B900]">{children}</select>;
}

function CatalogSearch({ config, query, products }: { config: CatalogConfig; query: Query; products: Product[] }) {
  const destinations = config.destinations ?? Array.from(new Set(products.map((product) => product.destination)));
  const kind: CatalogKind = config.kind;
  const dateField = <SearchField label="Fecha"><input name="fecha" type="date" defaultValue={valueFor(query, "fecha")} aria-label="Fecha" className="h-7 w-full bg-transparent text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#58B900]" /></SearchField>;
  const peopleField = <SearchField label={kind === "private-tour" ? "Tamaño del grupo" : "Viajeros"}><SearchControl name="personas" defaultValue={valueFor(query, "personas") || "2"} ariaLabel="Número de viajeros"><option value="1">1 persona</option><option value="2">2 personas</option><option value="4">3-4 personas</option><option value="6">5-6 personas</option></SearchControl></SearchField>;
  const destinationField = <SearchField label="Destino"><SearchControl name="destino" defaultValue={valueFor(query, "destino")} ariaLabel="Destino"><option value="">Todos los destinos</option>{destinations.map((destination) => <option key={destination} value={destination}>{destination}</option>)}</SearchControl></SearchField>;
  const searchFields = () => {
    switch (kind) {
      case "hotel":
        return <>{destinationField}{dateField}{peopleField}</>;
      case "activity":
      case "mixed":
        return <>{destinationField}{dateField}<SearchField label="Duración"><SearchControl name="duracion" defaultValue={valueFor(query, "duracion")} ariaLabel="Duración"><option value="">Cualquier duración</option><option value="0-4">Hasta 4 horas</option><option value="4-8">4-8 horas</option><option value="8-24">Día completo</option><option value="24-1000">Varios días</option></SearchControl></SearchField>{peopleField}</>;
      case "private-tour":
        return <>{destinationField}{dateField}{peopleField}</>;
      case "transfer":
        return <><SearchField label="Punto de recogida"><input name="origen" defaultValue={valueFor(query, "origen") || "Aeropuerto de Marrakech"} aria-label="Punto de recogida" className="h-7 w-full bg-transparent text-sm outline-none" /></SearchField><SearchField label="Destino"><input name="destino" defaultValue={valueFor(query, "destino") || "Marrakech"} aria-label="Destino" className="h-7 w-full bg-transparent text-sm outline-none" /></SearchField>{dateField}<SearchField label="Pasajeros"><SearchControl name="pasajeros" defaultValue={valueFor(query, "pasajeros") || "2"} ariaLabel="Pasajeros"><option value="2">Hasta 2</option><option value="4">Hasta 4</option><option value="8">Hasta 8</option></SearchControl></SearchField></>;
      case "dinner":
        return <>{dateField}<SearchField label="Hora"><SearchControl name="hora" defaultValue={valueFor(query, "hora")} ariaLabel="Hora"><option value="">Cualquier hora</option><option value="19">Desde las 19:00</option><option value="20">Desde las 20:00</option></SearchControl></SearchField><SearchField label="Menú"><SearchControl name="menu" defaultValue={valueFor(query, "menu")} ariaLabel="Tipo de menú"><option value="">Cualquier menú</option><option value="marroquí">Marroquí</option><option value="tradicional">Tradicional</option></SearchControl></SearchField>{peopleField}</>;
      case "hammam":
        return <><SearchField label="Tratamiento"><SearchControl name="tratamiento" defaultValue={valueFor(query, "tratamiento")} ariaLabel="Tratamiento"><option value="">Todos los rituales</option><option value="hammam">Hammam</option><option value="masaje">Masaje</option><option value="argán">Argán</option></SearchControl></SearchField>{dateField}<SearchField label="Duración"><SearchControl name="duracion" defaultValue={valueFor(query, "duracion")} ariaLabel="Duración del tratamiento"><option value="">Cualquier duración</option><option value="60">60 minutos</option><option value="90">90 minutos o más</option></SearchControl></SearchField>{peopleField}</>;
      default:
        return <>{destinationField}{dateField}{peopleField}</>;
    }
  };

  const submitClass = kind === "hammam" ? "bg-[#59765C] hover:bg-[#405E47]" : kind === "dinner" ? "bg-[#A65F3B] hover:bg-[#87482D]" : kind === "transfer" ? "bg-[#286C72] hover:bg-[#20565B]" : "bg-[#58B900] hover:bg-[#478F00]";
  return (
    <form action={config.path} method="get" className="grid gap-px bg-[#252925] p-1 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
      {searchFields()}
      <button type="submit" className={`inline-flex min-h-12 items-center justify-center gap-2 px-5 text-sm font-semibold uppercase text-white transition-colors ${submitClass}`}><Search className="h-4 w-4" />Buscar</button>
    </form>
  );
}

function TrustNotes({ kind }: { kind: CatalogKind }) {
  const notes = kind === "hammam"
    ? ["Rituales tradicionales", "Anfitriones de bienestar local", "Reserva sencilla"]
    : ["Experiencias seleccionadas", "Anfitriones locales", "Atención en español"];
  return <section aria-label="Ventajas de reservar" className="my-5 overflow-hidden border border-[#C9CECB] bg-white">
    <div className="grid sm:grid-cols-2 md:grid-cols-[1.1fr_repeat(3,minmax(0,1fr))]">
      <div className="relative flex min-h-[76px] flex-col justify-center border-b border-[#E1E4E2] px-5 py-3 sm:col-span-2 md:col-span-1 md:border-b-0 md:border-r md:border-r-[#60B900] md:px-7">
        <p className="text-xs font-semibold uppercase text-[#293B45]">Otras ventajas</p>
        <p className="font-serif text-lg italic leading-tight text-[#58A900]">¡Aprovéchalas ya!</p>
        <span aria-hidden="true" className="absolute right-0 top-0 hidden h-full w-5 translate-x-1/2 bg-white md:block [clip-path:polygon(0_0,100%_50%,0_100%,0_96%,88%_50%,0_4%)]" />
      </div>
      {notes.map((note, index) => <div key={note} className="flex min-h-[70px] items-center gap-3 border-b border-[#E1E4E2] px-5 py-3 last:border-b-0 sm:odd:border-r sm:odd:border-[#E1E4E2] md:border-b-0 md:border-r md:border-[#E1E4E2] md:px-4 md:last:border-r-0">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[#58A900]">
          {index === 0 ? <Compass className="h-7 w-7 stroke-[1.5]" /> : index === 1 ? <Users className="h-7 w-7 stroke-[1.5]" /> : <ShieldCheck className="h-7 w-7 stroke-[1.5]" />}
        </span>
        <span className="text-sm font-medium leading-snug text-[#37434A]">{note}</span>
      </div>)}
    </div>
  </section>;
}

function DestinationSection({ config, products }: { config: CatalogConfig; products: Product[] }) {
  if (config.kind !== "activity" && config.kind !== "mixed") return null;
  const grouped = Array.from(new Map(products.map((product) => [product.destination, product])).values());
  const destinations = grouped.filter((product) => destinationPaths[product.destination]).slice(0, 4);
  if (destinations.length < 2) return null;
  return <section className="mt-12">
    <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase text-[#668152]">Rutas para inspirarte</p><h2 className="mt-1 text-2xl font-semibold text-[#273028] sm:text-3xl">Explora por destino</h2></div><ArrowDownRight className="hidden h-6 w-6 text-[#79906C] sm:block" /></div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {destinations.map((product) => <Link key={product.destination} href={destinationPaths[product.destination]} className="group relative min-h-[180px] overflow-hidden bg-[#29342A] sm:min-h-[220px]">
        <Image src={product.image} alt={product.destination} fill sizes="(max-width: 640px) 50vw, 280px" className="object-cover opacity-85 transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white"><span className="min-w-0"><span className="block text-[11px] uppercase text-white/75">Marruecos</span><span className="mt-1 block text-lg font-semibold">{product.destination}</span><span className="mt-1 block line-clamp-1 text-xs text-white/85">{product.title}</span></span><ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" /></span>
      </Link>)}
    </div>
  </section>;
}

function SpaRitualSection() {
  return <section className="mt-12 grid gap-5 border-y border-[#DCE4D9] py-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
    <div><p className="text-xs font-semibold uppercase text-[#71866E]">Bienestar en Marrakech</p><h2 className="mt-2 font-serif text-3xl font-medium leading-tight text-[#27362D]">Un ritual antiguo, un momento solo para ti.</h2><p className="mt-3 max-w-md text-sm leading-6 text-[#5F6A60]">Elige entre hammam tradicional, exfoliación con jabón negro y masaje con aceite de argán. Nuestros tratamientos priorizan el cuidado pausado y la hospitalidad local.</p><Link href="#experiencias" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#526E55] hover:text-[#344D39]">Ver rituales <ArrowRight className="h-4 w-4" /></Link></div>
    <div className="relative min-h-[220px] overflow-hidden sm:min-h-[280px]"><Image src="/images/tour-ciudades.jpg" alt="Arquitectura tradicional de Marrakech al atardecer" fill sizes="(max-width: 768px) 100vw, 640px" className="object-cover" /><span className="absolute bottom-0 left-0 bg-[#F3F5EF] px-4 py-3 text-xs text-[#526454]">Hammam · Exfoliación · Masaje</span></div>
  </section>;
}

function TravelBlogSection() {
  const articles = [
    {
      image: "/images/banner-kasbahs.jpg",
      imageAlt: "Kasbahs de adobe en el sur de Marruecos",
      title: "Marruecos y la ruta de las kasbahs",
      description: "Adéntrate en el Sahara entre fortalezas de adobe, oasis y antiguos caminos caravaneros.",
    },
    {
      image: "/images/tour-costa.jpg",
      imageAlt: "Costa atlántica de Marruecos",
      title: "Agadir, el secreto de la costa atlántica",
      description: "Playas abiertas, clima suave y paisajes del sur se encuentran en esta ciudad junto al mar.",
    },
  ];

  return <section className="mt-12 border border-[#D8DCDA] bg-[#F4F5F3] p-4 sm:p-6">
    <h2 className="mb-4 text-lg font-medium text-[#34434C] sm:text-xl">Marruecos: ciudades imperiales, playas, desierto y kasbahs</h2>
    <div className="grid gap-3 md:grid-cols-2">
      {articles.map((article) => <article key={article.title} className="overflow-hidden border border-[#D4D8D6] bg-white">
        <div className="relative aspect-[2.7/1] min-h-[145px] overflow-hidden bg-[#E7E9E7]">
          <Image src={article.image} alt={article.imageAlt} fill sizes="(max-width: 768px) 100vw, 560px" className="object-cover" />
          <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
          <h3 className="absolute inset-x-3 bottom-3 text-sm font-semibold uppercase leading-tight tracking-[0.12em] text-white sm:text-base">{article.title}</h3>
        </div>
        <p className="min-h-10 px-3 py-2 text-xs leading-relaxed text-[#606966] sm:text-[13px]">{article.description}</p>
      </article>)}
    </div>
  </section>;
}

function LandingCards({ kind, products }: { kind: CatalogKind; products: Product[] }) {
  if (kind === "hammam") return <div className="space-y-5">{products.map((product) => <HammamTreatmentCard key={product.id} product={product} />)}</div>;
  if (kind === "activity" || kind === "mixed") {
    return <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{products.map((product) => product.type === "activity" ? <ActivityTileCard key={product.id} product={product} /> : <div key={product.id} className="sm:col-span-2 xl:col-span-4"><ProductCard product={product} /></div>)}</div>;
  }
  return <div className="space-y-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}

export default function CatalogLandingPage({ config, query }: { config: CatalogConfig; query: Query }) {
  const result = getCatalogProducts(config, query);
  const hammam = config.kind === "hammam";
  const image = heroImages[config.path] ?? "/images/hero.jpg";
  const pageLink = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || key === "page") return;
      if (Array.isArray(value)) value.forEach((item) => params.append(key, item));
      else params.set(key, value);
    });
    if (page > 1) params.set("page", String(page));
    const suffix = params.toString();
    return `${config.path}${suffix ? `?${suffix}` : ""}`;
  };

  return (
    <main className="min-h-screen bg-white text-[#252925]">
      <div className="mx-auto max-w-[1200px] px-3 pb-16 pt-4 sm:px-5 lg:px-6">
        <nav aria-label="Migas de pan" className="mb-3 flex items-center gap-1.5 text-[11px] text-muted"><Link href="/" className="hover:text-[#478F00]">Inicio</Link><ChevronRight className="h-3 w-3" /><span>{config.title}</span></nav>

        <CatalogHero
          image={image}
          imageAlt={config.title}
          eyebrow={`Nomadica Sahara / ${hammam ? "Rituales locales" : "Marruecos auténtico"}`}
          title={config.title}
          description={config.description}
          actionHref="#experiencias"
          actionLabel="Explorar experiencias"
          badge={hammam ? <span className="inline-flex items-center gap-2 bg-[#F3F5EF]/95 px-3 py-2 text-xs font-semibold text-[#526A53]"><Sparkles className="h-4 w-4" />Marrakech · Bienestar</span> : undefined}
        >
          <CatalogSearch config={config} query={query} products={result.products} />
        </CatalogHero>

        <TrustNotes kind={config.kind} />

        {hammam ? <SpaRitualSection /> : <DestinationSection config={config} products={result.products} />}

        <section id="experiencias" className="mt-8 scroll-mt-6">
          {result.products.length ? <LandingCards kind={config.kind} products={result.products} /> : <div className="border border-dashed border-[#CFD8C9] bg-white px-6 py-12 text-center"><Search className="mx-auto h-8 w-8 text-[#78936C]" /><h3 className="mt-3 text-lg font-semibold">No encontramos opciones</h3><p className="mt-1 text-sm text-muted">Ajusta la búsqueda o prueba con otras fechas y preferencias.</p><Link href={config.path} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#4D7043]">Ver catálogo completo <ArrowRight className="h-4 w-4" /></Link></div>}
          {result.pageCount > 1 ? <nav aria-label="Paginación de experiencias" className="mt-7 flex items-center justify-center gap-2">
            {result.page > 1 ? <Link href={pageLink(result.page - 1)} className="border border-line bg-white px-4 py-2 text-sm hover:border-[#58B900]">Anterior</Link> : null}
            <span aria-current="page" className="bg-[#26372D] px-4 py-2 text-sm font-semibold text-white">{result.page} / {result.pageCount}</span>
            {result.page < result.pageCount ? <Link href={pageLink(result.page + 1)} className="border border-line bg-white px-4 py-2 text-sm hover:border-[#58B900]">Siguiente</Link> : null}
          </nav> : null}
        </section>

        {config.kind === "activity" || config.kind === "mixed" ? <TravelBlogSection /> : null}

        <section className="mt-12 flex flex-col justify-between gap-4 border-y border-line py-6 sm:flex-row sm:items-center">
          <div><p className="text-xs font-semibold uppercase text-[#71866E]">Sigue explorando</p><h2 className="mt-1 text-xl font-semibold">Cada rincón de Marruecos guarda otra historia.</h2></div>
          <Link href="/excursiones-marruecos" className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#26372D] px-5 text-sm font-semibold text-white hover:bg-[#405E47]">Ver todas las excursiones <ArrowRight className="h-4 w-4" /></Link>
        </section>
      </div>
    </main>
  );
}