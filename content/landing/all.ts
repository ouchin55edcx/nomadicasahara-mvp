import type {
  FaqItem,
  PageContent,
  QuickFact,
  SeoBlock,
  TrustItem,
  Tile,
} from "./types";

const labels = {
  priceFrom: "Precio desde",
  duration: "Duración",
  languages: "Idiomas",
  cancellation: "Cancelación",
} as const;

export type AllContent = PageContent & {
  whyTiles: Tile[];
};

// Variante PT: "viagens em Marraquexe" / "catálogo completo"
export const allContent: AllContent = {
  slug: "/",
  seo: {
    title: "Viajes y excursiones en Marruecos desde 27 €",
    description:
      "Catálogo completo de viajes en Marruecos: desierto, Atlas, costa y ciudades imperiales desde Marrakech. Desde 27 € con guía oficial.",
    canonical: "/",
    keywords: "viajes Marruecos, excursiones Marrakech, desierto Atlas, tours Agadir",
    ogImage: "/images/hero.jpg",
    updatedAt: "2026-09-14",
  },
  quickFacts: [
    { label: labels.priceFrom, value: "27 €" },
    { label: labels.duration, value: "Medio día a 8 días" },
    { label: labels.languages, value: "Español, inglés, francés, árabe" },
    { label: labels.cancellation, value: "Gratuita hasta 30 días" },
  ],
  whyTiles: [
    {
      title: "Guía oficial en español",
      description: "Todos los guías están acreditados y hablan español o inglés.",
      icon: "guide",
    },
    {
      title: "Grupos pequeños",
      description: "Máximo 15 personas por vehículo. Si vienes solo, no pagas el doble.",
      icon: "users",
    },
    {
      title: "Cancelación gratuita",
      description: "Hasta 30 días antes en la mayoría de excursiones.",
      icon: "shield",
    },
    {
      title: "Precio transparente",
      description: "Entradas, transporte y guía incluidos en el precio.",
      icon: "tag",
    },
    {
      title: "Pago flexible",
      description: "El 25 % al reservar y el resto hasta 48 horas antes.",
      icon: "wallet",
    },
    {
      title: "Soporte en español",
      description: "Estamos en WhatsApp de 8:00 a 22:00 todos los días.",
      icon: "chat",
    },
  ],
  trust: [
    { title: "Agencia con licencia", description: "Licencia de turismo y seguro de responsabilidad civil." },
    { title: "Atención en español", description: "WhatsApp de 8:00 a 22:00, todos los días del año." },
    { title: "Precios en euros", description: "Pagas en euros, sin cambios de moneda local." },
    { title: "Reserva flexible", description: "El 25 % al reservar y el resto hasta 48 horas antes." },
  ],
  faq: [
    {
      question: "¿Cuánto cuesta un viaje en Marruecos?",
      answer:
        "Las excursiones de medio día empiezan en 27 € y las de varios días van de 120 a 3200 € por persona. Los viajes privados se cotizan por vehículo.",
    },
    {
      question: "¿Los guías hablan español?",
      answer:
        "Sí, la mayoría de nuestros guías hablan español. En cada ficha puedes ver los idiomas disponibles y pedir un guía en español al reservar.",
    },
    {
      question: "¿Cómo se paga?",
      answer:
        "En euros por tarjeta, PayPal o transferencia. En la mayoría de excursiones pagas el 25 % al reservar y el resto hasta 48 horas antes.",
    },
    {
      question: "¿Qué pasa si llueve o hay tormentas?",
      answer:
        "Los globos se vuelan con viento suave: si no es seguro, se cambia a un 4x4 o se devuelve el importe. El guía te avisa la noche anterior.",
    },
    {
      question: "¿Puedo combinar varios viajes?",
      answer:
        "Sí. Los paquetes combinados evitan el traslado de volta entre destinos y suelen salir más baratos.",
    },
  ],
  seoText: {
    heading: "Cómo organizar un viaje en Marruecos desde Marrakech",
    intro:
      "Marrakech es el mejor punto de partida del país: en una hora estás en el desierto, en dos en el Atlántico y en cinco en el Sahara profundo. Esta es la guía para elegir sin perder tiempo.",
    sections: [
      {
        heading: "Qué hacer el primer día",
        body: [
          "Llega, deja las maletas y empieza por la medina: el Jardín Majorelle por la mañana, cuando todavía no hay colas, y los zocos a mediodía. La primera noche prueba un tagine en el centro y reserva ya el hammam.",
          "No programes el desierto el primer día. El vuelo puede retrasarse y el viaje al desierto es largo: mejor empezar el día siguiente.",
        ],
      },
      {
        heading: "Cuántos días para cada zona",
        body: [
          "Para el desierto cercano de Agafay basta con un día. Merzouga y Zagora necesitan dos o tres, con una noche en jaima. La costa de Essaouira y Saidia se disfruta con un día o dos.",
          "Si tienes cinco días o más, el Atlas merece un día de trekking con Imlil. Los pueblos del Alto Atlas están a una hora de la ciudad.",
        ],
      },
      {
        heading: "Fragmento em português",
        body: [
          "Marrakech é o melhor ponto de partida para viajar no Marrocos: a uma hora está o deserto de Agafay, a duas horas a costa atlântica e a cinco o Saara profundo.",
          "Os passeios começam em 27 € com guia oficial, entrada incluída e cancelamento gratuito até 30 dias antes. Os pagamentos são feitos em euros.",
        ],
      },
    ],
  },
  cta: {
    title: "¿Listo para el desierto?",
    body: "Dinos las fechas y te proponemos la mejor ruta para tu tiempo y tu presupuesto.",
    ctaLabel: "Hablar por WhatsApp",
  },
  stickyCta: { label: "Ver todos los viajes", priceFrom: 27 },
};