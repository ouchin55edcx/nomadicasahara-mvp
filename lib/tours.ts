export type Tour = {
  image: string;
  alt: string;
  badge: string;
  title: string;
  pill: string;
  desc: string;
  price: number;
  duration: string;
};

export const featuredTours: Tour[] = [
  {
    image: "/images/tour-merzouga.jpg",
    alt: "Dunas del Erg Chebbi al atardecer en Merzouga",
    badge: "10% de descuento",
    title: "Noche de estrellas en Merzouga",
    pill: "Guía incluida",
    desc: "Travesía en dromedario al atardecer, cena bereber junto al fuego y noche en jaima privada bajo las dunas del Erg Chebbi.",
    price: 289,
    duration: "3 días / 2 noches",
  },
  {
    image: "/images/tour-ciudades.jpg",
    alt: "Plaza de Jemaa el-Fna y la medina de Marrakech",
    badge: "15% de descuento",
    title: "Ciudades imperiales esenciales",
    pill: "Grupos reducidos",
    desc: "Marrakech, Fez, Meknés y Rabat con guía oficial, noches en riads con encanto y entradas a monumentos incluidas.",
    price: 748,
    duration: "7 días / 6 noches",
  },
  {
    image: "/images/tour-atlas.jpg",
    alt: "Senda de trekking entre pueblos bereberes del Alto Atlas",
    badge: "12% de descuento",
    title: "Trekking del Alto Atlas",
    pill: "Guía de montaña",
    desc: "Valle de Imlil, aldeas bereberes de adobe y ascensión opcional al Toubkal, con porteo de equipaje y refugios de montaña.",
    price: 412,
    duration: "4 días / 3 noches",
  },
  {
    image: "/images/tour-costa.jpg",
    alt: "Barcas azules en el puerto pesquero de Essaouira",
    badge: "10% de descuento",
    title: "Costa atlántica y Essaouira",
    pill: "Chófer privado",
    desc: "De Marrakech al Atlántico: murallas de Essaouira, puerto pesquero, argán en ruta y puesta de sol sobre la laguna de Oualidia.",
    price: 365,
    duration: "5 días / 4 noches",
  },
];

export const moreTours: Tour[] = [
  {
    image: "/images/tour-fez.jpg",
    alt: "Callejón cubierto de los zocos de la medina de Fez",
    badge: "5% de descuento",
    title: "Fez y la medina eterna",
    pill: "Guía incluida",
    desc: "Dos días en Fez el-Bali, la mayor medina peatonal del mundo: curtidores, madrasas y artesanos del cuero y la cerámica.",
    price: 298,
    duration: "3 días / 2 noches",
  },
  {
    image: "/images/tour-kasbahs.jpg",
    alt: "Kasbahs de adobe en el valle del Dadès",
    badge: "10% de descuento",
    title: "La ruta de las mil kasbahs",
    pill: "4x4 privado",
    desc: "Aït Ben Haddou, el valle del Dadès y las gargantas del Todra en un circuito por las fortalezas de adobe del sur marroquí.",
    price: 590,
    duration: "5 días / 4 noches",
  },
  {
    image: "/images/tour-sahara-lux.jpg",
    alt: "Campamento de lujo entre las dunas del Sáhara",
    badge: "8% de descuento",
    title: "Sáhara premium: campamento de lujo",
    pill: "Jaima de lujo",
    desc: "Campamento privado entre dunas con baño en suite, gastronomía bereber y observación de estrellas con astrónomo local.",
    price: 890,
    duration: "4 días / 3 noches",
  },
  {
    image: "/images/tour-gastronomia.jpg",
    alt: "Especias y puestos de color en los zocos de Marrakech",
    badge: "5% de descuento",
    title: "Sabores de Marrakech",
    pill: "Clase de cocina",
    desc: "Ruta gastronómica por los zocos, taller de tajín y pastela con una chef local y cena en la azotea de un riad histórico.",
    price: 95,
    duration: "1 día",
  },
];

export type HomepageContent = {
  heroImage: string;
  heroAlt: string;
  heroTitle: string;
  activitiesTitle: string;
  featuredTours: Tour[];
  moreTours: Tour[];
};

const homeTour = (
  source: Tour,
  title: string,
  desc: string,
  pill: string,
): Tour => ({
  ...source,
  badge: "Experiencia local",
  title,
  desc,
  pill,
});

