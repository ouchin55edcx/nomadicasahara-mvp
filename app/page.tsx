'use client';
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { CarFront, ChevronRight, Compass, Hotel, Info, MapPin, Sparkles, Utensils, Waves } from "lucide-react";
import Header from "@/components/Header";
import MainNav from "@/components/MainNav";
import Footer from "@/components/Footer";

/* ============================================================
   VIAJES EL CORTE INGLÉS — Landing page clone (single file)
   Drop into a Next.js project as /pages/index.tsx (or pages.tsx)
   No external CSS needed — styles are embedded below.
   Images are Unsplash placeholders: swap the URLs for your own.
   ============================================================ */

const IMG = {
  hero: "/images/hero.jpg",
  puente: "/images/tour-atlas.jpg",
  familias: "/images/tour-fez.jpg",
  circuitos: "/images/tour-kasbahs.jpg",
  jovenes: "/images/hammam-wellness.jpg",
  parques: "/images/tour-merzouga.jpg",
  grandes: "/images/tour-sahara-lux.jpg",
  amalfi: "/images/tour-atlas.jpg",
  canaria: "/images/tour-kasbahs.jpg",
  portosanto: "/images/tour-merzouga.jpg",
  egipto: "/images/tour-gastronomia.jpg",
  tenerife: "/images/tour-atlas.jpg",
  grancanaria: "/images/tour-costa.jpg",
  roma: "/images/tour-ciudades.jpg",
  washington: "/images/tour-ciudades.jpg",
  suiza: "/images/tour-atlas.jpg",
  crucero: "/images/banner-essaouira.jpg",
  costasol: "/images/tour-costa.jpg",
costaluz: "/images/banner-essaouira.jpg",
  lisboa: "/images/tour-ciudades.jpg",
};

const heroSlides = [
  {
    image: IMG.hero,
    category: "MARRUECOS",
    title: "TIERRA DE CONTRASTES",
    subtitle: "Del desierto a la costa, descubre Marruecos a tu ritmo",
    badges: [["Guías locales", "en cada ruta"], ["Tours privados", "a tu medida"], ["Desde 29€", "por persona"]],
  },
  {
    image: "/images/hero.jpg",
    category: "EXCURSIONES",
    title: "DESCUBRE MARRUECOS",
    subtitle: "Experiencias auténticas para descubrir el país",
    badges: [["Experiencias", "seleccionadas"], ["Atención", "en español"], ["Desde 29€", "por persona"]],
  },
  {
    image: "/images/tour-merzouga.jpg",
    category: "DESIERTO",
    title: "NOCHES BAJO LAS ESTRELLAS",
    subtitle: "Dunas, kasbahs y hospitalidad bereber",
    badges: [["Merzouga", "Erg Chebbi"], ["Campamentos", "con encanto"], ["Rutas guiadas", "desde Marrakech"]],
  },
  {
    image: "/images/tour-atlas.jpg",
    category: "AGAFAY Y ATLAS",
    title: "AVENTURAS ENTRE MONTAÑAS",
    subtitle: "Salidas para descubrir paisajes y pueblos locales",
    badges: [["Agafay", "a un paso"], ["Alto Atlas", "con guía"], ["Recogida", "incluida"]],
  },
  {
    image: "/images/tour-kasbahs.jpg",
    category: "ZAGORA",
    title: "RUTA DE LAS KASBAHS",
    subtitle: "Cruza el Atlas y sigue el valle del Draa",
    badges: [["Paisajes únicos", "cada día"], ["Grupos pequeños", "más cerca"], ["Desde Marrakech", "ida y vuelta"]],
  },
  {
    image: "/images/tour-ciudades.jpg",
    category: "MARRAKECH",
    title: "UNA CIUDAD PARA SENTIR",
    subtitle: "Medina, palacios, jardines y zocos con guía local",
    badges: [["Visitas guiadas", "en español"], ["Rutas urbanas", "a pie"], ["Salidas diarias", "todo el año"]],
  },
  {
    image: "/images/tour-costa.jpg",
    category: "COSTA Y SAIDIA",
    title: "MARRUECOS JUNTO AL MAR",
    subtitle: "Descubre la costa mediterránea y el Atlántico",
    badges: [["Saidia", "Mediterráneo"], ["Essaouira", "Atlántico"], ["Escapadas", "con calma"]],
  },
  {
    image: "/images/tour-sahara-lux.jpg",
    category: "VIAJES PRIVADOS",
    title: "TU VIAJE, A TU MANERA",
    subtitle: "Recorridos privados diseñados alrededor de ti",
    badges: [["Vehículo privado", "incluido"], ["Paradas a medida", "sin prisa"], ["Grupos privados", "1-6 personas"]],
  },
  {
    image: "/images/banner-essaouira.jpg",
    category: "TRASLADOS",
    title: "LLEGA Y EMPIEZA A DISFRUTAR",
    subtitle: "Conexiones reservadas entre aeropuerto y alojamiento",
    badges: [["Marrakech", "puerta a puerta"], ["Privado o compartido", "a elegir"], ["Disponible", "24/7"]],
  },
  {
    image: "/images/tour-gastronomia.jpg",
    category: "CENA Y ESPECTÁCULO",
    title: "UNA NOCHE CON SABOR LOCAL",
    subtitle: "Cocina marroquí, música y tradición",
    badges: [["Menú marroquí", "tradicional"], ["Música en directo", "incluida"], ["Veladas", "cada tarde"]],
  },
  {
    image: "/images/tour-fez.jpg",
    category: "HOTELES Y RIADS",
    title: "DUERME EN EL CORAZÓN DE LA MEDINA",
    subtitle: "Riads con encanto y hoteles seleccionados",
    badges: [["Riads", "con patio"], ["Piscina y spa", "disponibles"], ["Desde 75€", "por noche"]],
  },
  {
    image: "/images/hammam-wellness.jpg",
    category: "HAMMAM Y SPA",
    title: "REGÁLATE UNA PAUSA",
    subtitle: "Hammam tradicional y rituales de bienestar en Marrakech",
    badges: [["Hammam", "tradicional"], ["Masaje", "con argán"], ["Desde 35€", "por persona"]],
  },
];

const eligeTuViaje = [
  { img: IMG.puente, label: "AGAFAY", action: "Aventura" },
  { img: IMG.parques, label: "MERZOUGA", action: "Descubre" },
  { img: IMG.circuitos, label: "RUTA DE KASBAHS", action: "Explora" },
  { img: IMG.familias, label: "MARRAKECH", action: "Conócela" },
  { img: IMG.grancanaria, label: "COSTA ATLÁNTICA", action: "Escápate" },
  { img: IMG.jovenes, label: "HAMMAM Y SPA", action: "Relájate" },
];

