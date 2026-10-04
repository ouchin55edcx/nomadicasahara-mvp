export type ProductType =
  | "activity"
  | "hotel"
  | "transfer"
  | "dinner"
  | "hammam"
  | "private-tour";

export type CatalogKind = ProductType | "mixed";

export interface Product {
  id: string;
  type: ProductType;
  title: string;
  slug: string;
  location: string;
  destination: string;
  image: string;
  gallery?: string[];
  price: number;
  currency: "EUR" | "MAD";
  rating?: number;
  reviewCount?: number;
  description?: string;
  duration?: string;
  durationHours?: number;
  date?: string;
  availability?: string;
  category?: string;
  tags?: string[];
  discount?: number;
  featured?: boolean;
  meetingPoint?: string;
  pickupIncluded?: boolean;
  stars?: number;
  hotelFacilities?: string[];
  vehicleType?: string;
  passengers?: number;
  menuType?: string;
  showIncluded?: boolean;
  treatmentDuration?: string;
  treatment?: string;
  time?: string;
  privateGroupSize?: string;
  href?: string;
}

export interface CatalogConfig {
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  path: string;
  kind: CatalogKind;
  destinations?: string[];
  productIds?: string[];
}

export const products: Product[] = [
  {
    id: "agafay-quad-sunset",
    type: "activity",
    title: "Desierto de Agafay: quad y puesta de sol",
    slug: "agafay-quad-sunset",
    location: "Salida desde Marrakech",
    destination: "Agafay",
    image: "/images/tour-atlas.jpg",
    price: 49.99,
    currency: "EUR",
    rating: 4.8,
    reviewCount: 236,
    duration: "4-5 horas",
    durationHours: 5,
    category: "Aventura",
    pickupIncluded: true,
    availability: "Hoy · Mañana · Elegir fecha",
    discount: 10,
    featured: true,
    href: "/marrakech-tours/agafay-quad",
  },
  {
    id: "agafay-camp-dinner",
    type: "dinner",
    title: "Cena marroquí bajo las estrellas",
    slug: "agafay-camp-dinner",
    location: "Desierto de Agafay",
    destination: "Agafay",
    image: "/images/tour-gastronomia.jpg",
    price: 35,
    currency: "EUR",
    rating: 4.7,
    reviewCount: 184,
    category: "Cena espectáculo",
    menuType: "Menú marroquí de 3 platos",
    showIncluded: true,
    time: "19:00-23:00",
    availability: "Disponible cada tarde",
  },
  {
    id: "zagora-2-days",
    type: "activity",
    title: "Zagora: kasbahs y noche en el desierto",
    slug: "zagora-2-days",
    location: "Salida desde Marrakech",
    destination: "Zagora",
    image: "/images/tour-kasbahs.jpg",
    price: 189,
    currency: "EUR",
    rating: 4.9,
    reviewCount: 128,
    duration: "2 días / 1 noche",
    durationHours: 36,
    pickupIncluded: true,
    availability: "Salidas diarias",
    category: "Desierto",
  },
  {
    id: "merzouga-camel-camp",
    type: "activity",
    title: "Merzouga: travesía en dromedario y campamento",
    slug: "merzouga-camel-camp",
    location: "Merzouga, Erg Chebbi",
    destination: "Merzouga",
    image: "/images/tour-merzouga.jpg",
    price: 289,
    currency: "EUR",
    rating: 4.9,
    reviewCount: 312,
    duration: "3 días / 2 noches",
    durationHours: 72,
    pickupIncluded: true,
    availability: "Elegir fecha",
    category: "Desierto",
    featured: true,
  },
  {
    id: "marrakech-medina-walk",
    type: "activity",
    title: "Marrakech: medina, palacios y zocos",
    slug: "marrakech-medina-walk",
    location: "Marrakech",
    destination: "Marrakech",
    image: "/images/tour-ciudades.jpg",
    price: 29,
    currency: "EUR",
    rating: 4.8,
    reviewCount: 95,
    duration: "3 horas",
    durationHours: 3,
    pickupIncluded: false,
    availability: "Hoy · Mañana · Elegir fecha",
    category: "Cultura",
  },
  {
    id: "saidia-coast-day",
    type: "activity",
    title: "Costa mediterránea y paseo en barco",
    slug: "saidia-coast-day",
    location: "Saidia",
    destination: "Saidia",
    image: "/images/tour-costa.jpg",
    price: 65,
    currency: "EUR",
    rating: 4.6,
    reviewCount: 74,
    duration: "6 horas",
    durationHours: 6,
    pickupIncluded: true,
    availability: "Junio-septiembre",
    category: "Costa",
  },
  {
    id: "private-atlas-day",
    type: "private-tour",
    title: "Tour privado por los pueblos del Atlas",
    slug: "private-atlas-day",
    location: "Salida desde Marrakech",
    destination: "Atlas",
    image: "/images/tour-atlas.jpg",
    price: 120,
    currency: "EUR",
    rating: 4.9,
    reviewCount: 61,
    duration: "8 horas",
    durationHours: 8,
    pickupIncluded: true,
    privateGroupSize: "1-6 personas",
    availability: "A tu medida",
    category: "Tour privado",
  },
  {
    id: "private-sahara-camp",
    type: "private-tour",
    title: "Noche privada en un campamento del Sáhara",
    slug: "private-sahara-camp",
    location: "Merzouga",
    destination: "Merzouga",
    image: "/images/tour-sahara-lux.jpg",
    price: 420,
    currency: "EUR",
    rating: 5,
    reviewCount: 42,
    duration: "2 días / 1 noche",
    durationHours: 48,
    pickupIncluded: true,
    privateGroupSize: "Hasta 4 personas",
    availability: "A tu medida",
    category: "Tour privado",
  },
  {
    id: "airport-private-van",
    type: "transfer",
    title: "Traslado privado Aeropuerto Marrakech-Menara",
    slug: "airport-private-van",
    location: "Aeropuerto de Marrakech",
    destination: "Marrakech",
    image: "/images/tour-ciudades.jpg",
    price: 20,
    currency: "EUR",
    rating: 4.8,
    reviewCount: 206,
    vehicleType: "Minivan privada",
    passengers: 4,
    availability: "Disponible 24/7",
    category: "Privado",
  },
  {
    id: "airport-shared-shuttle",
    type: "transfer",
    title: "Traslado compartido al centro de Marrakech",
    slug: "airport-shared-shuttle",
    location: "Aeropuerto de Marrakech",
    destination: "Marrakech",
    image: "/images/tour-costa.jpg",
    price: 8,
    currency: "EUR",
    rating: 4.5,
    reviewCount: 87,
    vehicleType: "Minibús compartido",
    passengers: 8,
    availability: "Salidas cada hora",
    category: "Compartido",
  },
  {
    id: "dinner-fantasia",
    type: "dinner",
    title: "Cena y espectáculo Fantasía",
    slug: "dinner-fantasia",
    location: "Palmeraie de Marrakech",
    destination: "Marrakech",
    image: "/images/tour-gastronomia.jpg",
    price: 48,
    currency: "EUR",
    rating: 4.7,
    reviewCount: 153,
    menuType: "Cena tradicional marroquí",
    showIncluded: true,
    time: "19:30-23:00",
    availability: "Todos los días",
  },
  {
    id: "riad-medina",
    type: "hotel",
    title: "Riad Dar Anika",
    slug: "riad-dar-anika",
    location: "Medina de Marrakech",
    destination: "Marrakech",
    image: "/images/tour-fez.jpg",
    price: 75,
    currency: "EUR",
    rating: 8.9,
    reviewCount: 124,
    stars: 4,
    hotelFacilities: ["WiFi", "Piscina", "Desayuno"],
    discount: 12,
    category: "Riad",
    tags: ["urban", "medina", "boutique", "featured"],
  },
  {
    id: "atlas-palace",
    type: "hotel",
    title: "Atlas Palace & Spa",
    slug: "atlas-palace-spa",
    location: "Hivernage, Marrakech",
    destination: "Marrakech",
    image: "/images/tour-ciudades.jpg",
    price: 142,
    currency: "EUR",
    rating: 9.2,
    reviewCount: 318,
    stars: 5,
    hotelFacilities: ["WiFi", "Piscina", "Spa", "Desayuno"],
    category: "Hotel",
    tags: ["pool", "spa", "luxury", "featured"],
  },
  {
    id: "riad-yasmine",
    type: "hotel",
    title: "Riad Yasmine",
    slug: "riad-yasmine",
    location: "Medina de Marrakech",
    destination: "Marrakech",
    image: "/images/tour-fez.jpg",
    price: 118,
    currency: "EUR",
    rating: 9.1,
    reviewCount: 286,
    stars: 4,
    hotelFacilities: ["WiFi", "Piscina", "Desayuno"],
    category: "Riad",
    tags: ["urban", "medina", "pool", "boutique"],
  },
  {
    id: "les-jardins-koutoubia",
    type: "hotel",
    title: "Les Jardins de la Koutoubia",
    slug: "les-jardins-koutoubia",
    location: "Centro histórico, Marrakech",
    destination: "Marrakech",
    image: "/images/tour-ciudades.jpg",
    price: 196,
    currency: "EUR",
    rating: 9.3,
    reviewCount: 421,
    stars: 5,
    hotelFacilities: ["WiFi", "Piscina", "Spa", "Desayuno"],
    discount: 8,
    category: "Hotel",
    tags: ["urban", "medina", "pool", "spa", "luxury"],
  },
  {
    id: "riad-kniza",
    type: "hotel",
    title: "Riad Kniza",
    slug: "riad-kniza",
    location: "Bab Doukkala, Marrakech",
    destination: "Marrakech",
    image: "/images/tour-kasbahs.jpg",
    price: 164,
    currency: "EUR",
    rating: 9.4,
    reviewCount: 203,
    stars: 5,
    hotelFacilities: ["WiFi", "Desayuno", "Terraza"],
    category: "Riad",
    tags: ["urban", "medina", "boutique", "luxury"],
  },
  {
    id: "kenzi-rose-garden",
    type: "hotel",
    title: "Kenzi Rose Garden",
    slug: "kenzi-rose-garden",
    location: "Hivernage, Marrakech",
    destination: "Marrakech",
    image: "/images/tour-sahara-lux.jpg",
    price: 153,
    currency: "EUR",
    rating: 8.6,
    reviewCount: 347,
    stars: 5,
    hotelFacilities: ["WiFi", "Piscina", "Spa", "Desayuno"],
    category: "Resort",
    tags: ["pool", "family", "spa"],
  },
  {
    id: "el-fenn",
    type: "hotel",
    title: "El Fenn",
    slug: "el-fenn-marrakech",
    location: "Mouassine, Marrakech",
    destination: "Marrakech",
    image: "/images/tour-gastronomia.jpg",
    price: 365,
    currency: "EUR",
    rating: 9.5,
    reviewCount: 172,
    stars: 5,
    hotelFacilities: ["WiFi", "Piscina", "Spa", "Terraza"],
    category: "Riad",
    tags: ["urban", "medina", "pool", "spa", "luxury", "featured"],
  },
  {
    id: "dar-rhizlane",
    type: "hotel",
    title: "Dar Rhizlane",
    slug: "dar-rhizlane-marrakech",
    location: "Hivernage, Marrakech",
    destination: "Marrakech",
    image: "/images/tour-atlas.jpg",
    price: 248,
    currency: "EUR",
    rating: 9.2,
    reviewCount: 158,
    stars: 5,
    hotelFacilities: ["WiFi", "Piscina", "Spa", "Desayuno"],
    category: "Hotel boutique",
    tags: ["pool", "spa", "luxury", "featured"],
  },
  {
    id: "riad-kheirredine",
    type: "hotel",
    title: "Riad Kheirredine",
    slug: "riad-kheirredine",
    location: "Medina de Marrakech",
    destination: "Marrakech",
    image: "/images/tour-merzouga.jpg",
    price: 221,
    currency: "EUR",
    rating: 9.6,
    reviewCount: 194,
    stars: 5,
    hotelFacilities: ["WiFi", "Piscina", "Desayuno", "Terraza"],
    category: "Riad",
    tags: ["urban", "medina", "pool", "boutique", "luxury"],
  },
  {
    id: "palais-namaskar",
    type: "hotel",
    title: "Palais Namaskar",
    slug: "palais-namaskar-marrakech",
    location: "Palmeral de Marrakech",
    destination: "Marrakech",
    image: "/images/tour-costa.jpg",
    price: 410,
    currency: "EUR",
    rating: 9.1,
    reviewCount: 119,
    stars: 5,
    hotelFacilities: ["WiFi", "Piscina", "Spa", "Desayuno"],
    category: "Resort",
    tags: ["pool", "spa", "luxury", "family"],
  },
  {
    id: "hammam-argan-ritual",
    type: "hammam",
    title: "Hammam tradicional y masaje de argán",
    slug: "hammam-argan-ritual",
    location: "Mellah, Marrakech",
    destination: "Marrakech",
    image: "/images/hammam-wellness.jpg",
    price: 35,
    currency: "EUR",
    rating: 4.9,
    reviewCount: 108,
    treatmentDuration: "60 min",
    treatment: "Hammam, exfoliación y masaje de argán",
    category: "Bienestar",
  },
  {
    id: "hammam-royal-spa",
    type: "hammam",
    title: "Ritual real de hammam y masaje",
    slug: "hammam-royal-spa",
    location: "Gueliz, Marrakech",
    destination: "Marrakech",
    image: "/images/hammam-wellness.jpg",
    price: 68,
    currency: "EUR",
    rating: 4.8,
    reviewCount: 76,
    treatmentDuration: "90 min",
    treatment: "Hammam, ghassoul y masaje relajante",
    category: "Spa premium",
  },
];

