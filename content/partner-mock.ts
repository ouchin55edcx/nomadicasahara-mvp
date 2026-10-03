/* ------------------------------------------------------------------ *
 *  Nomadica Sahara · Partner portal — mock data
 *  All data is static. No network, no database.
 * ------------------------------------------------------------------ */

export type BookingStatus =
  | "Pendiente"
  | "Confirmada"
  | "Completada"
  | "Cancelada"
  | "Cancelación solicitada";
export type ProductStatus = "Activo" | "Borrador" | "Pausado";
export type PaymentStatus = "Pagado" | "Pendiente" | "Reembolsado";
export type PayoutStatus = "Pagado" | "Procesando" | "Pendiente";

/** Ordering used for the status filter tabs. */
export const BOOKING_STATUSES: BookingStatus[] = [
  "Pendiente",
  "Confirmada",
  "Completada",
  "Cancelada",
];

export type BookingSort = "actividad" | "reserva";

export const BOOKING_SORT_OPTIONS: { value: BookingSort; label: string }[] = [
  { value: "actividad", label: "Fecha de actividad" },
  { value: "reserva", label: "Fecha de reserva" },
];


export type Traveler = { name: string; documentType: string; documentNumber: string };
export type BookingExtra = { name: string; price: number };
export type TimelineTone = "default" | "success" | "danger" | "muted";
export type TimelineEvent = { date: string; title: string; description: string; tone: TimelineTone };

export type PaymentInfo = {
  amount: number;
  method: string;
  status: PaymentStatus;
  commission: number;
  net: number;
};

export type Booking = {
  id: string;
  customer: { name: string; email: string; phone: string; country: string };
  productId: string;
  productTitle: string;
  image: string;
  date: string; // YYYY-MM-DD
  time: string;
  pickupPoint: string;
  guests: number;
  adults: number;
  children: number;
  total: number;
  status: BookingStatus;
  createdAt: string; // YYYY-MM-DD
  source: string;
  payment: PaymentInfo;
  extras: BookingExtra[];
  travelers: Traveler[];
  specialRequests: string;
  notes: string;
  timeline: TimelineEvent[];
};


export type PartnerProduct = {
  id: string;
  title: string;
  slug: string;
  city: "Marrakech" | "Essaouira";
  category: string;
  price: number;
  childPrice: number;
  status: ProductStatus;
  bookingsCount: number;
  rating: number;
  reviewsCount: number;
  views: number;
  conversion: number; // %
  image: string;
  duration: string;
  groupSize: number;
  languages: string[];
  pickup: string;
  defaultTime: string;
  capacity: number;
  daysOfWeek: string[]; // "Lun"…"Dom"
  cutoffTime: string;
  cancellationPolicy: string;
  shortDescription: string;
};

export type Payout = {
  id: string;
  date: string;
  amount: number;
  status: PayoutStatus;
  method: string;
};

export type TransactionType = "Ingreso" | "Comisión" | "Reembolso";

export type Transaction = {
  id: string;
  date: string;
  description: string;
  reference: string;
  type: TransactionType;
  amount: number; // signed
};

export type Review = {
  id: string;
  author: string;
  product: string;
  rating: number;
  date: string;
  comment: string;
  replied: boolean;
};

/* ----------------------------- Partner ----------------------------- */

export const PARTNER = {
  name: "Rutas del Sáhara",
  contact: "Youssef El Amrani",
  email: "partner@nomadicasahara.com",
  initials: "YE",
  role: "Partner verificado",
  since: "2019",
  location: "Marrakech, Marruecos",
  bank: {
    holder: "Rutas del Sahara EURL",
    iban: "MA64 0115 1800 0000 0000 0012 34",
    bank: "CIH Bank — Marrakech",
    method: "Transferencia internacional",
    frequency: "Semanal (martes)",
  },
} as const;

export const CITIES = ["Marrakech", "Essaouira"] as const;
export const CATEGORIES = [
  "Cultura",
  "Desierto",
  "Naturaleza",
  "Aventura",
  "Gastronomía",
  "Costa",
  "Deportes",
  "Circuito",
] as const;
export const LANGUAGES = ["Español", "Inglés", "Francés", "Alemán", "Árabe", "Italiano"] as const;
export const WEEK_DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"] as const;
export const CANCELLATION_POLICIES = [
  "Cancelación gratuita hasta 24 h antes",
  "Cancelación gratuita hasta 48 h antes",
  "Cancelación gratuita hasta 7 días antes",
  "No reembolsable",
] as const;
export const TIME_SLOTS = ["08:00", "09:30", "11:00", "14:00", "16:30", "18:00"] as const;

/* ----------------------------- Products ---------------------------- */