const ultimaHora = [
  { img: IMG.amalfi, tag: "AGAFAY · AVENTURA", title: "Agafay: quad y puesta de sol", sub: "Recogida · 4-5 horas", price: "49,99€", icon: Compass },
  { img: IMG.canaria, tag: "DESIERTO DEL DRAA", title: "Zagora: kasbahs y noche en el desierto", sub: "2 días / 1 noche", price: "189€", icon: Compass },
  { img: IMG.portosanto, tag: "ERG CHEBBI", title: "Merzouga: dromedario y campamento", sub: "3 días / 2 noches", price: "289€", icon: Hotel },
  { img: IMG.egipto, tag: "CENA Y ESPECTÁCULO", title: "Cena marroquí bajo las estrellas", sub: "Menú y música en directo", price: "35€", icon: Utensils },
];

const puenteOctubre = [
  { img: IMG.tenerife, title: "Agafay: quad y puesta de sol", sub: "Aventura y recogida desde Marrakech", description: "Explora el desierto de piedra en quad y termina la tarde con una puesta de sol sobre el paisaje de Agafay.", price: "49,99€", duration: "4-5 horas" },
  { img: IMG.grancanaria, title: "Saidia y la costa mediterránea", sub: "Mar, paseo en barco y sabores locales", description: "Disfruta de la costa mediterránea marroquí con tiempo para navegar, descansar y descubrir Saidia.", price: "65€", duration: "6 horas" },
];

const vuelosFinde = [
  { city: "Agafay", price: "49,99€", duration: "4-5 horas" },
  { city: "Zagora", price: "189€", duration: "2 días / 1 noche" },
  { city: "Merzouga", price: "289€", duration: "3 días / 2 noches" },
  { city: "Marrakech", price: "29€", duration: "3 horas" },
];

const vuelosDirectos = [
  { city: "Madrid - Oporto", price: "39€", duration: "Ida y vuelta" },
  { city: "Madrid - San Juan", price: "651€", duration: "Ida y vuelta" },
  { city: "Madrid - Tokio", price: "630€", duration: "Ida y vuelta" },
  { city: "Madrid - Doha", price: "526€", duration: "Ida y vuelta" },
];

const guiasViaje = [
  { img: IMG.costasol, title: "Costa del Sol", sub: "El eterno verano" },
  { img: IMG.costaluz, title: "Costa de la Luz", sub: "Costas de Cádiz y Huelva" },
  { img: IMG.lisboa, title: "Lisboa", sub: "Un tranvía de saudade" },
];

const searchTabs = [
  { label: "Excursiones", path: "/excursiones-marruecos", icon: Compass },
  { label: "Desierto", path: "/excursiones-desierto-marruecos", icon: Waves },
  { label: "Hoteles", path: "/hoteles-marrakech", icon: Hotel },
  { label: "Viajes privados", path: "/excursiones-privadas-marruecos", icon: Compass },
  { label: "Traslados", path: "/traslados-aeropuerto-marrakech", icon: CarFront },
  { label: "Cena espectáculo", path: "/cena-espectaculo-marrakech", icon: Utensils },
  { label: "Hammam y spa", path: "/hammam-spa-marrakech", icon: Sparkles },
];

function MarketplaceProductCard({
  image,
  tag,
  title,
  meta,
  description,
  price,
  duration,
  actionLabel = "RESERVA YA",
}: {
  image: string;
  tag?: string;
  title: string;
  meta: string;
  description: string;
  price: string;
  duration: string;
  actionLabel?: string;
}) {
  return (
    <article className="marketplace-product">
      <div className="marketplace-product-image" style={{ backgroundImage: `url(${image})` }}>
        {tag ? <span className="marketplace-product-tag">{tag}</span> : null}
      </div>
      <div className="marketplace-product-body">
        <h4>{title}</h4>
        <p className="marketplace-product-meta">{meta}</p>
        <p className="marketplace-product-description">{description}</p>
        <div className="marketplace-product-footer">
          <span className="marketplace-product-price"><small>desde</small><b>{price}</b><small>{duration}</small></span>
          <button type="button" className="btn-reservar">{actionLabel} <span aria-hidden="true">›</span></button>
        </div>
      </div>
    </article>
  );
}

function SearchField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="search-field"><span>{label}</span>{children}</label>;
}