const desertAgafay = homeTour(
  featuredTours[2],
  "Atardecer y cena en el desierto de Agafay",
  "Recorre el paisaje rocoso de Agafay en 4x4, contempla la puesta de sol y disfruta una cena marroquí bajo las estrellas.",
  "Salida desde Marrakech",
);
const desertZagora = homeTour(
  moreTours[1],
  "Ruta de kasbahs hasta Zagora",
  "Viaja por el Alto Atlas y el valle del Draa hasta Zagora, con paradas en pueblos de adobe y palmerales históricos.",
  "Ruta por el valle del Draa",
);
const desertMerzouga = homeTour(
  featuredTours[0],
  "Dunas y noche en Merzouga",
  "Cruza las dunas de Erg Chebbi al atardecer, comparte una cena bereber y duerme en una jaima bajo el cielo del Sáhara.",
  "Guía y campamento incluidos",
);
const cityMarrakech = homeTour(
  featuredTours[1],
  "Marrakech: medina, palacios y zocos",
  "Descubre la medina con guía local, visita sus palacios y recorre los zocos con tiempo para saborear la ciudad.",
  "Guía local incluido",
);
const foodMarrakech = homeTour(
  moreTours[3],
  "Sabores y cena en Marrakech",
  "Prueba especialidades locales, aprende a preparar un tajín y termina la velada con una cena en una terraza tradicional.",
  "Experiencia gastronómica",
);
const coastSaidia = homeTour(
  featuredTours[3],
  "Días de costa desde Saidia",
  "Disfruta del litoral mediterráneo marroquí con tiempo para pasear junto al mar y descubrir los sabores de la región.",
  "Costa mediterránea",
);
const privateKasbahs = homeTour(
  moreTours[1],
  "Ruta privada por las kasbahs",
  "Diseña el recorrido a tu ritmo con vehículo privado, paradas a medida y visitas a las fortalezas de adobe del sur.",
  "Vehículo privado",
);
const privateSahara = homeTour(
  moreTours[2],
  "Noche privada en el Sáhara",
  "Vive una estancia exclusiva entre las dunas con campamento privado, cena bereber y observación de estrellas.",
  "Experiencia privada",
);
const airportMarrakech = homeTour(
  featuredTours[1],
  "Traslado desde el aeropuerto de Marrakech",
  "Organiza la llegada a tu alojamiento con recogida coordinada en el aeropuerto y transporte directo hasta tu destino.",
  "Recogida coordinada",
);
const airportCoast = homeTour(
  featuredTours[3],
  "Traslado privado a tu alojamiento",
  "Continúa tu viaje con un traslado reservado para tu grupo entre el aeropuerto, la ciudad y tu alojamiento.",
  "Servicio puerta a puerta",
);
const dinnerShow = homeTour(
  moreTours[3],
  "Cena marroquí con espectáculo",
  "Disfruta de platos tradicionales y música en directo en una velada inspirada en la hospitalidad marroquí.",
  "Cena y música en directo",
);
const riadStay = homeTour(
  moreTours[0],
  "Estancia en un riad de la medina",
  "Alójate en una casa tradicional con patio interior y explora a pie los talleres, mercados y monumentos de la medina.",
  "Alojamiento con encanto",
);
const desertCampStay = homeTour(
  moreTours[2],
  "Campamento bajo las estrellas",
  "Pasa la noche en un campamento del desierto, con cena local y un amanecer tranquilo entre las dunas.",
  "Noche en jaima",
);
const hammamMarrakech = homeTour(
  moreTours[3],
  "Hammam tradicional en Marrakech",
  "Reserva una pausa de bienestar con ritual de hammam y productos tradicionales en un ambiente tranquilo.",
  "Ritual tradicional",
);
const hammamRiad = homeTour(
  moreTours[0],
  "Bienestar y descanso en un riad",
  "Combina una estancia en la medina con tiempo para relajarte y disfrutar de la hospitalidad de un riad marroquí.",
  "Descanso en la medina",
);