export const products: PartnerProduct[] = [
  {
    id: "p1",
    title: "Medina de Marrakech: tour gastronómico al atardecer",
    slug: "marrakech-medina-tour-gastronomico",
    city: "Marrakech",
    category: "Gastronomía",
    price: 49,
    childPrice: 29,
    status: "Activo",
    bookingsCount: 128,
    rating: 4.8,
    reviewsCount: 64,
    views: 3420,
    conversion: 3.7,
    image: "/images/tour-gastronomia.jpg",
    duration: "3 h",
    groupSize: 12,
    languages: ["Español", "Inglés", "Francés"],
    pickup: "Hotel Riad Yasmine, Medina",
    defaultTime: "17:30",
    capacity: 12,
    daysOfWeek: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
    cutoffTime: "18:00",
    cancellationPolicy: "Cancelación gratuita hasta 24 h antes",
    shortDescription: "Callejones, zocos y sabores: recorrido por la medina con catadura de té y pasteles.",
  },
  {
    id: "p2",
    title: "Merzouga:2 noches en el desierto con jaima privada",
    slug: "merzouga-desierto-jaima-privada",
    city: "Marrakech",
    category: "Desierto",
    price: 289,
    childPrice: 189,
    status: "Activo",
    bookingsCount: 96,
    rating: 4.9,
    reviewsCount: 51,
    views: 5210,
    conversion: 1.8,
    image: "/images/tour-merzouga.jpg",
    duration: "3 días / 2 noches",
    groupSize: 16,
    languages: ["Español", "Francés"],
    pickup: "Puerta del Omran, Marrakech",
    defaultTime: "07:30",
    capacity: 16,
    daysOfWeek: ["Lun", "Mié", "Vie", "Sáb"],
    cutoffTime: "16:00",
    cancellationPolicy: "Cancelación gratuita hasta 7 días antes",
    shortDescription: "Travesía al Erg Chebbi, paseo en dromedario y cena bereber bajo las estrellas.",
  },
  {
    id: "p3",
    title: "Atlas y kasbahs en 4x4 desde Marrakech",
    slug: "atlas-kasbahs-4x4-marrakech",
    city: "Marrakech",
    category: "Aventura",
    price: 120,
    childPrice: 75,
    status: "Activo",
    bookingsCount: 74,
    rating: 4.6,
    reviewsCount: 39,
    views: 2780,
    conversion: 2.7,
    image: "/images/tour-kasbahs.jpg",
    duration: "10 h",
    groupSize: 8,
    languages: ["Español", "Alemán"],
    pickup: "Residencia Ait Fes, Marrakech",
    defaultTime: "08:00",
    capacity: 8,
    daysOfWeek: ["Mar", "Jue", "Sáb", "Dom"],
    cutoffTime: "20:00",
    cancellationPolicy: "Cancelación gratuita hasta 48 h antes",
    shortDescription: "Valle del Ourika, Ait Ben Haddou y Tiout en vehículo 4x4 con guía local.",
  },
  {
    id: "p4",
    title: "Ait Ben Haddou y Ouarzazate en un día",
    slug: "ait-ben-haddou-ouarzazate",
    city: "Marrakech",
    category: "Cultura",
    price: 85,
    childPrice: 55,
    status: "Activo",
    bookingsCount: 61,
    rating: 4.7,
    reviewsCount: 28,
    views: 2140,
    conversion: 2.9,
    image: "/images/banner-kasbahs.jpg",
    duration: "12 h",
    groupSize: 18,
    languages: ["Español", "Inglés", "Italiano"],
    pickup: "Hammam de la medina, Marrakech",
    defaultTime: "07:00",
    capacity: 18,
    daysOfWeek: ["Lun", "Mié", "Vie", "Dom"],
    cutoffTime: "17:00",
    cancellationPolicy: "Cancelación gratuita hasta 48 h antes",
    shortDescription: "El kasbah filmado por Hollywood y las tiendas de cine de Ouarzazate.",
  },
  {
    id: "p5",
    title: "Essaouira y costa atlántica: escapada de un día",
    slug: "essaouira-costa-atlantica-escapada",
    city: "Essaouira",
    category: "Costa",
    price: 65,
    childPrice: 40,
    status: "Activo",
    bookingsCount: 54,
    rating: 4.5,
    reviewsCount: 31,
    views: 1980,
    conversion: 2.7,
    image: "/images/tour-costa.jpg",
    duration: "1 día",
    groupSize: 20,
    languages: ["Español", "Francés"],
    pickup: "Place des Épices, Marrakech",
    defaultTime: "08:30",
    capacity: 20,
    daysOfWeek: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
    cutoffTime: "19:00",
    cancellationPolicy: "Cancelación gratuita hasta 24 h antes",
    shortDescription: "Murallas, puerto azul y atardecer sobre el Atlántico con parada en argán.",
  },
  {
    id: "p6",
    title: "Essaouira kitesurf: clase de iniciación",
    slug: "essaouira-kitesurf-iniciacion",
    city: "Essaouira",
    category: "Deportes",
    price: 75,
    childPrice: 75,
    status: "Activo",
    bookingsCount: 33,
    rating: 4.4,
    reviewsCount: 17,
    views: 1120,
    conversion: 2.9,
    image: "/images/dest-merzouga.jpg",
    duration: "2 h",
    groupSize: 6,
    languages: ["Español", "Francés"],
    pickup: "Playa de Essaouira, zona de escuela",
    defaultTime: "10:00",
    capacity: 6,
    daysOfWeek: ["Mar", "Jue", "Sáb"],
    cutoffTime: "20:00",
    cancellationPolicy: "Cancelación gratuita hasta 24 h antes",
    shortDescription: "Primera sesión de kitesurf con monitor titulado y equipo incluido.",
  },
  {
    id: "p7",
    title: "Camellos al amanecer en Agafay",
    slug: "camellos-amanecer-agafay",
    city: "Marrakech",
    category: "Naturaleza",
    price: 55,
    childPrice: 35,
    status: "Activo",
    bookingsCount: 87,
    rating: 4.7,
    reviewsCount: 44,
    views: 2460,
    conversion: 3.5,
    image: "/images/tour-atlas.jpg",
    duration: "4 h",
    groupSize: 14,
    languages: ["Español", "Inglés"],
    pickup: "Hotel Sofitel, Marrakech",
    defaultTime: "06:00",
    capacity: 14,
    daysOfWeek: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    cutoffTime: "21:00",
    cancellationPolicy: "Cancelación gratuita hasta 24 h antes",
    shortDescription: "Desierto de Agafay, té con los nómadas y amanecer sobre el Atlas.",
  },
  {
    id: "p8",
    title: "Puertos y medina de Essaouira a pie",
    slug: "puertos-medina-essaouira-pie",
    city: "Essaouira",
    category: "Cultura",
    price: 39,
    childPrice: 20,
    status: "Activo",
    bookingsCount: 45,
    rating: 4.6,
    reviewsCount: 23,
    views: 1340,
    conversion: 3.4,
    image: "/images/banner-essaouira.jpg",
    duration: "2 h 30 m",
    groupSize: 12,
    languages: ["Español", "Alemán"],
    pickup: "Puerta de Bab Marrakech, Essaouira",
    defaultTime: "10:30",
    capacity: 12,
    daysOfWeek: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
    cutoffTime: "18:00",
    cancellationPolicy: "Cancelación gratuita hasta 24 h antes",
    shortDescription: "Skala del puerto, barrio de los gatos y talleres de marroquinería.",
  },
  {
    id: "p9",
    title: "Safi y costas blancas: ruta de los ceramistas",
    slug: "safi-costas-blancas-ceramistas",
    city: "Essaouira",
    category: "Cultura",
    price: 95,
    childPrice: 60,
    status: "Pausado",
    bookingsCount: 18,
    rating: 4.3,
    reviewsCount: 9,
    views: 640,
    conversion: 2.8,
    image: "/images/tour-fez.jpg",
    duration: "1 día",
    groupSize: 10,
    languages: ["Español"],
    pickup: "Puerta de Bab Marrakech, Essaouira",
    defaultTime: "08:00",
    capacity: 10,
    daysOfWeek: ["Jue", "Sáb"],
    cutoffTime: "17:00",
    cancellationPolicy: "Cancelación gratuita hasta 48 h antes",
    shortDescription: "Cerámica azul, pescadores y acantilados entre Safi y Oualidia.",
  },
  {
    id: "p10",
    title: "Fez imperial:3 días desde Marrakech",
    slug: "fez-imperial-3-dias",
    city: "Marrakech",
    category: "Circuito",
    price: 420,
    childPrice: 290,
    status: "Borrador",
    bookingsCount: 0,
    rating: 0,
    reviewsCount: 0,
    views: 0,
    conversion: 0,
    image: "/images/tour-ciudades.jpg",
    duration: "3 días / 2 noches",
    groupSize: 14,
    languages: ["Español", "Francés"],
    pickup: "Por definir",
    defaultTime: "07:30",
    capacity: 14,
    daysOfWeek: ["Vie", "Dom"],
    cutoffTime: "16:00",
    cancellationPolicy: "Cancelación gratuita hasta 7 días antes",
    shortDescription: "Bou Inania, tannerías, medina y vuelo interior incluido.",
  },
];