function SearchSelect({ name, children }: { name: string; children: React.ReactNode }) {
  return <select className="search-control" name={name}>{children}</select>;
}

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const activeHero = heroSlides[activeHeroIndex];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(() => {
      setActiveHeroIndex((current) => (current + 1) % heroSlides.length);
    }, 6500);
    return () => window.clearInterval(interval);
  }, []);

  const moveHero = (offset: number) => {
    setActiveHeroIndex((current) => (current + offset + heroSlides.length) % heroSlides.length);
  };

  const renderSearchFields = () => {
    switch (activeTab) {
      case 1:
        return <>
          <SearchField label="Destino"><SearchSelect name="destino"><option value="">Cualquier zona del desierto</option><option>Agafay</option><option>Zagora</option><option>Merzouga</option></SearchSelect></SearchField>
          <SearchField label="Fecha"><input className="search-control" type="date" name="fecha" /></SearchField>
          <SearchField label="Duración"><SearchSelect name="duracion"><option value="">Cualquier duración</option><option value="0-4">Hasta 4 horas</option><option value="4-8">4-8 horas</option><option value="24-1000">Varios días</option></SearchSelect></SearchField>
        </>;
      case 2:
        return <>
          <SearchField label="Destino"><input className="search-control" name="destino" defaultValue="Marrakech" placeholder="Ciudad, región o alojamiento" /></SearchField>
          <SearchField label="Fecha de entrada"><input className="search-control" type="date" name="fecha" /></SearchField>
          <SearchField label="Fecha de salida"><input className="search-control" type="date" name="salida" /></SearchField>
          <SearchField label="Ocupación"><SearchSelect name="personas"><option value="2">2 huéspedes, 1 habitación</option><option value="1">1 huésped, 1 habitación</option><option value="4">4 huéspedes, 2 habitaciones</option></SearchSelect></SearchField>
        </>;
      case 3:
        return <>
          <SearchField label="Destino"><SearchSelect name="destino"><option value="">Elige tu ruta</option><option>Atlas</option><option>Merzouga</option><option>Zagora</option></SearchSelect></SearchField>
          <SearchField label="Fecha de salida"><input className="search-control" type="date" name="fecha" /></SearchField>
          <SearchField label="Tamaño del grupo"><SearchSelect name="personas"><option value="2">1-2 personas</option><option value="4">3-4 personas</option><option value="6">5-6 personas</option></SearchSelect></SearchField>
        </>;
      case 4:
        return <>
          <SearchField label="Punto de recogida"><input className="search-control" name="origen" defaultValue="Aeropuerto de Marrakech" /></SearchField>
          <SearchField label="Destino"><input className="search-control" name="destino" defaultValue="Marrakech" /></SearchField>
          <SearchField label="Fecha"><input className="search-control" type="date" name="fecha" /></SearchField>
          <SearchField label="Pasajeros"><SearchSelect name="pasajeros"><option value="2">Hasta 2 pasajeros</option><option value="4">Hasta 4 pasajeros</option><option value="8">Hasta 8 pasajeros</option></SearchSelect></SearchField>
        </>;
      case 5:
        return <>
          <SearchField label="Fecha"><input className="search-control" type="date" name="fecha" /></SearchField>
          <SearchField label="Hora"><SearchSelect name="hora"><option value="">Cualquier hora</option><option value="19">Desde las 19:00</option><option value="20">Desde las 20:00</option></SearchSelect></SearchField>
          <SearchField label="Menú"><SearchSelect name="menu"><option value="">Todos los menús</option><option value="marroquí">Marroquí</option><option value="tradicional">Tradicional</option></SearchSelect></SearchField>
        </>;
      case 6:
        return <>
          <SearchField label="Tratamiento"><SearchSelect name="tratamiento"><option value="">Todos los rituales</option><option value="hammam">Hammam tradicional</option><option value="masaje">Masaje</option><option value="argán">Ritual de argán</option></SearchSelect></SearchField>
          <SearchField label="Fecha"><input className="search-control" type="date" name="fecha" /></SearchField>
          <SearchField label="Duración"><SearchSelect name="duracion"><option value="">Cualquier duración</option><option value="60">60 minutos</option><option value="90">90 minutos o más</option></SearchSelect></SearchField>
        </>;
      default:
        return <>
          <SearchField label="Destino"><SearchSelect name="destino"><option value="">¿Qué quieres descubrir?</option><option>Agafay</option><option>Zagora</option><option>Merzouga</option><option>Marrakech</option><option>Saidia</option></SearchSelect></SearchField>
          <SearchField label="Fecha"><input className="search-control" type="date" name="fecha" /></SearchField>
          <SearchField label="Duración"><SearchSelect name="duracion"><option value="">Cualquier duración</option><option value="0-4">Hasta 4 horas</option><option value="4-8">4-8 horas</option><option value="8-24">Día completo</option><option value="24-1000">Varios días</option></SearchSelect></SearchField>
        </>;
    }
  };

  return (
    <>
      <Head>
        <title>Nomadica Sahara — Excursiones, hoteles y experiencias en Marruecos</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <style>{css}</style>

      <div className="page">
        <Header />
        <MainNav />

        {/* ===== HERO ===== */}
        <section className="hero">
          <div key={activeHeroIndex} className="hero-image">
            <Image src={activeHero.image} alt={activeHero.category} fill sizes="50vw" unoptimized priority={activeHeroIndex === 0} className="hero-photo" />
          </div>
          <button type="button" className="hero-arrow left" aria-label="Imagen anterior" onClick={() => moveHero(-1)}>‹</button>
          <div className="hero-promo">
            <div className="hero-promo-head">
              <small>{activeHero.category}</small>
              <div className="hero-brandline">
                <h2>{activeHero.title}</h2>
              </div>
              <p className="hero-tagline">PONEMOS RUMBO A TUS SUEÑOS</p>
            </div>
            <div className="hero-badges">
              {activeHero.badges.map(([title, detail]) => <div key={title} className="hero-badge"><b>{title}</b><span>{detail}</span></div>)}
            </div>
          </div>
          <button type="button" className="hero-arrow right" aria-label="Imagen siguiente" onClick={() => moveHero(1)}>›</button>
        </section>
        <div className="hero-subline vci-divider">
          <span>{activeHero.subtitle}</span>
          <span className="dots" aria-label="Seleccionar imagen del hero">
            {heroSlides.map((slide, index) => <button key={slide.category} type="button" className={index === activeHeroIndex ? "on" : ""} aria-label={`Mostrar ${slide.category}`} aria-pressed={index === activeHeroIndex} onClick={() => setActiveHeroIndex(index)} />)}
          </span>
        </div>

        {/* ===== SEARCH ENGINE ===== */}
        <section className="search">
          <div className="wrap">
            <div className="search-tabs">
              {searchTabs.map(({ label, icon: Icon }, i) => (
                <button
                  key={label}
                  type="button"
                  role="tab"
                  aria-selected={i === activeTab}
                  className={i === activeTab ? "tab active" : "tab"}
                  onClick={() => setActiveTab(i)}
                >
                  <Icon aria-hidden="true" />{label}
                </button>
              ))}
            </div>
            <form className="search-form" action={searchTabs[activeTab].path} method="get">
              {renderSearchFields()}
              <button type="submit" className="btn-buscar"><MapPin aria-hidden="true" />BUSCAR</button>
            </form>
          </div>
        </section>
        <div className="search-slogan">TU VIAJE COMIENZA AQUÍ</div>
        {/* ===== ELIGE TU VIAJE ===== */}
        <section className="journey-section">
          <div className="wrap">
            <h3 className="journey-heading">Elige tu viaje</h3>
            <div className="journey-grid">
              {eligeTuViaje.map((c) => (
                <a key={c.label} href="#" className="journey-card" style={{ backgroundImage: `url(${c.img})` }}>
                  <span className="journey-content">
                    <span className="journey-title">{c.label}</span>
                    <span className="journey-action">{c.action}<span aria-hidden="true">›</span></span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ===== OFERTAS ÚLTIMA HORA ===== */}
        <section className="last-minute-section">
          <div className="wrap">
            <div className="last-minute-heading">
              <h3>OFERTAS ÚLTIMA HORA</h3>
              <a href="#">Ver más <ChevronRight aria-hidden="true" /></a>
            </div>
            <div className="last-minute-grid">
              {ultimaHora.map((o) => (
                <article key={o.title} className="last-minute-card">
                  <div className="last-minute-image" style={{ backgroundImage: `url(${o.img})` }}>
                    <span className="last-minute-tag">{o.tag}</span>
                    <span className="last-minute-type" aria-hidden="true"><o.icon /></span>
                    <div className="last-minute-price">
                      <span className="last-minute-price-copy"><small>desde</small><b>{o.price}</b><small>{o.sub}</small></span>
                      <span className="last-minute-info" aria-label="Más información"><Info aria-hidden="true" /></span>
                    </div>
                  </div>
                  <div className="last-minute-body">
                    <h4>{o.title}</h4>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PUENTE DE OCTUBRE / ESCAPADAS DE OTOÑO ===== */}
        <section className="section alt marketplace-section">
          <div className="wrap duo">
            <div>
              <h3 className="sec-title">Experiencias desde Marrakech</h3>
              <div className="stack october-offers">
                {puenteOctubre.map((o) => (
                  <MarketplaceProductCard key={o.title} image={o.img} tag="Hasta 10% de descuento" title={o.title} meta={o.sub} description={o.description} price={o.price} duration={o.duration} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="sec-title">Descubre Marruecos</h3>
              <div className="duo-inner">
                <MarketplaceProductCard image={IMG.roma} tag="MARRAKECH" title="Medina, palacios y zocos" meta="Visita guiada en español" description="Recorre los patios de la medina, descubre palacios históricos y encuentra los mejores rincones de los zocos con un guía local." price="29€" duration="3 horas" />
                <aside className="flight-list">
                  <h5>Experiencias populares</h5>
                  {vuelosFinde.map((f) => (
                    <div key={f.city} className="flight-row">
                      <span className="flight-row-destination"><b>{f.city}</b><small>Experiencia local</small><small>{f.duration}</small></span>
                      <span className="flight-price">desde <b>{f.price}</b></span>
                    </div>
                  ))}
                </aside>
              </div>
            </div>
          </div>
        </section>

        {/* ===== VUELO PRECIO ÚNICO / CIRCUITOS / CRUCEROS ===== */}
        <section className="section marketplace-section">
          <div className="wrap marketplace-trio">
            <div className="marketplace-airfare-column">
              <h3 className="sec-title">Traslados en Marrakech</h3>
              <div className="marketplace-airfare-layout">
                <MarketplaceProductCard image={IMG.washington} title="Aeropuerto Marrakech-Menara" meta="Traslado privado · hasta 4 pasajeros" description="Tu chófer te espera en llegadas y te lleva directamente a tu alojamiento. Reserva con antelación y empieza el viaje sin preocupaciones." price="20€" duration="Disponible 24/7" />
                <aside className="flight-list marketplace-route-list">
                  <h5>Excursiones desde Marrakech</h5>
                  {vuelosDirectos.map((flight) => (
                    <div key={flight.city} className="flight-row">
                      <span className="flight-row-destination"><b>{flight.city}</b><small>{flight.duration}</small></span>
                      <span className="flight-price">desde <b>{flight.price}</b></span>
                    </div>
                  ))}
                </aside>
              </div>
            </div>
            <div>
              <h3 className="sec-title">Tours privados</h3>
              <MarketplaceProductCard image={IMG.suiza} title="Pueblos del Alto Atlas" meta="Vehículo privado · recogida incluida" description="Diseña la ruta a tu ritmo, visita pueblos bereberes y disfruta de paradas a medida con un chófer local." price="120€" duration="8 horas" />
            </div>
            <div>
              <h3 className="sec-title">Cena espectáculo</h3>
              <MarketplaceProductCard image={IMG.crucero} tag="CENA Y MÚSICA" title="Cena marroquí bajo las estrellas" meta="Menú tradicional · música en directo" description="Disfruta de una cena marroquí y música en directo bajo el cielo de Agafay. Una velada para compartir los sabores y la hospitalidad local." price="35€" duration="19:00-23:00" actionLabel="VER MÁS" />
            </div>
          </div>
        </section>

        <section className="finance-note-section" aria-label="Financiación de viajes">
          <div className="wrap">
            <div className="finance-note-panel">
              <h3 className="finance-note-heading">Descubre Marruecos con Nomadica Sahara</h3>
              <p>Excursiones, alojamientos y traslados seleccionados para que disfrutes cada etapa del viaje.</p>
              <p>Consulta la disponibilidad y las condiciones de cada experiencia antes de reservar. Nuestro equipo está aquí para ayudarte a preparar tu ruta.</p>
            </div>
          </div>
        </section>

        {/* ===== GUÍAS DE VIAJE ===== */}
        <section className="travel-guides-section">
          <div className="wrap">
            <h3 className="travel-guides-heading">Guías de viaje</h3>
            <div className="travel-guides-grid">
              {guiasViaje.map((guide) => (
                <article key={guide.title} className="travel-guide-card">
                  <div className="travel-guide-image" style={{ backgroundImage: `url(${guide.img})` }} role="img" aria-label={guide.title}>
                    <span className="travel-guide-badge"><MapPin aria-hidden="true" />Guías de viaje</span>
                  </div>
                  <div className="travel-guide-copy">
                    <h4>{guide.title}</h4>
                    <p>{guide.sub}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== NEWSLETTER ===== */}
        <section className="newsletter">
          <div className="wrap news-in">
            <h4>¡IDEAS Y NOVEDADES PARA TU PRÓXIMO VIAJE A MARRUECOS!</h4>
            <div className="news-form">
              <input placeholder="Tu correo electrónico" />
              <button className="btn-buscar">SUSCRIBIRME</button>
            </div>
            <label className="news-check">
              <input type="checkbox" /> He leído y acepto la política de privacidad
            </label>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

const css = `
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Open Sans','Segoe UI',Arial,sans-serif; color:#333; }
  a { text-decoration:none; color:inherit; }
  button { font-family:inherit; cursor:pointer; border:none; }
  .page { background:#fff; }
  .wrap { max-width:1200px; margin:0 auto; padding:0 16px; }

  /* Topbar */
  .topbar { background:#f4f5f7; font-size:12px; color:#5a6b7b; }
  .topbar-in { display:flex; justify-content:flex-end; gap:24px; padding:8px 16px; }
  .topbar a:hover { color:#005F36; }

  /* Header */
  .header { background:#fff; border-bottom:1px solid #e5e5e5; }
  .header-in { display:flex; align-items:center; gap:32px; padding:14px 16px; flex-wrap:wrap; }
  .logo { white-space:nowrap; }
  .logo-viajes { font-weight:700; font-size:22px; color:#005F36; letter-spacing:.5px; }
  .logo-eci { font-family:'Brush Script MT','Segoe Script',cursive; font-size:22px; color:#005F36; }
  .nav { display:flex; flex-wrap:wrap; gap:18px; }
  .nav a { font-size:12px; font-weight:600; color:#2b2b2b; letter-spacing:.4px; }
  .nav a:hover { color:#005F36; }

  /* Hero */
  .hero { position:relative; height:400px; overflow:hidden; background:#edf1ef; display:grid; grid-template-columns:1fr 1fr; }
  .hero-image { position:relative; grid-column:1; grid-row:1; min-width:0; overflow:hidden; animation:hero-image-enter .8s ease both; }
  .hero-photo { object-fit:cover; }
  @keyframes hero-image-enter { from { opacity:.45; transform:scale(1.025); } to { opacity:1; transform:scale(1); } }
  .hero-arrow { position:absolute; z-index:2; top:50%; transform:translateY(-50%); width:58px; height:60px; background:rgba(255,255,255,.95); font-size:30px; font-weight:300; color:#123451; }
  .hero-arrow.left { left:0; } .hero-arrow.right { right:0; }
  .hero-promo { grid-column:2; grid-row:1; display:flex; flex-direction:column; justify-content:space-between; min-width:0; margin:0; width:auto; background:#edf1ef; color:#092b4d; padding:32px 7%; }
  .hero-promo-head { position:relative; display:flex; flex:1; flex-direction:column; justify-content:center; text-align:center; }
  .hero-promo-head small { color:#183b5a; font-size:11px; font-weight:600; letter-spacing:2px; }
  .hero-brandline { display:flex; align-items:center; justify-content:center; gap:8px; margin:10px auto 0; }
  .hero-promo-head h2 { max-width:470px; margin:0; color:#08294d; font-family:'Bodoni 72','Didot','Bodoni MT','Times New Roman',serif; font-size:54px; font-weight:400; line-height:.88; text-align:right; }
  .hero-tagline { margin:12px 0 0; color:#163b59; font-size:13px; font-weight:500; letter-spacing:3px; }
  .hero-badges { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:3px; }
  .hero-badge { display:flex; min-height:125px; flex-direction:column; align-items:center; justify-content:center; background:#59b900; padding:10px 5px; text-align:center; color:#fff; }
  .hero-badge b { display:block; font-size:24px; line-height:1.05; }
  .hero-badge span { margin-top:3px; font-size:12px; line-height:1.2; }
  .hero-subline { position:relative; display:flex; min-height:66px; height:auto; justify-content:center; align-items:center; max-width:none; margin:0; padding:0 16px 16px; border-bottom:1px solid #e5e7eb; background:#fff; color:#092b4d; font-size:14px; font-weight:500; letter-spacing:2px; text-align:center; }
  .hero-subline > span:first-child { max-width:calc(100% - 120px); padding:0 48px; background:#fff; clip-path:polygon(0 0,100% 0,90% 100%,10% 100%); }
  .dots { position:absolute; right:16px; top:calc(50% - 8px); transform:translateY(-50%); white-space:nowrap; }
  .dots button { display:inline-block; width:10px; height:10px; border-radius:50%; background:#c7c9c8; margin-left:7px; padding:0; vertical-align:middle; }
  .dots button.on { background:#676b69; }
  @media (prefers-reduced-motion: reduce) { .hero-image { animation:none; } }

  /* Search */
  .search { margin-top:28px; background:transparent; padding-bottom:0; }
  .search .wrap { width:100%; background:transparent; padding-top:0; padding-bottom:0; }
  .search-tabs { display:flex; overflow-x:auto; background:#e8ebe9; scrollbar-width:none; }
  .search-tabs::-webkit-scrollbar { display:none; }
  .tab { display:flex; flex:none; align-items:center; gap:8px; min-height:42px; background:#e8ebe9; color:#414d46; padding:8px 15px; font-size:13px; font-weight:500; white-space:nowrap; }
  .tab svg { width:20px; height:20px; stroke-width:1.4; }
  .tab.active { background:#171918; color:#fff; font-weight:700; }
  .tab.active svg { color:#8bd15c; }
  .search-form { display:flex; gap:8px; padding:14px; background:#171918; }
  .search-field { display:flex; flex:1 1 0; min-width:0; min-height:54px; flex-direction:column; justify-content:center; border:1px solid #d9dedb; background:#fff; padding:6px 10px; }
  .search-field > span { overflow:hidden; color:#737873; font-size:10px; line-height:1.2; text-overflow:ellipsis; white-space:nowrap; }
  .search-control { width:100%; min-width:0; height:23px; border:0; outline:0; background:#fff; color:#252925; font-family:inherit; font-size:13px; }
  .search-control:focus-visible { outline:2px solid #59b900; outline-offset:1px; }
  .btn-buscar { display:flex; flex:0 0 136px; min-height:54px; align-items:center; justify-content:center; gap:8px; background:#59b900; color:#fff; font-weight:700; padding:10px 20px; font-size:13px; letter-spacing:.5px; }
  .btn-buscar svg { width:16px; height:16px; }
  .btn-buscar:hover { background:#478f00; }
  .search-slogan { display:flex; min-height:62px; align-items:center; justify-content:center; color:#0c2c4d; font-size:20px; font-weight:700; letter-spacing:3px; text-align:center; }
  @media (min-width:768px) { .search .wrap { width:95%; } }

  /* Sections */
  .section { padding:36px 0; }
  .section.alt { background:#f7f8f9; }
  .sec-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; }
  .sec-title { font-size:20px; font-weight:700; color:#2b2b2b; margin-bottom:18px; }
  .sec-head .sec-title { margin-bottom:0; }
  .ver-mas { font-size:13px; font-weight:600; color:#60B61A; }
  .car-arrows button { width:32px; height:32px; border:1px solid #ccc; background:#fff; margin-left:6px; font-size:16px; }

  /* Elige tu viaje */
  .grid-6 { display:grid; grid-template-columns:repeat(6,1fr); gap:12px; }
  .grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
  .grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
  .journey-section { padding:24px 0 36px; }
  .journey-heading { margin:0 0 20px; padding-bottom:5px; border-bottom:1px solid #8f9691; color:#3c423e; font-size:22px; font-weight:400; }
  .journey-grid { display:grid; grid-template-columns:repeat(6,minmax(0,1fr)); gap:10px; }
  .journey-card { position:relative; display:flex; aspect-ratio:1/1; min-width:0; align-items:center; justify-content:center; overflow:hidden; background-size:cover; background-position:center; color:#fff; text-decoration:none; }
  .journey-card::before { position:absolute; inset:0; background:rgba(0,0,0,.28); content:""; transition:background .2s ease; }
  .journey-card:hover::before { background:rgba(0,0,0,.42); }
  .journey-content { position:relative; z-index:1; display:flex; width:100%; flex-direction:column; align-items:center; gap:24px; padding:14px; text-align:center; }
  .journey-title { max-width:100%; color:#fff; font-size:20px; font-weight:700; line-height:1.2; text-shadow:0 1px 5px rgba(0,0,0,.4); }
  .journey-action { display:inline-flex; min-width:132px; min-height:40px; align-items:center; justify-content:center; gap:9px; border:1px solid rgba(255,255,255,.95); background:rgba(20,20,20,.18); color:#fff; font-size:13px; font-weight:600; }
  .journey-action span { font-size:19px; font-weight:400; line-height:1; }

  /* Offer cards */
  .last-minute-section { background:#f0f0f0; padding:30px 0 34px; }
  .last-minute-heading { display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom:19px; padding-bottom:8px; border-bottom:1px solid #565b58; }
  .last-minute-heading h3 { grid-column:2; color:#34434c; font-size:20px; font-weight:500; letter-spacing:1.2px; text-align:center; }
  .last-minute-heading a { grid-column:3; display:inline-flex; align-items:center; justify-self:end; gap:2px; color:#273b40; font-size:12px; }
  .last-minute-heading a svg { width:15px; height:15px; }
  .last-minute-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:30px; }
  .last-minute-card { min-width:0; overflow:hidden; border:1px solid #c7c7c7; background:#fff; }
  .last-minute-image { position:relative; height:360px; background-position:center; background-size:cover; }
  .last-minute-image::after { position:absolute; inset:0; background:linear-gradient(180deg,rgba(0,0,0,.08) 50%,rgba(0,0,0,.16)); content:""; pointer-events:none; }
  .last-minute-tag { position:absolute; z-index:1; top:10px; left:10px; max-width:calc(100% - 64px); border-radius:4px; background:#60b900; padding:6px 14px; color:#fff; font-size:11px; font-weight:700; line-height:1.2; }
  .last-minute-type { position:absolute; z-index:1; top:10px; right:10px; display:flex; width:40px; height:40px; align-items:center; justify-content:center; border-radius:5px; background:rgba(255,255,255,.9); color:#23435b; }
  .last-minute-type svg { width:21px; height:21px; stroke-width:1.4; }
  .last-minute-price { position:absolute; z-index:1; right:0; bottom:7px; display:flex; align-items:stretch; background:rgba(255,255,255,.97); color:#33424b; }
  .last-minute-price-copy { display:flex; min-width:102px; flex-direction:column; justify-content:center; padding:6px 10px; }
  .last-minute-price-copy small { color:#53616a; font-size:10px; line-height:1.2; }
  .last-minute-price-copy b { color:#273b45; font-size:24px; line-height:1.05; }
  .last-minute-info { display:flex; width:32px; align-items:center; justify-content:center; border-left:1px solid #b9c1bb; color:#60b900; }
  .last-minute-info svg { width:17px; height:17px; fill:#60b900; color:#fff; }
  .last-minute-body { display:flex; min-height:58px; align-items:center; padding:10px 14px; }
  .last-minute-body h4 { color:#30373a; font-size:15px; font-weight:700; line-height:1.25; }
  .travel-guides-section { background:#fff; padding:24px 0 32px; }
  .travel-guides-heading { margin:0 0 20px; padding-bottom:7px; border-bottom:1px solid #8f9691; color:#34434c; font-size:22px; font-weight:400; }
  .travel-guides-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:16px; }
  .travel-guide-card { min-width:0; overflow:hidden; border:1px solid #c8ccca; background:#fff; }
  .travel-guide-image { position:relative; aspect-ratio:1.72/1; background-position:center; background-size:cover; }
  .travel-guide-badge { position:absolute; top:12px; right:12px; display:inline-flex; align-items:center; gap:5px; border-radius:4px; background:#101313; padding:8px 10px; color:#fff; font-size:11px; font-style:italic; font-weight:600; }
  .travel-guide-badge svg { width:14px; height:14px; stroke-width:1.8; }
  .travel-guide-copy { padding:9px 12px 12px; }
  .travel-guide-copy h4 { color:#273b45; font-size:18px; font-weight:700; line-height:1.2; }
  .travel-guide-copy p { margin-top:7px; color:#3f4946; font-size:15px; line-height:1.3; }
  .finance-note-section { background:#fff; padding:12px 0 0; }
  .finance-note-panel { border-top:1px solid #5daf2c; border-bottom:1px solid #5daf2c; padding:13px 8px 16px; color:#657078; text-align:center; }
  .finance-note-heading { display:flex; align-items:center; justify-content:center; gap:16px; margin:0 auto 5px; color:#263e50; font-size:16px; font-weight:700; line-height:1.3; }
  .finance-note-heading::before,
  .finance-note-heading::after { height:1px; flex:1; background:#c6c9c8; content:""; }
  .finance-note-panel p { font-size:11px; line-height:1.45; }
  .finance-note-panel p + p { margin-top:2px; }
  .section.marketplace-section { background:#f0f0f0; padding:22px 0; }
  .marketplace-section .sec-title { margin-bottom:12px; padding-bottom:6px; border-bottom:1px solid #aab0ad; color:#354149; font-size:16px; font-weight:500; }
  .marketplace-section .sec-head { margin-bottom:12px; padding-bottom:6px; border-bottom:1px solid #aab0ad; }
  .marketplace-section .sec-head .sec-title { margin-bottom:0; padding-bottom:0; border-bottom:0; }
  .marketplace-section .duo { gap:24px; }
  .marketplace-section .duo-inner { gap:10px; }
  .marketplace-section .marketplace-trio { display:grid; grid-template-columns:2fr 1fr 1fr; align-items:stretch; gap:30px; }
  .marketplace-trio > div { display:flex; min-width:0; flex-direction:column; }
  .marketplace-airfare-layout { display:grid; flex:1; grid-template-columns:repeat(2,minmax(0,1fr)); gap:30px; }
  .marketplace-airfare-layout > * { height:420px; }
  .marketplace-trio > div:not(.marketplace-airfare-column) > .marketplace-product { flex:1; }
  .marketplace-route-list { display:flex; flex-direction:column; }
  .marketplace-route-list .flight-row { flex:1; }
  .marketplace-section .october-offers { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; }
  .marketplace-product { display:flex; min-width:0; min-height:420px; flex-direction:column; overflow:hidden; border:1px solid #c6ccca; background:#fff; }
  .marketplace-product-image { position:relative; height:164px; flex:none; background-position:center; background-size:cover; }
  .marketplace-product-tag { position:absolute; top:6px; left:8px; right:8px; overflow:hidden; background:#60b900; padding:5px 8px; color:#fff; font-size:12px; font-weight:700; line-height:1.2; text-align:center; text-overflow:ellipsis; white-space:nowrap; }
  .marketplace-product-body { display:flex; flex:1; flex-direction:column; padding:10px; }
  .marketplace-product-body h4 { color:#293b45; font-size:18px; font-weight:700; line-height:1.2; }
  .marketplace-product-meta { margin-top:6px; background:#ffecd1; padding:8px 9px; color:#3d4542; font-size:12px; font-weight:600; line-height:1.25; }
  .marketplace-product-description { margin-top:7px; color:#505854; font-size:13px; line-height:1.35; }
  @media (min-width:1001px) {
    .marketplace-product-description { display:-webkit-box; min-height:70px; max-height:70px; overflow:hidden; -webkit-box-orient:vertical; -webkit-line-clamp:4; }
  }
  .marketplace-product-footer { display:flex; align-items:flex-end; justify-content:space-between; gap:8px; margin-top:auto; padding-top:10px; }
  .marketplace-product-price { display:flex; min-width:0; flex-direction:column; color:#758078; font-size:11px; line-height:1.1; }
  .marketplace-product-price small:first-child { font-size:11px; }
  .marketplace-product-price b { color:#59ad00; font-size:30px; line-height:1.05; }
  .marketplace-product-price small:last-child { margin-top:2px; font-size:10px; }
  .marketplace-product-footer .btn-reservar { display:inline-flex; min-height:40px; align-items:center; gap:7px; border:1px solid #60b61a; background:#fff; padding:6px 12px; color:#438d25; font-size:12px; white-space:nowrap; }
  .marketplace-product-footer .btn-reservar span { font-size:18px; line-height:1; }
  .marketplace-product-footer .btn-reservar:hover { background:#60b61a; color:#fff; }
  .marketplace-section .duo-inner > .marketplace-product,
  .marketplace-section .october-offers > .marketplace-product { min-height:420px; }
  .marketplace-section .offer-card,
  .marketplace-section .h-card,
  .marketplace-section .flight-list { border-color:#c6ccca; }
  .marketplace-section .offer-img { height:116px; }
  .marketplace-section .offer-img.tall { height:140px; }
  .marketplace-section .offer-body { padding:9px 10px; }
  .marketplace-section .offer-body h4,
  .marketplace-section .h-body h4 { color:#33454e; font-size:12px; font-weight:600; }
  .marketplace-section .offer-body p,
  .marketplace-section .h-body p { color:#7b8480; font-size:10px; }
  .marketplace-section .h-img { width:96px; min-height:92px; }
  .marketplace-section .h-body { padding:9px 10px; }
  .marketplace-section .h-foot { padding-top:6px; }
  .marketplace-section .price { color:#718078; font-size:10px; }
  .marketplace-section .price b,
  .marketplace-section .flight-price b { color:#55a900; font-size:15px; }
  .marketplace-section .flight-list { min-height:420px; padding:10px 12px; }
  .marketplace-section .flight-list h5 { margin-bottom:6px; padding-bottom:8px; border-bottom:1px solid #e1e3e1; color:#33454e; font-size:12px; font-weight:500; }
  .marketplace-section .flight-row { min-height:78px; align-items:center; padding:6px 0; color:#46524d; font-size:11px; }
  .marketplace-section .flight-row-destination { display:flex; min-width:0; flex-direction:column; gap:2px; }
  .marketplace-section .flight-row-destination b { color:#303b3d; font-size:11px; }
  .marketplace-section .flight-row-destination small { color:#929894; font-size:9px; }
  .marketplace-section .flight-row-destination small:last-child { color:#d27b29; }
  .marketplace-section .flight-price { flex:none; font-size:9px; }
  .marketplace-section .btn-reservar { border:1px solid #60b61a; background:#fff; color:#438d25; padding:5px 9px; font-size:9px; }
  @media (min-width:1001px) { .marketplace-section .marketplace-product-footer .btn-reservar { font-size:12px; } }
  .marketplace-section .btn-reservar:hover { background:#60b61a; color:#fff; }
  .offer-card { background:#fff; border:1px solid #e8e8e8; }
  .offer-img { position:relative; height:160px; background-size:cover; background-position:center; }
  .offer-img.tall { height:190px; }
  .tag-green { position:absolute; top:10px; left:0; background:#60B61A; color:#fff; font-size:11px; font-weight:600; padding:4px 10px; }
  .ribbon { position:absolute; top:12px; left:0; background:#60B61A; color:#fff; font-size:11px; font-weight:700; padding:5px 12px; }
  .price-badge { position:absolute; bottom:10px; right:10px; background:rgba(255,255,255,.95); color:#333; font-size:11px; padding:5px 10px; }
  .price-badge b { color:#005F36; font-size:14px; }
  .offer-body { padding:14px; }
  .offer-body h4 { font-size:14px; font-weight:700; margin-bottom:4px; }
  .offer-body p { font-size:12px; color:#888; }

  /* Horizontal cards + flight lists */
  .duo { display:grid; grid-template-columns:1fr 1fr; gap:32px; }
  .trio { display:grid; grid-template-columns:1fr 1fr 1fr; gap:24px; }
  .duo-inner { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .stack { display:flex; flex-direction:column; gap:16px; }
  .h-card { display:flex; background:#fff; border:1px solid #e8e8e8; }
  .h-img { width:140px; min-height:120px; background-size:cover; background-position:center; position:relative; }
  .h-img .ribbon { top:10px; }
  .h-body { flex:1; padding:12px 14px; display:flex; flex-direction:column; }
  .h-body h4 { font-size:14px; font-weight:700; }
  .h-body p { font-size:12px; color:#888; margin-top:2px; }
  .h-foot { display:flex; justify-content:space-between; align-items:center; margin-top:auto; padding-top:10px; }
  .price { font-size:11px; color:#888; }
  .price b { color:#005F36; font-size:16px; }
  .btn-reservar { background:#60B61A; color:#fff; font-size:11px; font-weight:700; padding:7px 14px; }
  .btn-reservar:hover { background:#4fa013; }
  .flight-list { background:#fff; border:1px solid #e8e8e8; padding:14px; margin-top:0; }
  .flight-list h5 { font-size:13px; font-weight:700; margin-bottom:10px; }
  .flight-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #f0f0f0; font-size:13px; }
  .flight-price { font-size:11px; color:#888; }
  .flight-price b { color:#005F36; font-size:14px; }

  /* Newsletter */
  .newsletter { background:#F2F9EE; padding:34px 0; text-align:center; }
  .news-in h4 { font-size:16px; color:#005F36; margin-bottom:16px; }
  .news-form { display:flex; justify-content:center; gap:10px; flex-wrap:wrap; }
  .news-form input { width:320px; max-width:90%; padding:12px; border:1px solid #cfe3c4; font-size:13px; }
  .news-check { display:block; margin-top:12px; font-size:12px; color:#666; }

  @media (max-width:1000px) {
    .grid-6 { grid-template-columns:repeat(3,1fr); }
    .journey-grid { grid-template-columns:repeat(3,minmax(0,1fr)); }
    .grid-4 { grid-template-columns:repeat(2,1fr); }
    .last-minute-grid { grid-template-columns:repeat(2,minmax(0,1fr)); gap:18px; }
    .last-minute-image { height:320px; }
    .travel-guides-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
    .duo, .trio, .duo-inner { grid-template-columns:1fr; }
    .marketplace-section .marketplace-trio { grid-template-columns:repeat(2,minmax(0,1fr)); gap:18px; }
    .marketplace-trio .marketplace-airfare-column { grid-column:1 / -1; }
    .marketplace-airfare-layout { gap:18px; }
    .hero { height:360px; }
    .hero-promo { padding:24px 5%; }
    .hero-promo-head h2 { font-size:42px; }
    .hero-badge { min-height:104px; }
    .hero-badge b { font-size:18px; }
    .hero-badge span { font-size:10px; }
    .marketplace-product-body h4 { font-size:17px; }
    .marketplace-product-meta { font-size:12px; }
    .marketplace-product-description { font-size:12px; }
    .marketplace-product-price b { font-size:26px; }
    .marketplace-product-footer .btn-reservar { font-size:11px; }
  }
  @media (max-width:600px) {
    .grid-6, .grid-4, .grid-3 { grid-template-columns:1fr; }
    .journey-grid { grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
    .journey-heading { font-size:20px; margin-bottom:14px; }
    .journey-content { gap:14px; padding:10px; }
    .journey-title { font-size:15px; }
    .journey-action { min-width:110px; min-height:34px; font-size:11px; }
    .marketplace-section .october-offers { grid-template-columns:1fr; }
    .marketplace-section .marketplace-trio,
    .marketplace-airfare-layout { grid-template-columns:1fr; }
    .marketplace-trio .marketplace-airfare-column { grid-column:auto; }
    .marketplace-airfare-layout > * { height:auto; min-height:420px; }
    .marketplace-section .duo-inner > .marketplace-product,
    .marketplace-section .october-offers > .marketplace-product,
    .marketplace-section .flight-list { min-height:390px; }
    .marketplace-product-body h4 { font-size:17px; }
    .marketplace-product-meta { font-size:12px; }
    .marketplace-product-description { font-size:12px; line-height:1.45; }
    .marketplace-product-price { font-size:11px; }
    .marketplace-product-price b { font-size:26px; }
    .marketplace-product-price small:last-child { font-size:10px; }
    .marketplace-product-footer .btn-reservar { min-height:42px; padding:7px 14px; font-size:11px; }
    .marketplace-section .flight-row-destination b { font-size:12px; }
    .marketplace-section .flight-row-destination small { font-size:10px; }
    .marketplace-section .flight-price { font-size:10px; }
    .last-minute-section { padding:24px 0; }
    .last-minute-heading { grid-template-columns:1fr auto; }
    .last-minute-heading h3 { grid-column:1; justify-self:start; font-size:16px; letter-spacing:.5px; text-align:left; }
    .last-minute-heading a { grid-column:2; }
    .last-minute-grid { grid-template-columns:1fr; gap:14px; }
    .last-minute-image { height:300px; }
    .travel-guides-section { padding:20px 0 26px; }
    .travel-guides-heading { margin-bottom:14px; font-size:20px; }
    .travel-guides-grid { grid-template-columns:1fr; gap:12px; }
    .travel-guide-copy h4 { font-size:17px; }
    .travel-guide-copy p { font-size:14px; }
    .finance-note-section { padding-top:8px; }
    .finance-note-panel { padding:10px 4px 12px; }
    .finance-note-heading { gap:8px; font-size:13px; }
    .finance-note-panel p { font-size:9px; }
    .hero { height:440px; grid-template-columns:1fr; grid-template-rows:210px 230px; }
    .hero-image { grid-column:1; grid-row:1; }
    .hero-promo { grid-column:1; grid-row:2; padding:16px 14px; }
    .hero-promo-head { justify-content:flex-start; }
    .hero-promo-head small { font-size:9px; }
    .hero-brandline { margin-top:7px; }
    .hero-promo-head h2 { max-width:270px; font-size:35px; text-align:center; }
    .hero-tagline { margin-top:6px; font-size:9px; letter-spacing:2px; }
    .hero-badges { gap:3px; }
    .hero-badge { min-height:68px; padding:6px 3px; }
    .hero-badge b { font-size:14px; }
    .hero-badge span { font-size:9px; }
    .hero-arrow { top:105px; width:42px; height:48px; font-size:24px; }
    .hero-subline { min-height:62px; font-size:10px; letter-spacing:1px; }
    .hero-subline > span:first-child { max-width:calc(100% - 86px); padding:0 15px; }
    .dots { right:8px; }
    .dots button { width:7px; height:7px; margin-left:4px; }
    .search { margin-top:20px; }
    .search-tabs { margin:0 -16px; }
    .tab { min-height:42px; padding:8px 12px; font-size:12px; }
    .tab svg { width:18px; height:18px; }
    .search-form { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); padding:10px 0; }
    .search-field { min-height:52px; }
    .btn-buscar { grid-column:1 / -1; min-height:48px; }
    .search-slogan { min-height:46px; font-size:13px; font-weight:700; letter-spacing:2px; }
  }
`;