import type {L10n} from "@/types/tour-catalog";

export type TourCategory = "desert" | "saidia-beach" | "private-tours" | "transfers" | "dinner-shows" | "hammam-spa" | "circuits";
export type TourCity = "agafay" | "zagora" | "merzouga" | "marrakech";

export const categories: Record<TourCategory, {slug: Record<"en" | "es" | "pt", string>; name: L10n; description: L10n; image: string; tourIds: string[]}> = {
  desert: {slug: {en: "desert", es: "desierto", pt: "deserto"}, name: {en: "Desert", es: "Desierto", pt: "Deserto"}, description: {en: "Desert experiences across Agafay, Zagora and Merzouga.", es: "Experiencias entre Agafay, Zagora y Merzouga.", pt: "Experiências entre Agafay, Zagora e Merzouga."}, image: "/images/hero.jpg", tourIds: ["agafay-sunset-dinner", "zagora-2-days", "merzouga-3-days", "agafay-quad-camel-dinner", "sahara-5-days"]},
  "saidia-beach": {slug: {en: "saidia-beach", es: "playa-saidia", pt: "praia-saidia"}, name: {en: "Saidia Beach", es: "Playa de Saïdia", pt: "Praia de Saïdia"}, description: {en: "A single place to explore the Mediterranean coast around Saïdia.", es: "Un único espacio para descubrir la costa mediterránea de Saïdia.", pt: "Um só espaço para descobrir a costa mediterrânica de Saïdia."}, image: "/images/tour-costa.jpg", tourIds: ["saidia-beach-getaway"]},
  "private-tours": {slug: {en: "private-tours", es: "tours-privados", pt: "passeios-privados"}, name: {en: "Private Tours", es: "Tours privados", pt: "Passeios privados"}, description: {en: "Private excursions with a route shaped around your group.", es: "Excursiones privadas con una ruta adaptada a tu grupo.", pt: "Passeios privados com um percurso adaptado ao seu grupo."}, image: "/images/tour-sahara-lux.jpg", tourIds: ["marrakech-private-city", "ouzoud-private-day"]},
  transfers: {slug: {en: "transfers", es: "traslados", pt: "transfers"}, name: {en: "Airport Transfers", es: "Traslados aeropuerto", pt: "Transfers aeroporto"}, description: {en: "Pre-arranged airport connections in Marrakech.", es: "Traslados coordinados desde y hacia el aeropuerto de Marrakech.", pt: "Transfers coordenados de e para o aeroporto de Marraquexe."}, image: "/images/tour-ciudades.jpg", tourIds: ["marrakech-airport-transfer"]},
  "dinner-shows": {slug: {en: "dinner-shows", es: "cenas-espectaculo", pt: "jantares-espetaculo"}, name: {en: "Dinner Shows", es: "Cenas con espectáculo", pt: "Jantares com espetáculo"}, description: {en: "Evenings with Moroccan food, music and live performances.", es: "Veladas con cocina marroquí, música y actuaciones en directo.", pt: "Serões com cozinha marroquina, música e espetáculos ao vivo."}, image: "/images/tour-gastronomia.jpg", tourIds: ["agafay-sunset-dinner", "agafay-quad-camel-dinner", "fantasia-dinner-show"]},
  "hammam-spa": {slug: {en: "hammam-spa", es: "hammam-spa", pt: "hammam-spa"}, name: {en: "Hammam & Spa", es: "Hammam y spa", pt: "Hammam e spa"}, description: {en: "Traditional hammam rituals and massage experiences in Marrakech.", es: "Rituales de hammam tradicional y masajes en Marrakech.", pt: "Rituais de hammam tradicional e massagens em Marraquexe."}, image: "/images/hammam-wellness.jpg", tourIds: ["hammam-massage", "hammam-traditional"]},
  circuits: {slug: {en: "circuits", es: "circuitos", pt: "circuitos"}, name: {en: "Multi-Day Tours", es: "Circuitos de varios días", pt: "Circuitos de vários dias"}, description: {en: "Multi-day routes through Morocco's cities, valleys and desert.", es: "Rutas de varios días por ciudades, valles y desiertos de Marruecos.", pt: "Percursos de vários dias por cidades, vales e desertos de Marrocos."}, image: "/images/tour-kasbahs.jpg", tourIds: ["zagora-2-days", "merzouga-3-days", "marrakech-fes-4-days", "sahara-5-days"]},
};

export const cities: Record<TourCity, {slug: Record<"en" | "es" | "pt", string>; name: L10n; description: L10n; image: string; tourIds: string[]}> = {
  agafay: {slug: {en: "agafay", es: "agafay", pt: "agafay"}, name: {en: "Agafay", es: "Agafay", pt: "Agafay"}, description: {en: "Explore the rocky desert and evening experiences of Agafay.", es: "Descubre el desierto rocoso y las experiencias al atardecer de Agafay.", pt: "Explore o deserto rochoso e as experiências ao fim do dia em Agafay."}, image: "/images/tour-atlas.jpg", tourIds: ["agafay-sunset-dinner", "agafay-quad-camel-dinner"]},
  zagora: {slug: {en: "zagora", es: "zagora", pt: "zagora"}, name: {en: "Zagora", es: "Zagora", pt: "Zagora"}, description: {en: "Follow the Draa Valley and the desert route to Zagora.", es: "Recorre el valle del Draa y la ruta del desierto hasta Zagora.", pt: "Siga o vale do Draa e a rota do deserto até Zagora."}, image: "/images/tour-kasbahs.jpg", tourIds: ["zagora-2-days"]},
  merzouga: {slug: {en: "merzouga", es: "merzouga", pt: "merzouga"}, name: {en: "Merzouga", es: "Merzouga", pt: "Merzouga"}, description: {en: "Discover Erg Chebbi and the Sahara routes around Merzouga.", es: "Descubre Erg Chebbi y las rutas del Sáhara alrededor de Merzouga.", pt: "Descubra Erg Chebbi e as rotas do Saara em redor de Merzouga."}, image: "/images/tour-merzouga.jpg", tourIds: ["merzouga-3-days", "sahara-5-days"]},
  marrakech: {slug: {en: "marrakech", es: "marrakech", pt: "marraquexe"}, name: {en: "Marrakech", es: "Marrakech", pt: "Marraquexe"}, description: {en: "Find city walks, wellness, dining and departures from Marrakech.", es: "Encuentra visitas, bienestar, cenas y salidas desde Marrakech.", pt: "Descubra visitas, bem-estar, jantares e partidas de Marraquexe."}, image: "/images/tour-ciudades.jpg", tourIds: ["marrakech-private-city", "fantasia-dinner-show", "hammam-massage", "hammam-traditional", "marrakech-airport-transfer", "ouzoud-private-day", "marrakech-fes-4-days"]},
};

export function categoryFromSlug(locale: "en" | "es" | "pt", slug: string): TourCategory | undefined {
  return (Object.keys(categories) as TourCategory[]).find((key) => categories[key].slug[locale] === slug);
}

export function cityFromSlug(locale: "en" | "es" | "pt", slug: string): TourCity | undefined {
  return (Object.keys(cities) as TourCity[]).find((key) => cities[key].slug[locale] === slug);
}

export function categoryFromAnySlug(slug: string): TourCategory | undefined {
  return (Object.keys(categories) as TourCategory[]).find((key) => Object.values(categories[key].slug).includes(slug));
}

export function cityFromAnySlug(slug: string): TourCity | undefined {
  return (Object.keys(cities) as TourCity[]).find((key) => Object.values(cities[key].slug).includes(slug));
}
