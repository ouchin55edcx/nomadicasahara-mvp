import Image from "next/image";
import Header from "@/components/Header";
import MainNav from "@/components/MainNav";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import TourCard from "@/components/TourCard";
import Footer from "@/components/Footer";
import { featuredTours, moreTours } from "@/lib/tours";

const banners = [
  {
    image: "/images/banner-kasbahs.jpg",
    alt: "Fortalezas de adobe en la ruta de las kasbahs del sur de Marruecos",
    title: "La ruta de las kasbahs",
  },
  {
    image: "/images/banner-essaouira.jpg",
    alt: "Vista del puerto y las murallas de Essaouira sobre el Atlántico",
    title: "Essaouira, el secreto atlántico",
  },
];

const destinos = [
  {
    image: "/images/dest-merzouga.jpg",
    alt: "Caravana de dromedarios en las dunas doradas de Merzouga",
    title: "Desierto de Merzouga",
  },
  {
    image: "/images/dest-atlas.jpg",
    alt: "Cumbres y valles del Alto Atlas marroquí",
    title: "Valle del Atlas",
  },
];

const condiciones = [
  {
    title: "Precios y tarifas",
    body: "Los precios mostrados son tarifas «desde» por persona, calculadas en base a habitación o jaima doble en temporada baja. Incluyen alojamiento, transporte interno, guía oficial y las comidas indicadas en cada programa. No incluyen vuelos internacionales, bebidas ni propinas.",
  },
  {
    title: "Cancelación y cambios",
    body: "Cancelación gratuita hasta 30 días antes de la salida. Entre 29 y 15 días se aplica el 50 % de gastos; con menos de 14 días, el 100 %. Los cambios de fecha son gratuitos hasta 21 días antes, sujetos a disponibilidad. Recomendamos contratar un seguro de viaje con cobertura de cancelación.",
  },
  {
    title: "Formas de pago",
    body: "Aceptamos Visa, Mastercard, American Express, transferencia bancaria y Bizum. Se abona un 20 % al formalizar la reserva y el importe restante 30 días antes de la salida. Todos los pagos se procesan con cifrado SSL y recibirás factura electrónica.",
  },
  {
    title: "Guías y licencias",
    body: "Todos nuestros guías son oficiales y están acreditados por el Ministerio de Turismo de Marruecos. En los programas de trekking, el guía de montaña titulado, el seguro de accidentes y los permisos del Parque Nacional del Toubkal están incluidos.",
  },
  {
    title: "Menores y grupos",
    body: "Niños de 2 a 11 años: 25 % de descuento compartiendo alojamiento con dos adultos. Grupos de 8 o más personas: presupuesto a medida, salidas privadas y un coordinador de grupo sin coste. Viajeros en solitario: suplemento individual disponible bajo consulta.",
  },
  {
    title: "Documentación",
    body: "Para ciudadanos de la UE basta pasaporte en vigor con validez mínima de 6 meses; no se requiere visado para estancias turísticas de hasta 90 días. Verificamos los requisitos sanitarios y de entrada vigentes antes de cada salida y te los confirmamos por escrito.",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <MainNav />

      <main className="mx-auto w-full max-w-[1200px] px-3 pb-8">
        <Hero />
        <SearchBar />

        {/* Destacados */}
        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-medium">Destacados</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredTours.map((t) => (
              <TourCard key={t.title} t={t} />
            ))}
          </div>
        </section>

        {/* Más experiencias */}
        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-medium">Más experiencias</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {moreTours.map((t) => (
              <TourCard key={t.title} t={t} />
            ))}
          </div>
        </section>

        {/* Editorial banners */}
        <section className="mt-10 rounded-sm border border-line bg-white p-4 md:p-6">
          <h2 className="mb-4 text-2xl font-medium">
            Marruecos: desierto, medinas y costa atlántica
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {banners.map((b) => (
              <a
                key={b.title}
                href="#"
                className="group relative block h-52 overflow-hidden rounded-sm md:h-64"
              >
                <Image
                  src={b.image}
                  alt={b.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 560px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-transparent" />
                <p className="absolute bottom-4 left-4 text-lg font-semibold uppercase tracking-nav text-white md:text-xl">
                  {b.title}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* SEO / editorial block */}
        <section className="mt-10 grid grid-cols-1 gap-6 rounded-sm border border-line bg-white p-6 lg:grid-cols-[280px_1fr]">
          <h2 className="text-xl font-medium uppercase leading-snug lg:text-2xl">
            Marruecos, donde el desierto se encuentra con la costa
          </h2>
          <div className="space-y-3 text-[13px] leading-[1.6] text-muted">
            <p>
              <strong className="font-semibold text-ink">Marrakech</strong> es
              la puerta de entrada al sur de Marruecos. Su{" "}
              <strong className="font-semibold text-ink">medina</strong>,
              declarada Patrimonio de la Humanidad por la UNESCO, concentra{" "}
              <strong className="font-semibold text-ink">zocos</strong>{" "}
              artesanos, el palacio Bahía y la plaza de Jemaa el-Fna, que cada
              tarde se llena de músicos y puestos de comida. Dormir en un{" "}
              <strong className="font-semibold text-ink">riad</strong> con patio
              interior es la mejor forma de conocer la ciudad desde dentro.
            </p>
            <p>
              El <strong className="font-semibold text-ink">Sáhara</strong>{" "}
              marroquí se vive en las dunas del Erg Chebbi, junto a Merzouga:
              travesías en dromedario al atardecer, noches en{" "}
              <strong className="font-semibold text-ink">jaima</strong> bajo uno
              de los cielos más limpios de África y amaneceres que tiñen la
              arena de color cobre. Nuestros campamentos combinan confort y
              hospitalidad bereber.
            </p>
            <p>
              El <strong className="font-semibold text-ink">Alto Atlas</strong>{" "}
              es el gran territorio de trekking del norte de África. Desde el
              valle de Imlil parten rutas entre aldeas bereberes de adobe,
              nogales y terrazas, con la opción de coronar el Toubkal (4.167 m),
              siempre acompañados por guías de montaña titulados.
            </p>
            <p>
              Las <strong className="font-semibold text-ink">ciudades
              imperiales</strong> —Fez, Meknés y Rabat— conservan mil años de
              historia. La medina de Fez el-Bali es la mayor zona urbana
              peatonal del mundo, y sus madrasas, curtidores y talleres de
              cerámica mantienen vivos oficios centenarios.
            </p>
            <p>
              En el Atlántico,{" "}
              <strong className="font-semibold text-ink">Essaouira</strong>{" "}
              combina murallas portuguesas, un puerto pesquero de barcas azules
              y una amplia bahía de viento constante, ideal para el surf y el
              kitesurf. Es el cierre perfecto para cualquier ruta por Marruecos.
            </p>
          </div>
        </section>

        {/* Destinos destacados */}
        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-medium">Destinos destacados</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {destinos.map((d) => (
              <a
                key={d.title}
                href="#"
                className="group relative block h-56 overflow-hidden rounded-sm md:h-64"
              >
                <Image
                  src={d.image}
                  alt={d.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 560px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-transparent" />
                <p className="absolute bottom-4 left-4 text-lg font-semibold uppercase tracking-nav text-white md:text-xl">
                  {d.title}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* Condiciones */}
        <section className="mt-10 rounded-sm border border-line bg-white p-6">
          <h2 className="mb-4 text-2xl font-medium">Condiciones</h2>
          <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
            {condiciones.map((c) => (
              <div key={c.title}>
                <h3 className="text-[13px] font-semibold uppercase tracking-nav text-ink">
                  {c.title}
                </h3>
                <p className="mt-1.5 text-[12.5px] leading-[1.6] text-muted">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Breadcrumb */}
        <nav
          aria-label="Migas de pan"
          className="mt-8 text-xs text-muted"
        >
          <a href="#" className="hover:text-brand">
            Inicio
          </a>
          <span className="mx-1.5">›</span>
          <a href="#" className="hover:text-brand">
            Destinos
          </a>
          <span className="mx-1.5">›</span>
          <span className="text-ink">Marruecos</span>
        </nav>
      </main>

      <Footer />
    </>
  );
}