export const productById: Record<string, PartnerProduct> = Object.fromEntries(
  products.map((p) => [p.id, p]),
);

/* ----------------------------- Bookings ---------------------------- */

type Seed = {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  productId: string;
  date: string;
  guests: number;
  children?: number;
  total: number;
  status: BookingStatus;
  createdAt: string;
  source: string;
  notes?: string;
  specialRequests?: string;
};

const seeds: Seed[] = [
  { id: "NS-2026-0101", name: "Lucía Fernández", email: "lucia.fernandez@gmail.com", phone: "+34 611 220 341", country: "España", productId: "p1", date: "2026-07-04", guests: 2, total: 98, status: "Completada", createdAt: "2026-06-25", source: "Buscador web" },
  { id: "NS-2026-0102", name: "Marc Puig", email: "marc.puig@correu.cat", phone: "+34 622 771 008", country: "España", productId: "p5", date: "2026-07-11", guests: 4, children: 1, total: 225, status: "Cancelada", createdAt: "2026-07-01", source: "Instagram", notes: "Cancelación por enfermedad del menor. Reembolso íntegro emitido el 08/07." },
  { id: "NS-2026-0103", name: "Anne Moreau", email: "anne.moreau@orange.fr", phone: "+33 6 12 44 87 21", country: "Francia", productId: "p2", date: "2026-07-18", guests: 2, total: 578, status: "Completada", createdAt: "2026-06-30", source: "Google Ads" },
  { id: "NS-2026-0104", name: "Klaus Weber", email: "k.weber@web.de", phone: "+49 151 2345 8890", country: "Alemania", productId: "p3", date: "2026-07-23", guests: 3, total: 360, status: "Confirmada", createdAt: "2026-07-05", source: "Agencia partner" },
  { id: "NS-2026-0105", name: "Sofía Navarro", email: "sofia.navarro@outlook.es", phone: "+34 633 908 117", country: "España", productId: "p7", date: "2026-07-30", guests: 2, total: 110, status: "Completada", createdAt: "2026-07-20", source: "Buscador web" },
  { id: "NS-2026-0106", name: "Emma Wilson", email: "emma.wilson@gmail.co.uk", phone: "+44 7700 900 123", country: "Reino Unido", productId: "p4", date: "2026-08-02", guests: 2, total: 170, status: "Cancelada", createdAt: "2026-07-14", source: "Recomendación", notes: "Cancelaron por retraso del vuelo. Se ofreció cambio de fecha sin coste." },
  { id: "NS-2026-0107", name: "Karim Benali", email: "k.benali@mail.ma", phone: "+212 6 61 22 44 88", country: "Marruecos", productId: "p1", date: "2026-08-08", guests: 6, total: 294, status: "Completada", createdAt: "2026-08-01", source: "WhatsApp", notes: "Grupo de celebración de cumpleaños. Pedían mesa aparte en el último local.", specialRequests: "Grupo de cumpleaños:-needed table apart and a cake with the \" happy birthday\" inscription." },
  { id: "NS-2026-0108", name: "Pablo Serrano", email: "pablo.serrano@icloud.com", phone: "+34 677 410 552", country: "España", productId: "p6", date: "2026-08-15", guests: 2, total: 150, status: "Confirmada", createdAt: "2026-07-28", source: "Buscador web" },
  { id: "NS-2026-0109", name: "Chloé Dubois", email: "chloe.dubois@free.fr", phone: "+33 6 78 90 12 34", country: "Francia", productId: "p8", date: "2026-08-21", guests: 2, total: 78, status: "Completada", createdAt: "2026-08-12", source: "Instagram" },
  { id: "NS-2026-0110", name: "Javier Lorenzo", email: "javier.lorenzo@gmail.com", phone: "+34 699 334 221", country: "España", productId: "p9", date: "2026-08-27", guests: 2, total: 190, status: "Cancelada", createdAt: "2026-08-05", source: "Buscador web", notes: "Cancelaron tras anunciar cierre temporal de la ruta. Reembolsado el 10/08." },
  { id: "NS-2026-0111", name: "Marta Iglesias", email: "marta.iglesias@yahoo.es", phone: "+34 610 552 118", country: "España", productId: "p2", date: "2026-09-04", guests: 4, total: 1156, status: "Completada", createdAt: "2026-08-10", source: "Recomendación", notes: "Luna llena: les tocó jaima con terraza.", specialRequests: "Luna llena: les tocó jaima con terraza." },
  { id: "NS-2026-0112", name: "Oliver Grant", email: "o.grant@gmail.co.uk", phone: "+44 7700 900 771", country: "Reino Unido", productId: "p3", date: "2026-10-10", guests: 2, total: 240, status: "Cancelada", createdAt: "2026-08-20", source: "Google Ads", notes: "Cancelación dentro del plazo gratuito." },
  { id: "NS-2026-0113", name: "Nadia Haddad", email: "nadia.haddad@menara.ma", phone: "+212 6 70 11 22 33", country: "Marruecos", productId: "p7", date: "2026-10-12", guests: 3, total: 165, status: "Pendiente", createdAt: "2026-09-28", source: "WhatsApp" },
  { id: "NS-2026-0114", name: "Sergio Molina", email: "sergio.molina@gmail.com", phone: "+34 654 118 990", country: "España", productId: "p1", date: "2026-10-16", guests: 2, total: 98, status: "Confirmada", createdAt: "2026-09-19", source: "Buscador web" },
  { id: "NS-2026-0115", name: "Irene Robles", email: "irene.robles@outlook.es", phone: "+34 622 019 445", country: "España", productId: "p4", date: "2026-10-18", guests: 5, children: 2, total: 335, status: "Pendiente", createdAt: "2026-09-30", source: "Instagram", specialRequests: "Dos niños pequeños: necesitan sillas de coche en el vehículo." },
  { id: "NS-2026-0116", name: "Lucas Martín", email: "lucas.martin@gmail.com", phone: "+34 688 552 330", country: "España", productId: "p5", date: "2026-10-21", guests: 2, total: 130, status: "Confirmada", createdAt: "2026-09-22", source: "Buscador web" },
  { id: "NS-2026-0117", name: "Fatima Zahra", email: "f.zahra@gmail.com", phone: "+212 6 55 44 33 22", country: "Marruecos", productId: "p8", date: "2026-10-24", guests: 4, total: 156, status: "Pendiente", createdAt: "2026-10-01", source: "Recomendación" },
  { id: "NS-2026-0118", name: "Andrés Gil", email: "andres.gil@icloud.com", phone: "+34 600 771 225", country: "España", productId: "p2", date: "2026-10-29", guests: 2, total: 578, status: "Confirmada", createdAt: "2026-09-15", source: "Google Ads", notes: "Pedían jaima adyacente para pareja de amigos.", specialRequests: "Pedían jaima adyacente para pareja de amigos." },
  { id: "NS-2026-0119", name: "Laura Campos", email: "laura.campos@gmail.com", phone: "+34 611 908 447", country: "España", productId: "p6", date: "2026-11-03", guests: 1, total: 75, status: "Pendiente", createdAt: "2026-10-01", source: "Instagram" },
  { id: "NS-2026-0120", name: "Tomás Ferreira", email: "tomas.ferreira@sapo.pt", phone: "+351 912 345 678", country: "Portugal", productId: "p3", date: "2026-11-07", guests: 4, total: 480, status: "Confirmada", createdAt: "2026-09-24", source: "Agencia partner" },
  { id: "NS-2026-0121", name: "Elena Duarte", email: "elena.duarte@gmail.com", phone: "+34 677 002 119", country: "España", productId: "p1", date: "2026-11-12", guests: 3, total: 147, status: "Pendiente", createdAt: "2026-10-02", source: "Buscador web" },
  { id: "NS-2026-0122", name: "Hugo Blanchard", email: "hugo.blanchard@laposte.net", phone: "+33 6 45 67 89 01", country: "Francia", productId: "p4", date: "2026-11-15", guests: 2, total: 170, status: "Confirmada", createdAt: "2026-09-26", source: "Google Ads" },
  { id: "NS-2026-0123", name: "Rosa Cano", email: "rosa.cano@yahoo.es", phone: "+34 645 112 887", country: "España", productId: "p7", date: "2026-11-21", guests: 2, total: 110, status: "Pendiente", createdAt: "2026-10-02", source: "Recomendación" },
  { id: "NS-2026-0124", name: "Miguel Ángel Ruiz", email: "miguel.ruiz@gmail.com", phone: "+34 699 887 001", country: "España", productId: "p5", date: "2026-11-28", guests: 6, children: 3, total: 325, status: "Confirmada", createdAt: "2026-09-29", source: "Agencia partner", notes: "Autobús compartido con reserva NS-2026-0122 pendiente de confirmar.", specialRequests: "Uno de los viajeros cumple años durante la excursión." },
  { id: "NS-2026-0125", name: "Giulia Ferrari", email: "giulia.ferrari@libero.it", phone: "+39 340 112 2334", country: "Italia", productId: "p2", date: "2026-12-05", guests: 2, total: 578, status: "Pendiente", createdAt: "2026-10-02", source: "Buscador web" },
];

