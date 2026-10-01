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