export const catalogConfigs: Record<string, CatalogConfig> = {
  "excursiones-marruecos": {
    title: "Todas las excursiones",
    description: "Encuentra experiencias auténticas por el desierto, las medinas y la costa de Marruecos.",
    seoTitle: "Excursiones por Marruecos | Nomadica Sahara",
    seoDescription: "Compara y reserva excursiones, tours privados y experiencias locales en Marruecos.",
    path: "/excursiones-marruecos",
    kind: "mixed",
  },
  "excursiones-desierto-marruecos": {
    title: "Excursiones al desierto de Marruecos",
    description: "Rutas entre dunas, kasbahs y oasis con salidas desde Marrakech.",
    seoTitle: "Excursiones al desierto de Marruecos | Nomadica Sahara",
    seoDescription: "Descubre Agafay, Zagora y Merzouga con excursiones guiadas desde Marrakech.",
    path: "/excursiones-desierto-marruecos",
    kind: "activity",
    destinations: ["Agafay", "Zagora", "Merzouga"],
  },
  "excursion-desierto-agafay": {
    title: "Excursiones en Agafay",
    description: "Atardeceres, aventura y hospitalidad bereber a las puertas de Marrakech.",
    seoTitle: "Excursiones en Agafay | Nomadica Sahara",
    seoDescription: "Reserva una excursión al desierto de Agafay con recogida desde Marrakech.",
    path: "/excursion-desierto-agafay",
    kind: "activity",
    destinations: ["Agafay"],
  },
  "excursion-desierto-zagora": {
    title: "Excursiones a Zagora",
    description: "Atraviesa el Atlas y descubre el valle del Draa y sus paisajes de adobe.",
    seoTitle: "Excursiones a Zagora | Nomadica Sahara",
    seoDescription: "Explora Zagora y el valle del Draa con una ruta guiada desde Marrakech.",
    path: "/excursion-desierto-zagora",
    kind: "activity",
    destinations: ["Zagora"],
  },
  "excursion-desierto-merzouga": {
    title: "Excursiones a Merzouga",
    description: "Vive las dunas de Erg Chebbi, un paseo en dromedario y una noche bajo las estrellas.",
    seoTitle: "Excursiones a Merzouga | Nomadica Sahara",
    seoDescription: "Descubre el Sáhara de Merzouga con campamento, dromedarios y guía local.",
    path: "/excursion-desierto-merzouga",
    kind: "activity",
    destinations: ["Merzouga"],
  },
  "excursiones-marrakech": {
    title: "Excursiones desde Marrakech",
    description: "Visitas culturales y experiencias locales para conocer Marrakech y sus alrededores.",
    seoTitle: "Excursiones en Marrakech | Nomadica Sahara",
    seoDescription: "Reserva visitas guiadas, excursiones al desierto y experiencias en Marrakech.",
    path: "/excursiones-marrakech",
    kind: "activity",
    productIds: ["marrakech-medina-walk", "agafay-quad-sunset", "zagora-2-days", "merzouga-camel-camp"],
  },
  "excursiones-saidia": {
    title: "Excursiones en Saidia",
    description: "Días de mar y experiencias para descubrir la costa mediterránea de Marruecos.",
    seoTitle: "Excursiones en Saidia | Nomadica Sahara",
    seoDescription: "Explora Saidia y la costa mediterránea con actividades para todos los viajeros.",
    path: "/excursiones-saidia",
    kind: "activity",
    destinations: ["Saidia"],
  },
  "excursiones-privadas-marruecos": {
    title: "Excursiones privadas en Marruecos",
    description: "Experiencias a medida, con vehículo privado y un itinerario a tu ritmo.",
    seoTitle: "Excursiones privadas en Marruecos | Nomadica Sahara",
    seoDescription: "Diseña un viaje privado por Marruecos con recogida y guía local.",
    path: "/excursiones-privadas-marruecos",
    kind: "private-tour",
  },
  "traslados-aeropuerto-marrakech": {
    title: "Traslados aeropuerto Marrakech",
    description: "Conecta el aeropuerto con tu alojamiento en un traslado reservado con antelación.",
    seoTitle: "Traslados aeropuerto Marrakech | Nomadica Sahara",
    seoDescription: "Reserva un traslado privado o compartido desde el aeropuerto de Marrakech.",
    path: "/traslados-aeropuerto-marrakech",
    kind: "transfer",
    destinations: ["Marrakech"],
  },
  "cena-espectaculo-marrakech": {
    title: "Cena espectáculo en Marrakech",
    description: "Sabores marroquíes, música en directo y una velada inolvidable.",
    seoTitle: "Cena espectáculo en Marrakech | Nomadica Sahara",
    seoDescription: "Disfruta de una cena marroquí con música y espectáculo en Marrakech.",
    path: "/cena-espectaculo-marrakech",
    kind: "dinner",
    destinations: ["Marrakech", "Agafay"],
  },
  "hoteles-marrakech": {
    title: "Hoteles en Marrakech",
    description: "Encuentra riads con encanto y hoteles seleccionados en la medina y la ciudad nueva.",
    seoTitle: "Hoteles en Marrakech | Nomadica Sahara",
    seoDescription: "Compara alojamientos en Marrakech: riads, hoteles y estancias con encanto.",
    path: "/hoteles-marrakech",
    kind: "hotel",
    destinations: ["Marrakech"],
  },
  "hammam-spa-marrakech": {
    title: "Hammam y spa en Marrakech",
    description: "Rituales tradicionales, masaje de argán y pausas de bienestar en Marrakech.",
    seoTitle: "Hammam y spa en Marrakech | Nomadica Sahara",
    seoDescription: "Reserva tratamientos de hammam tradicional y spa en Marrakech.",
    path: "/hammam-spa-marrakech",
    kind: "hammam",
    destinations: ["Marrakech"],
  },
};