const travelerPool = [
  "Carlos Ruiz Vega", "Ana Belén Soto", "Diego Marín Luna", "Paula Ortega Ríos",
  "Enrique Vidal Sáez", "Marina Costa Blay", "Rubén Alcázar Peña", "Teresa Nogales Gil",
  "Óscar Jiménez Prat", "Beatriz Herrera Ossa",
];

const paymentMethods = ["Visa •••• 4242", "Mastercard •••• 5511", "Bizum", "PayPal", "Visa •••• 1883"];

const extraPool: BookingExtra[] = [
  { name: "Transfer privado aeropuerto", price: 25 },
  { name: "Guía privada en español", price: 35 },
  { name: "Cena bereber en el desierto", price: 30 },
  { name: "Seguro de anulación", price: 18 },
];

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function buildTimeline(s: Seed): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      date: `${s.createdAt} 09:14`,
      title: "Reserva creada",
      description: `Reserva recibida desde ${s.source}.`,
      tone: "default",
    },
  ];

  if (s.status === "Pendiente") {
    events.push({
      date: `${s.createdAt} 09:15`,
      title: "Pago pendiente",
      description: "Esperando la confirmación del pago del cliente.",
      tone: "muted",
    });
    events.push({
      date: `${s.createdAt} 09:16`,
      title: "Reserva enviada al partner",
      description: "Tienes 24 h para confirmar o rechazar la reserva.",
      tone: "default",
    });
    return events;
  }

  events.push({
    date: `${s.createdAt} 09:15`,
    title: "Pago recibido",
    description: `Importe abonado con éxito. Comisión Nomadica deducida.`,
    tone: "success",
  });

  if (s.status === "Cancelada") {
    events.push({
      date: `${addDays(s.createdAt, 2)} 12:40`,
      title: "Cancelación solicitada",
      description: "El cliente solicitó cancelar la reserva dentro del plazo gratuito.",
      tone: "danger",
    });
    events.push({
      date: `${addDays(s.createdAt, 2)} 13:05`,
      title: "Reembolso emitido",
      description: "Reembolso íntegro procesado al medio de pago original.",
      tone: "success",
    });
    return events;
  }

  events.push({
    date: `${addDays(s.createdAt, 1)} 10:02`,
    title: "Reserva confirmada",
    description: "Confirmada por el partner. Voucher enviado al cliente.",
    tone: "success",
  });

  if (s.status === "Completada") {
    events.push({
      date: `${s.date} 19:30`,
      title: "Tour finalizado",
      description: "El guía marcó la excursión como completada.",
      tone: "success",
    });
    events.push({
      date: `${addDays(s.date, 1)} 08:10`,
      title: "Valoración recibida",
      description: "El cliente dejó una valoración de5 estrellas.",
      tone: "success",
    });
  }

  return events;
}

