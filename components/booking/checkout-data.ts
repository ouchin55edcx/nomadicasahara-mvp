import { z } from "zod";

/* ------------------------------------------------------------------ *
 *  Nomadica Sahara · Checkout
 *  Paleta, tokens de estilo, esquema (zod) y datos mock de la reserva.
 * ------------------------------------------------------------------ */

export const ui = {
  card: "rounded-md border border-[#E5E5E5] bg-white p-5 md:p-6",
  sectionTitle: "text-[17px] font-semibold text-[#1A1A1A]",
  sectionLead: "mt-1 text-sm text-[#222]/70",
  label: "text-xs font-medium text-[#222]",
  input:
    "h-12 w-full rounded-sm border border-[#E5E5E5] bg-white px-3 text-sm text-[#222] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#66B600] focus:ring-2 focus:ring-[#66B600]/30",
  select:
    "h-12 w-full rounded-sm border border-[#E5E5E5] bg-white px-3 text-sm text-[#222] outline-none transition-colors focus:border-[#66B600] focus:ring-2 focus:ring-[#66B600]/30",
  button:
    "h-12 rounded-sm bg-[#66B600] px-6 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#559A00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  error: "text-xs font-medium text-[#D93025]",
  muted: "text-xs leading-relaxed text-[#222]/70",
  divider: "border-t border-[#E5E5E5]",
} as const;

const eur = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
export const money = (amount: number) => eur.format(amount);

/* ----------------------------- Precios ----------------------------- */

export const PRICING = {
  travelers: 2,
  basePerPerson: 438,
  baseTotal: 876,
  taxes: 42,
  total: 918,
  upfront: 183.6, // 20 % de señal
  rest: 734.4,
  paymentDeadline: "01/11/2026",
  departureDate: "16/11/2026",
  refundableUntil: "11/11/2026",
  offerCountdown: "44:23",
} as const;

/* ------------------------- Extras del viaje ------------------------ */

export type TourExtra = {
  id: string;
  title: string;
  description: string;
  price: number;
  badge?: "NUEVO" | "OPCIONAL";
};

export const tourExtras: TourExtra[] = [
  {
    id: "transfer",
    title: "Transfer privado aeropuerto → alojamiento",
    description:
      "Recogida en el Aeropuerto Menara de Marrakech con conductor privado, agua a bordo y ayuda con el equipaje hasta la puerta del riad.",
    price: 25,
    badge: "OPCIONAL",
  },
  {
    id: "guia",
    title: "Guía privada de habla española",
    description:
      "Acompañamiento profesional durante la visita a la medina, las kasbahs y los monumentos de Marrakech y Fez.",
    price: 45,
    badge: "NUEVO",
  },
  {
    id: "seguro",
    title: "Seguro de cancelación Premium",
    description:
      "Reembolso íntegro del viaje por motivos médicos, familiares o laborales acreditados, hasta 48 horas antes de la salida.",
    price: 38,
    badge: "OPCIONAL",
  },
  {
    id: "cena",
    title: "Cena bereber bajo las estrellas",
    description:
      "Cena tradicional con música gnawa junto al fuego en el campamento del desierto del Erg Chebbi.",
    price: 29,
  },
  {
    id: "dromedario",
    title: "Paseo en dromedario al amanecer",
    description: "Travesía de 45 minutos por las dunas del Erg Chebbi con guía local y fotografías incluidas.",
    price: 22,
  },
];

/* ------------------------- Viajeros (mock) ------------------------- */

export const mockTravelers = [
  { id: "viajero-1", label: "Viajero 1 — adulto" },
  { id: "viajero-2", label: "Viajero 2 — adulto" },
];

/* --------------------- Resumen de la reserva ----------------------- */

export type Stay = {
  image: string;
  title: string;
  rating: number;
  address: string;
  dates: string;
  occupancy: string;
  refundNote: string;
};

export type Segment = {
  id: string;
  day: string;
  departTime: string;
  departCode: string;
  departName: string;
  arriveTime: string;
  arriveCode: string;
  arriveName: string;
  label: string;
  operator: string;
};

export const bookingSummary: { tour: Stay; stays: Stay[]; segments: Segment[] } = {
  tour: {
    image: "/images/tour-sahara-lux.jpg",
    title: "Ruta del Sáhara y las ciudades imperiales",
    rating: 5,
    address: "Marruecos · Marrakech – Merzouga – Essaouira",
    dates: "Lunes 16 noviembre → Domingo 22 noviembre",
    occupancy: "2 Adultos | Jaima privada y riads | Media pensión",
    refundNote: `Alojamiento reembolsable antes del ${PRICING.refundableUntil}`,
  },
  stays: [
    {
      image: "/images/tour-ciudades.jpg",
      title: "Riad Al Madina",
      rating: 3,
      address: "9 Rue Attarine, Essaouira",
      dates: "Miércoles 18 noviembre → Sábado 21 noviembre",
      occupancy: "2 Adultos | 1 Habitación Estándar | Desayuno incluido",
      refundNote: `Alojamiento reembolsable antes del ${PRICING.refundableUntil}`,
    },
    {
      image: "/images/tour-atlas.jpg",
      title: "Kasbah Du Toubkal",
      rating: 4,
      address: "Imlil, Alto Atlas",
      dates: "Sábado 21 noviembre → Domingo 22 noviembre",
      occupancy: "2 Adultos | 1 Habitación Deluxe | Desayuno incluido",
      refundNote: `Alojamiento reembolsable antes del ${PRICING.refundableUntil}`,
    },
  ],
  segments: [
    {
      id: "ida",
      day: "Lunes, 16 noviembre 2026",
      departTime: "08:00",
      departCode: "RAK",
      departName: "Aeropuerto Menara",
      arriveTime: "14:30",
      arriveCode: "MER",
      arriveName: "Erg Chebbi",
      label: "Traslado privado · 6 h 30 m",
      operator: "Operado por Saharan Drivers | Conductor privado y guía local",
    },
    {
      id: "vuelta",
      day: "Domingo, 22 noviembre 2026",
      departTime: "09:00",
      departCode: "MER",
      departName: "Erg Chebbi",
      arriveTime: "15:30",
      arriveCode: "RAK",
      arriveName: "Aeropuerto Menara",
      label: "Traslado compartido · 6 h 30 m",
      operator: "Operado por Saharan Drivers | Regreso al aeropuerto de Marrakech",
    },
  ],
};

/* --------------------------- Promociones --------------------------- */

export type Promo = {
  id: string;
  icon: "gift" | "ticket" | "calendar";
  tag: string;
  text: string;
};

export const promoList: Promo[] = [
  {
    id: "p1",
    icon: "gift",
    tag: "Regalo",
    text: "Bono de 40 € para tu próximo viaje con Nomadica Sahara. Válido durante 12 meses en reservas superiores a 300 €.",
  },
  {
    id: "p2",
    icon: "ticket",
    tag: "Cupón",
    text: "Hasta 400 € de descuento en viajes de más de 2.000 €. Canjeable en el paso de pago con el código NOMADICA400.",
  },
  {
    id: "p3",
    icon: "calendar",
    tag: "Financiación",
    text: "Paga en 6 meses sin intereses. Financiación ofrecida por nuestro partner financiero, E.F.C., S.A., y sujeta a su aprobación.",
  },
];

/* --------------------- Condiciones de cancelación ------------------ */

export type CancellationTier = { color: string; amount: number; when: string; width: number };

export const cancellationTiers: CancellationTier[] = [
  { color: "#66B600", amount: 91.8, when: "si cancelas antes del 01/11/2026", width: 34 },
  { color: "#8FC92E", amount: 183.6, when: "si cancelas entre el 02/11/2026 y el 08/11/2026", width: 16 },
  { color: "#D7E24A", amount: 275.4, when: "si cancelas entre el 09/11/2026 y el 15/11/2026", width: 16 },
  { color: "#F5D547", amount: 459, when: "si cancelas el 16/11/2026", width: 12 },
  { color: "#F5A623", amount: 642.6, when: "si cancelas el 17/11/2026", width: 12 },
  { color: "#E2574C", amount: 918, when: "si cancelas a partir del 18/11/2026", width: 10 },
];

/* --------------------------- Observaciones ------------------------- */

export const observationBlocks: { heading: string; paragraphs: string[] }[] = [
  {
    heading: "Verificación con nuestro operador local",
    paragraphs: [
      "Le informamos de que durante el proceso de reserva será necesario que verifiques los datos de los viajeros con nuestro operador en Marruecos. Este proceso es obligatorio y necesario para completar la reserva de los servicios contratados.",
      "En caso de rechazo de la estancia en el riad o hotel por no cumplir los requisitos, Nomadica Sahara no se hace responsable de los gastos ocasionados, ni de la reposición de las noches contratadas por el cliente.",
    ],
  },
  {
    heading: "Alojamientos",
    paragraphs: [
      "Riad Al Madina — Consulta las posibles restricciones en el país de destino. Cualquier impuesto turístico local debe ser pagado en el lugar directamente por los clientes, si corresponde. Check-in a partir de las 3:00 PM.",
      "Kasbah Du Toubkal — Consulta las posibles restricciones en el país de destino. Cualquier impuesto turístico local debe ser pagado en el lugar directamente por los clientes, si corresponde. Check-in a partir de las 3:00 PM.",
      "Las jaimas del desierto se ocupan a partir de las 4:00 PM y la salida debe realizarse antes de las 10:00 AM.",
    ],
  },
  {
    heading: "Documentación y traslados",
    paragraphs: [
      "A partir del 12 de noviembre de 2026 deberás presentar obligatoriamente tu documentación digital en el móvil o en formato impreso para acceder a los traslados y a la entrada de los recintos monumentales. Recomendamos descargarla antes del inicio del viaje.",
      "Es responsabilidad del viajero disponer de la documentación en regla necesaria para poder viajar al destino solicitado (pasaporte con una validez mínima de 6 meses, visados y vacunas exigidas por las autoridades marroquíes).",
    ],
  },
];

export const generalLinks = [
  "condiciones generales de la web",
  "formulario de información normalizada para servicios de viaje combinado",
  "condiciones de Nomadica Sahara",
  "condiciones del operador local",
  "condiciones de cancelación y devoluciones",
];

/* ------------------------------ Esquema ---------------------------- */

export const travelerSchema = z.object({
  id: z.string(),
  title: z.enum(["sr", "sra"], {
    required_error: "Selecciona el título",
    invalid_type_error: "Selecciona el título",
  }),
  firstName: z.string().min(1, "Introduce el nombre"),
  lastName: z.string().min(1, "Introduce los apellidos"),
  documentType: z.enum(["dni", "nie", "pasaporte", "conductor"], {
    required_error: "Selecciona el documento",
    invalid_type_error: "Selecciona el documento",
  }),
  documentNumber: z.string().min(6, "Introduce el número de documento"),
  documentExpiry: z.string().min(1, "Introduce la caducidad del documento"),
  nationality: z.string().min(1, "Selecciona la nacionalidad"),
  birthDate: z.string().min(1, "Introduce la fecha de nacimiento"),
  specialNeeds: z.boolean(),
});

export const checkoutSchema = z
  .object({
    holder: z.object({
      title: z.enum(["sr", "sra"], {
        required_error: "Selecciona el título",
        invalid_type_error: "Selecciona el título",
      }),
      firstName: z.string().min(1, "Introduce el nombre"),
      lastName: z.string().min(1, "Introduce los apellidos"),
      phone: z.string().min(9, "Introduce un teléfono móvil válido"),
      email: z.string().email("Introduce un email válido"),
      confirmEmail: z.string().email("Introduce un email válido"),
      postalCode: z.string().min(4, "Introduce el código postal"),
      wantsInvoice: z.boolean(),
    }),
    travelers: z.array(travelerSchema).min(1, "Introduce los datos de los viajeros"),
    // Clave compuesta `${extraId}_${viajeroId}` → activado o no
    extras: z.record(z.string(), z.boolean()),
    paymentPlan: z.enum(["anticipo", "unico", "financiado"], {
      required_error: "Elige una opción de pago",
      invalid_type_error: "Elige una opción de pago",
    }),
    paymentMethod: z.enum(["tarjeta", "alternativo"], {
      required_error: "Elige una forma de pago",
      invalid_type_error: "Elige una forma de pago",
    }),
    financingMonths: z.enum(["3", "6", "12"]),
    conditionsAccepted: z.boolean().refine((v) => v, {
      message: "Debes aceptar las condiciones generales para continuar",
    }),
    comment: z.string().max(500, "Máximo 500 caracteres").optional(),
  })
  .refine((data) => data.holder.email === data.holder.confirmEmail, {
    message: "Los emails no coinciden",
    path: ["holder", "confirmEmail"],
  });

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const defaultValues: CheckoutFormValues = {
  holder: {
    title: "sr",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    confirmEmail: "",
    postalCode: "",
    wantsInvoice: false,
  },
  travelers: mockTravelers.map((t) => ({
    id: t.id,
    title: "sr",
    firstName: "",
    lastName: "",
    documentType: "pasaporte",
    documentNumber: "",
    documentExpiry: "",
    nationality: "esp",
    birthDate: "",
    specialNeeds: false,
  })),
  extras: Object.fromEntries(
    tourExtras.flatMap((extra) => mockTravelers.map((t) => [`${extra.id}_${t.id}`, false])),
  ),
  paymentPlan: "anticipo",
  paymentMethod: "tarjeta",
  financingMonths: "6",
  conditionsAccepted: false,
  comment: "",
};