const FILTERED_HOMEPAGE_CONTENT: Record<string, HomepageContent> = {
  desierto: {
    heroImage: "/images/hero.jpg",
    heroAlt: "Paisaje del sur de Marruecos entre dunas, palmeras y kasbahs de adobe",
    heroTitle: "Aventura entre las dunas y los oasis del desierto marroquí.",
    activitiesTitle: "Excursiones por el desierto",
    featuredTours: [desertAgafay, desertZagora, desertMerzouga, privateSahara],
    moreTours: [desertZagora, desertMerzouga, desertAgafay, privateKasbahs],
  },
  agafay: {
    heroImage: "/images/tour-atlas.jpg",
    heroAlt: "Sendero entre montañas y pueblos bereberes del Alto Atlas",
    heroTitle: "Vive el paisaje abierto y las noches estrelladas de Agafay.",
    activitiesTitle: "Experiencias en Agafay",
    featuredTours: [desertAgafay, foodMarrakech, privateSahara, cityMarrakech],
    moreTours: [desertAgafay, desertMerzouga, foodMarrakech, cityMarrakech],
  },
  zagora: {
    heroImage: "/images/tour-kasbahs.jpg",
    heroAlt: "Kasbahs de adobe en el valle del Dadès",
    heroTitle: "Sigue la ruta de las kasbahs hasta el valle del Draa.",
    activitiesTitle: "Excursiones a Zagora",
    featuredTours: [desertZagora, desertMerzouga, privateKasbahs, desertAgafay],
    moreTours: [desertZagora, privateSahara, desertMerzouga, privateKasbahs],
  },
  merzouga: {
    heroImage: "/images/tour-merzouga.jpg",
    heroAlt: "Dunas del Erg Chebbi al atardecer en Merzouga",
    heroTitle: "Una noche en jaima bajo las estrellas de Merzouga.",
    activitiesTitle: "Experiencias en Merzouga",
    featuredTours: [desertMerzouga, privateSahara, desertZagora, privateKasbahs],
    moreTours: [desertMerzouga, privateSahara, desertAgafay, desertZagora],
  },
  "salidas-desde": {
    heroImage: "/images/tour-ciudades.jpg",
    heroAlt: "Plaza de Jemaa el-Fna y la medina de Marrakech",
    heroTitle: "Encuentra tu próxima excursión con salida desde Marruecos.",
    activitiesTitle: "Salidas desde Marrakech y Saidia",
    featuredTours: [cityMarrakech, coastSaidia, desertAgafay, desertZagora],
    moreTours: [foodMarrakech, desertMerzouga, coastSaidia, airportMarrakech],
  },
  marrakech: {
    heroImage: "/images/tour-gastronomia.jpg",
    heroAlt: "Especias y puestos de color en los zocos de Marrakech",
    heroTitle: "Explora la medina y los sabores de Marrakech.",
    activitiesTitle: "Excursiones desde Marrakech",
    featuredTours: [cityMarrakech, foodMarrakech, desertAgafay, desertZagora],
    moreTours: [airportMarrakech, desertMerzouga, privateKasbahs, foodMarrakech],
  },
  saidia: {
    heroImage: "/images/tour-costa.jpg",
    heroAlt: "Barcas azules en el puerto pesquero de Essaouira",
    heroTitle: "Descubre la costa mediterránea y sus paisajes.",
    activitiesTitle: "Experiencias con salida desde Saidia",
    featuredTours: [coastSaidia, cityMarrakech, privateKasbahs, desertAgafay],
    moreTours: [coastSaidia, airportCoast, cityMarrakech, foodMarrakech],
  },
  "excursiones-privadas": {
    heroImage: "/images/tour-sahara-lux.jpg",
    heroAlt: "Campamento de lujo entre las dunas del Sáhara",
    heroTitle: "Rutas privadas para viajar a tu propio ritmo.",
    activitiesTitle: "Excursiones privadas",
    featuredTours: [privateKasbahs, privateSahara, cityMarrakech, coastSaidia],
    moreTours: [privateSahara, privateKasbahs, airportMarrakech, desertAgafay],
  },
  "traslados-aeropuerto": {
    heroImage: "/images/tour-ciudades.jpg",
    heroAlt: "Plaza de Jemaa el-Fna y la medina de Marrakech",
    heroTitle: "Llega con tranquilidad y continúa directo a tu alojamiento.",
    activitiesTitle: "Traslados de aeropuerto",
    featuredTours: [airportMarrakech, airportCoast, cityMarrakech, coastSaidia],
    moreTours: [airportCoast, airportMarrakech, privateKasbahs, cityMarrakech],
  },
  "cena-espectaculo": {
    heroImage: "/images/tour-gastronomia.jpg",
    heroAlt: "Especias y puestos de color en los zocos de Marrakech",
    heroTitle: "Una velada marroquí entre sabores, música y tradición.",
    activitiesTitle: "Cenas y espectáculos",
    featuredTours: [dinnerShow, foodMarrakech, cityMarrakech, desertMerzouga],
    moreTours: [foodMarrakech, dinnerShow, riadStay, hammamMarrakech],
  },
  hoteles: {
    heroImage: "/images/tour-fez.jpg",
    heroAlt: "Callejón cubierto de los zocos de la medina de Fez",
    heroTitle: "Alójate en un riad o duerme bajo las estrellas del Sáhara.",
    activitiesTitle: "Alojamientos con encanto",
    featuredTours: [riadStay, desertCampStay, cityMarrakech, privateSahara],
    moreTours: [desertCampStay, riadStay, hammamRiad, desertMerzouga],
  },
  "hammam-y-spa": {
    heroImage: "/images/tour-fez.jpg",
    heroAlt: "Callejón cubierto de los zocos de la medina de Fez",
    heroTitle: "Haz una pausa y disfruta de los rituales de bienestar marroquíes.",
    activitiesTitle: "Hammam y bienestar",
    featuredTours: [hammamMarrakech, hammamRiad, riadStay, foodMarrakech],
    moreTours: [hammamRiad, hammamMarrakech, riadStay, cityMarrakech],
  },
};

export function getHomepageContent(filter?: string): HomepageContent {
  if (!filter) {
    return {
      heroImage: "/images/hero.jpg",
      heroAlt: "Paisaje del sur de Marruecos entre dunas, palmeras y kasbahs de adobe",
      heroTitle: "El Sáhara y Marruecos, donde el silencio también se escucha.",
      activitiesTitle: "Destacados",
      featuredTours,
      moreTours,
    };
  }

  return FILTERED_HOMEPAGE_CONTENT[filter] ?? getHomepageContent();
}
