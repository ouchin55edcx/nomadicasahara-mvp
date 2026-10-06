import {defineRouting} from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en", "pt"],
  defaultLocale: "es",
  localePrefix: "always",
  pathnames: {
    "/tours": {en: "/tours", es: "/excursiones", pt: "/passeios"},
    "/tours/category/[category]": {en: "/tours/category/[category]", es: "/excursiones/categoria/[category]", pt: "/passeios/categoria/[category]"},
    "/tours/city/[city]": {en: "/tours/city/[city]", es: "/excursiones/destino/[city]", pt: "/passeios/cidade/[city]"},
    "/tours/[slug]": {en: "/tours/[slug]", es: "/excursiones/[slug]", pt: "/passeios/[slug]"},
    "/tours/[slug]/offers": {en: "/tours/[slug]/offers", es: "/excursiones/[slug]/ofertas", pt: "/passeios/[slug]/ofertas"},
    "/tours/[slug]/offers/[offer]": {en: "/tours/[slug]/offers/[offer]", es: "/excursiones/[slug]/ofertas/[offer]", pt: "/passeios/[slug]/ofertas/[offer]"},
    "/book/[offerId]": {en: "/book/[offerId]", es: "/reservar/[offerId]", pt: "/reservar/[offerId]"},
    "/book/[offerId]/confirmation": {en: "/book/[offerId]/confirmation", es: "/reservar/[offerId]/confirmacion", pt: "/reservar/[offerId]/confirmacao"},
    "/about": {en: "/about", es: "/sobre-nosotros", pt: "/sobre"},
    "/contact": {en: "/contact", es: "/contacto", pt: "/contacto"},
    "/help": {en: "/help", es: "/ayuda", pt: "/ajuda"},
    "/terms": {en: "/terms", es: "/condiciones", pt: "/termos"},
    "/privacy": {en: "/privacy", es: "/privacidad", pt: "/privacidade"},
  },
});

export type Locale = (typeof routing.locales)[number];

/**
 * Concrete params for the `[locale]` segment. Pages that sit directly inside
 * `[locale]` need their own `generateStaticParams` to be prerendered per
 * locale (a layout-level one is only inherited by deeper dynamic segments).
 */
export const localeStaticParams = () =>
  routing.locales.map((locale) => ({locale}));