export const bookings: Booking[] = seeds.map((s, i) => {
  const product = productById[s.productId];
  const children = s.children ?? 0;
  const commission = Math.round(s.total * 0.15 * 100) / 100;
  const paymentStatus: PaymentStatus =
    s.status === "Cancelada" ? "Reembolsado" : s.status === "Pendiente" ? "Pendiente" : "Pagado";

  const travelers: Traveler[] = Array.from({ length: s.guests }, (_, t) => ({
    name: t === 0 ? s.name : travelerPool[(i + t) % travelerPool.length],
    documentType: (i + t) % 3 === 0 ? "Pasaporte" : "DNI",
    documentNumber:
      (i + t) % 3 === 0
        ? `X${(1234567 + i * 13 + t).toString().slice(0, 6)}`
        : `${11111111 + i * 137 + t * 7}Z`,
  }));

  const extras = extraPool.slice(0, i % 4);

  return {
    id: s.id,
    customer: { name: s.name, email: s.email, phone: s.phone, country: s.country },
    productId: s.productId,
    productTitle: product.title,
    image: product.image,
    date: s.date,
    time: product.defaultTime,
    pickupPoint: product.pickup,
    guests: s.guests,
    adults: s.guests - children,
    children,
    total: s.total,
    status: s.status,
    createdAt: s.createdAt,
    source: s.source,
    payment: {
      amount: s.total,
      method: paymentMethods[i % paymentMethods.length],
      status: paymentStatus,
      commission,
      net: Math.round((s.total - commission) * 100) / 100,
    },
    extras,
    travelers,
    specialRequests: s.specialRequests ?? "",
    notes: s.notes ?? "",
    timeline: buildTimeline(s),
  };
});