export function getCatalogProducts(config: CatalogConfig, query: Record<string, string | string[] | undefined>) {
  let result = products.filter((product) => {
    if (config.kind !== "mixed" && product.type !== config.kind) return false;
    if (config.destinations && !config.destinations.includes(product.destination)) return false;
    if (config.productIds && !config.productIds.includes(product.id)) return false;
    return true;
  });

  const value = (key: string) => {
    const entry = query[key];
    return Array.isArray(entry) ? entry[0] : entry;
  };
  const maxPrice = Number(value("precio_max"));
  const minRating = Number(value("valoracion"));
  const minStars = Number(value("estrellas"));
  const duration = value("duracion");
  const page = Math.max(1, Number(value("page")) || 1);

  if (Number.isFinite(maxPrice) && maxPrice > 0) result = result.filter((product) => product.price <= maxPrice);
  if (Number.isFinite(minRating) && minRating > 0) result = result.filter((product) => (product.rating ?? 0) >= minRating);
  if (Number.isFinite(minStars) && minStars > 0) result = result.filter((product) => (product.stars ?? 0) >= minStars);
  if (value("destino")) {
    const destinationQuery = value("destino")!.toLocaleLowerCase();
    result = result.filter((product) => {
      if (config.kind === "hotel" || config.kind === "transfer") {
        return `${product.destination} ${product.location} ${product.title}`.toLocaleLowerCase().includes(destinationQuery);
      }
      return product.destination.toLocaleLowerCase() === destinationQuery;
    });
  }
  if (value("recogida") === "true") result = result.filter((product) => product.pickupIncluded);
  if (value("servicio")) result = result.filter((product) => product.hotelFacilities?.includes(value("servicio")!));
  if (value("categoria")) result = result.filter((product) => product.category?.toLowerCase().includes(value("categoria")!.toLowerCase()));
  if (value("coleccion")) result = result.filter((product) => product.tags?.includes(value("coleccion")!));
  if (value("menu")) result = result.filter((product) => product.menuType?.toLowerCase().includes(value("menu")!.toLowerCase()));
  if (value("espectaculo") === "true") result = result.filter((product) => product.showIncluded);
  if (value("tipo")) result = result.filter((product) => product.category?.toLowerCase().includes(value("tipo")!.toLowerCase()));
  if (value("vehiculo")) result = result.filter((product) => product.vehicleType?.toLowerCase().includes(value("vehiculo")!.toLowerCase()));
  if (value("pasajeros")) result = result.filter((product) => (product.passengers ?? 0) >= Number(value("pasajeros")));
  if (value("horario") === "24") result = result.filter((product) => product.availability?.includes("24/7"));
  if (value("tratamiento")) result = result.filter((product) => product.treatment?.toLowerCase().includes(value("tratamiento")!.toLowerCase()));
  if (value("hora")) result = result.filter((product) => Number(product.time?.slice(0, 2)) >= Number(value("hora")));
  if (value("personas")) result = result.filter((product) => {
    const capacities = product.privateGroupSize?.match(/\d+/g)?.map(Number) ?? [];
    return capacities.length > 0 && Math.max(...capacities) >= Number(value("personas"));
  });
  if (duration && config.kind === "hammam") {
    result = result.filter((product) => Number(product.treatmentDuration?.match(/\d+/)?.[0] ?? 0) >= Number(duration));
  } else if (duration) {
    const [minimum, maximum] = duration.split("-").map(Number);
    result = result.filter((product) => product.durationHours !== undefined && product.durationHours >= minimum && product.durationHours <= maximum);
  }
  if (value("orden") === "precio-asc") result.sort((a, b) => a.price - b.price);
  if (value("orden") === "rating") result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  if (value("orden") === "popularidad") result.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));

  const pageSize = config.kind === "hotel" ? 12 : 8;
  return {
    products: result.slice((page - 1) * pageSize, page * pageSize),
    total: result.length,
    page,
    pageCount: Math.max(1, Math.ceil(result.length / pageSize)),
  };
}