export function getBookingById(id: string): Booking | undefined {
  return bookings.find((b) => b.id === id);
}

/** Count per status for a given slice — powers the filter tabs. */
export function countByStatus(list: Booking[]): Record<BookingStatus, number> {
  return list.reduce(
    (acc, b) => {
      acc[b.status] = (acc[b.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<BookingStatus, number>,
  );
}

/* -------------------------- Chart datasets ------------------------- */

const dateLabel = (offset: number) => {
  const d = new Date("2026-10-02T12:00:00Z");
  d.setUTCDate(d.getUTCDate() - (29 - offset));
  return `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
};

/** Ingresos de los últimos30 días (03/09 → 02/10/2026). */
export const revenueLast30Days = Array.from({ length: 30 }, (_, i) => ({
  label: dateLabel(i),
  value: 210 + Math.round(140 * Math.sin(i / 2.6) + (i * 17) % 160 + (i % 5) * 24),
}));

export const monthLabels = ["Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic", "Ene", "Feb", "Mar"];

export const earningsByMonth = [
  { label: "Abr", value: 4120 }, { label: "May", value: 5380 },
  { label: "Jun", value: 6210 }, { label: "Jul", value: 7890 },
  { label: "Ago", value: 8440 }, { label: "Sep", value: 6750 },
  { label: "Oct", value: 5980 }, { label: "Nov", value: 6320 },
  { label: "Dic", value: 4870 }, { label: "Ene", value: 3960 },
  { label: "Feb", value: 4410 }, { label: "Mar", value: 5240 },
];

export const bookingsByMonth = [
  { label: "Abr", value: 38 }, { label: "May", value: 47 },
  { label: "Jun", value: 55 }, { label: "Jul", value: 71 },
  { label: "Ago", value: 76 }, { label: "Sep", value: 58 },
  { label: "Oct", value: 49 }, { label: "Nov", value: 53 },
  { label: "Dic", value: 41 }, { label: "Ene", value: 33 },
  { label: "Feb", value: 36 }, { label: "Mar", value: 44 },
];

export const conversionByMonth = [
  { label: "Abr", value: 2.4 }, { label: "May", value: 2.8 },
  { label: "Jun", value: 3.1 }, { label: "Jul", value: 3.6 },
  { label: "Ago", value: 3.9 }, { label: "Sep", value: 3.2 },
  { label: "Oct", value: 3.0 }, { label: "Nov", value: 3.3 },
  { label: "Dic", value: 2.7 }, { label: "Ene", value: 2.2 },
  { label: "Feb", value: 2.5 }, { label: "Mar", value: 2.9 },
];

export const revenueByProduct = [
  { label: "Merzouga jaima", value: 18400 },
  { label: "Atlas 4x4", value: 9820 },
  { label: "Camellos Agafay", value: 7650 },
  { label: "Ait Ben Haddou", value: 6210 },
  { label: "Essaouira1día", value: 5180 },
];

export const clientOrigins = [
  { label: "España", value: 45 },
  { label: "Francia", value: 18 },
  { label: "Alemania", value: 12 },
  { label: "Reino Unido", value: 9 },
  { label: "Otros", value: 16 },
];

/* ------------------------- Partner UI datasets ---------------------- */

export const CANCELLATION_REASONS = [
  "El guía no puede operar esa fecha",
  "Excursión completa / overbooking",
  "Condiciones meteorológicas adversas",
  "Problema de seguridad en la zona",
  "Solicitud del cliente",
  "Otro motivo",
] as const;

export type BookingEmailTemplate = {
  id: string;
  label: string;
  subject: string;
  body: string;
};

export const bookingEmailTemplates: BookingEmailTemplate[] = [
  {
    id: "confirmacion",
    label: "Confirmación de reserva",
    subject: "Reserva confirmada — {{producto}}",
    body: "Hola {{viajero}},\n\nTu reserva está confirmada.\n\nExcursión: {{producto}}\nFecha: {{fecha}}\nHora de inicio: {{hora}}\nPunto de recogida: {{recogida}}\nViajeros: {{pax}}\nReferencia: {{id}}\n\nAdjuntamos el voucher. Cualquier duda, responde a este correo.\n\nUn saludo,\n{{partner}}",
  },
  {
    id: "recordatorio",
    label: "Recordatorio de actividad",
    subject: "Tu excursión es mañana — {{producto}}",
    body: "Hola {{viajero}},\n\nTe recordamos que tu excursión es mañana {{fecha}} a las {{hora}}.\n\nPunto de recogida: {{recogida}}\nTe recomendamos llegar 15 minutos antes.\n\nUn saludo,\n{{partner}}",
  },
  {
    id: "punto_encuentro",
    label: "Punto de encuentro",
    subject: "Dónde y cuándo nos vemos — {{id}}",
    body: "Hola {{viajero}},\n\nTe confirmamos el punto de encuentro para la reserva {{id}}:\n\n{{recogida}}\nHora: {{hora}}\n\nEl guía te esperará con un cartel de Nomadica Sahara.\n\nUn saludo,\n{{partner}}",
  },
  {
    id: "agradecimiento",
    label: "Agradecimiento y reseña",
    subject: "Gracias por viajar con nosotros",
    body: "Hola {{viajero}},\n\nGracias por confiar en nosotros durante tu excursión.\n\nSi tienes un minuto, te agradeceríamos una reseña: ayuda a otros viajeros a elegir.\n\nUn abrazo,\n{{partner}}",
  },
];

export const partnerNotifications = [
  {
    id: "n1",
    title: "Nueva reserva pendiente",
    body: "NS-2026-0125 · Merzouga, 2 noches en el desierto",
    time: "Hace 2 min",
    href: "/dashboard/bookings/NS-2026-0125",
  },
  {
    id: "n2",
    title: "Pago en proceso",
    body: "Payout PG-2026-0147 por 760 € se Liberia el martes",
    time: "Hace 1 h",
    href: "/dashboard/finance",
  },
  {
    id: "n3",
    title: "Nueva reseña de 5★",
    body: "Carmen Ibáñez sobre Merzouga: 2 noches en el desierto",
    time: "Ayer",
    href: "/dashboard/performance",
  },
] as const;

/* -------------------------- Dashboard bits -------------------------- */

export const upcomingDepartures = bookings
  .filter((b) => (b.status === "Confirmada" || b.status === "Pendiente") && b.date >= "2026-10-02")
  .sort((a, b) => a.date.localeCompare(b.date))
  .slice(0, 6)
  .map((b) => ({
    id: b.id,
    date: b.date,
    time: b.time,
    title: b.productTitle,
    guests: b.guests,
    status: b.status,
  }));

export const topProducts = [...products]
  .sort((a, b) => b.bookingsCount - a.bookingsCount)
  .slice(0, 5);

export const dashboardStats = {
  revenue: { value: "5.980 €", trend: "+12,4 %", positive: true, hint: "vs. 5.320 € en septiembre" },
  bookings: { value: "49", trend: "+8,1 %", positive: true, hint: "17 pendientes de confirmar" },
  occupancy: { value: "78 %", trend: "-3,2 %", positive: false, hint: "media de las próximas4 semanas" },
  rating: { value: "4,7", trend: "+0,1", positive: true, hint: "132 valoraciones" },
};

/* ------------------------------ Finance ---------------------------- */

export const financeStats = {
  available: { value: "4.820 €", trend: "+6,2 %", positive: true, hint: "disponible inmediato" },
  pending: { value: "1.960 €", trend: "3 salidas", positive: true, hint: "se liberan al completar" },
  paidMonth: { value: "3.250 €", trend: "+11,0 %", positive: true, hint: "pagado en octubre" },
  commission: { value: "780 €", trend: "15 %", positive: false, hint: "comisión Nomadica del mes" },
};

export const payouts: Payout[] = [
  { id: "PG-2026-0142", date: "2026-09-30", amount: 1240, status: "Pagado", method: "Transferencia ••34" },
  { id: "PG-2026-0138", date: "2026-09-23", amount: 980, status: "Pagado", method: "Transferencia ••34" },
  { id: "PG-2026-0131", date: "2026-09-16", amount: 1420, status: "Pagado", method: "Transferencia ••34" },
  { id: "PG-2026-0147", date: "2026-10-07", amount: 760, status: "Procesando", method: "Transferencia ••34" },
  { id: "PG-2026-0149", date: "2026-10-14", amount: 640, status: "Pendiente", method: "Transferencia ••34" },
  { id: "PG-2026-0126", date: "2026-09-09", amount: 1105, status: "Pagado", method: "Transferencia ••34" },
];

export const transactions: Transaction[] = [
  { id: "TX-8841", date: "2026-10-02", description: "Reserva Merzouga jaima privada", reference: "NS-2026-0125", type: "Ingreso", amount: 578 },
  { id: "TX-8840", date: "2026-10-02", description: "Comisión Nomadica (15 %)", reference: "NS-2026-0125", type: "Comisión", amount: -86.7 },
  { id: "TX-8836", date: "2026-10-01", description: "Reserva tour gastronómico", reference: "NS-2026-0121", type: "Ingreso", amount: 147 },
  { id: "TX-8835", date: "2026-10-01", description: "Comisión Nomadica (15 %)", reference: "NS-2026-0121", type: "Comisión", amount: -22.05 },
  { id: "TX-8829", date: "2026-09-30", description: "Reserva camellos Agafay", reference: "NS-2026-0113", type: "Ingreso", amount: 165 },
  { id: "TX-8821", date: "2026-09-29", description: "Reserva Essaouira1día", reference: "NS-2026-0124", type: "Ingreso", amount: 325 },
  { id: "TX-8820", date: "2026-09-29", description: "Comisión Nomadica (15 %)", reference: "NS-2026-0124", type: "Comisión", amount: -48.75 },
  { id: "TX-8814", date: "2026-09-26", description: "Reserva Ait Ben Haddou", reference: "NS-2026-0122", type: "Ingreso", amount: 170 },
  { id: "TX-8808", date: "2026-09-24", description: "Reserva Atlas y kasbahs4x4", reference: "NS-2026-0120", type: "Ingreso", amount: 480 },
  { id: "TX-8802", date: "2026-09-22", description: "Reserva Essaouira y costa", reference: "NS-2026-0116", type: "Ingreso", amount: 130 },
  { id: "TX-8795", date: "2026-09-21", description: "Reembolso reserva cancelada", reference: "NS-2026-0112", type: "Reembolso", amount: -240 },
  { id: "TX-8790", date: "2026-09-19", description: "Reserva tour gastronómico", reference: "NS-2026-0114", type: "Ingreso", amount: 98 },
];

/* ---------------------------- Performance -------------------------- */

export const performanceRows = products.map((p) => ({
  id: p.id,
  title: p.title,
  views: p.views,
  bookings: p.bookingsCount,
  conversion: p.conversion,
  rating: p.rating,
}));

export const reviewsSummary = {
  average: 4.7,
  total: 190,
  distribution: [
    { stars: 5, count: 132 },
    { stars: 4, count: 41 },
    { stars: 3, count: 11 },
    { stars: 2, count: 4 },
    { stars: 1, count: 2 },
  ],
  latest: [
    { id: "r1", author: "Carmen Ibáñez", product: "Merzouga:2 noches en el desierto", rating: 5, date: "2026-09-28", comment: "El guía Hamid hizo que fuera mágico. La jaima tenía una cama increíble y la cena, de cine.", replied: false },
    { id: "r2", author: "Stefan Müller", product: "Atlas y kasbahs en4x4", rating: 4, date: "2026-09-25", comment: "Muy buen recorrido, aunque el día se hizo largo sin parada para comer. Repetiríamos igualmente.", replied: false },
    { id: "r3", author: "Ana Paredes", product: "Medina de Marrakech: tour gastronómico", rating: 5, date: "2026-09-21", comment: "Los3 locales elegidos eran auténticos y el anfitrión explicaba cada plato con detalle.", replied: true },
    { id: "r4", author: "Julien Petit", product: "Essaouira y costa atlántica", rating: 4, date: "2026-09-18", comment: "Buen día de playa y murallas. La parada de argán se hizo un poco larga.", replied: false },
    { id: "r5", author: "Mónica Salas", product: "Camellos al amanecer en Agafay", rating: 5, date: "2026-09-15", comment: "Amanecer perfecto con vistas al Atlas. Puntuales y muy amables.", replied: false },
  ],
} as const;

/* --------------------------- Availability -------------------------- */

export type DayState = "disponible" | "pocas" | "completo" | "bloqueado";

export type DayAvailability = {
  date: string; // YYYY-MM-DD
  day: number;
  weekday: number; // 0 = lunes … 6 = domingo
  state: DayState;
  remaining: number;
  capacity: number;
  price: number;
  past: boolean;
};

function daySeed(productId: string, iso: string): number {
  let h = 7;
  for (const ch of `${productId}:${iso}`) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

const TODAY = "2026-10-02";

/** Deterministic per-day availability for a product/month. */
export function getMonthAvailability(
  product: Pick<PartnerProduct, "id" | "capacity" | "price">,
  year: number,
  monthIndex: number,
): DayAvailability[] {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const out: DayAvailability[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const iso = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const weekday = (new Date(`${iso}T12:00:00Z`).getUTCDay() + 6) % 7; // 0 = lun
    const seed = daySeed(product.id, iso);
    const full = product.capacity;
    let remaining = seed % (full + 1);
    let state: DayState =
      remaining === 0 ? "completo" : remaining <= Math.max(1, Math.ceil(full * 0.2)) ? "pocas" : "disponible";

    if (seed % 11 === 0) state = "bloqueado";
    if (state === "bloqueado") remaining = 0;

    out.push({
      date: iso,
      day,
      weekday,
      state,
      remaining,
      capacity: full,
      price: product.price,
      past: iso < TODAY,
    });
  }

  return out;
}
