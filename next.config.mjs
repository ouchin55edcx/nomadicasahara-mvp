import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const legacyRedirects = [];
const locales = ["en", "es", "pt"];
const categoryPaths = {
  desert: {en: "/tours/category/desert", es: "/excursiones/categoria/desierto", pt: "/passeios/categoria/deserto"},
  saidia: {en: "/tours/category/saidia-beach", es: "/excursiones/categoria/playa-saidia", pt: "/passeios/categoria/praia-saidia"},
  private: {en: "/tours/category/private-tours", es: "/excursiones/categoria/tours-privados", pt: "/passeios/categoria/passeios-privados"},
  transfers: {en: "/tours/category/transfers", es: "/excursiones/categoria/traslados", pt: "/passeios/categoria/transfers"},
  dinner: {en: "/tours/category/dinner-shows", es: "/excursiones/categoria/cenas-espectaculo", pt: "/passeios/categoria/jantares-espetaculo"},
  hammam: {en: "/tours/category/hammam-spa", es: "/excursiones/categoria/hammam-spa", pt: "/passeios/categoria/hammam-spa"},
  circuits: {en: "/tours/category/circuits", es: "/excursiones/categoria/circuitos", pt: "/passeios/categoria/circuitos"},
};
const cityPaths = {
  agafay: {en: "/tours/city/agafay", es: "/excursiones/destino/agafay", pt: "/passeios/cidade/agafay"},
  zagora: {en: "/tours/city/zagora", es: "/excursiones/destino/zagora", pt: "/passeios/cidade/zagora"},
  merzouga: {en: "/tours/city/merzouga", es: "/excursiones/destino/merzouga", pt: "/passeios/cidade/merzouga"},
  marrakech: {en: "/tours/city/marrakech", es: "/excursiones/destino/marrakech", pt: "/passeios/cidade/marraquexe"},
};
const legacyCategoryPaths = {
  "/excursiones-marruecos": {en: "/tours", es: "/excursiones", pt: "/passeios"},
  "/excursiones-desierto-marruecos": categoryPaths.desert,
  "/excursion-desierto-agafay": cityPaths.agafay,
  "/excursion-desierto-zagora": cityPaths.zagora,
  "/excursion-desierto-merzouga": cityPaths.merzouga,
  "/excursiones-marrakech": cityPaths.marrakech,
  "/excursiones-saidia": categoryPaths.saidia,
  "/excursiones-privadas-marruecos": categoryPaths.private,
  "/traslados-aeropuerto-marrakech": categoryPaths.transfers,
  "/cena-espectaculo-marrakech": categoryPaths.dinner,
  "/hammam-spa-marrakech": categoryPaths.hammam,
};
for (const locale of locales) {
  for (const [source, targets] of Object.entries(legacyCategoryPaths)) {
    legacyRedirects.push({source: `/${locale}${source}`, destination: `/${locale}${targets[locale]}`, permanent: true});
  }
  for (const city of ["agafay", "zagora", "merzouga", "marrakech"]) {
    legacyRedirects.push({source: `/${locale}/${city}`, destination: `/${locale}${cityPaths[city][locale]}`, permanent: true});
  }
  legacyRedirects.push({source: `/${locale}/saidia`, destination: `/${locale}${categoryPaths.saidia[locale]}`, permanent: true});
  legacyRedirects.push({source: `/${locale}/marrakech-tours`, destination: `/${locale}${cityPaths.marrakech[locale]}`, permanent: true});
  legacyRedirects.push({source: `/${locale}/essaouira-tours`, destination: `/${locale}${locale === "es" ? "/excursiones" : locale === "pt" ? "/passeios" : "/tours"}`, permanent: true});
  const legacyTours = [
    ["marrakech-tours", "agafay-quad", cityPaths.agafay[locale]],
    ["marrakech-tours", "marrakech-essaouira", cityPaths.marrakech[locale]],
    ["essaouira-tours", "essaouira-kitesurf", locale === "es" ? "/excursiones" : locale === "pt" ? "/passeios" : "/tours"],
  ];
  for (const [city, tour, target] of legacyTours) {
    legacyRedirects.push({source: `/${locale}/${city}/${tour}`, destination: `/${locale}${target}`, permanent: true});
    legacyRedirects.push({source: `/${locale}/${city}/${tour}/resumen`, destination: `/${locale}${target}`, permanent: true});
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  // Every indexable URL now carries a locale prefix (/es, /en, /pt), so the
  // pre-i18n paths are redirected once, permanently.
  async redirects() {
    return [
      ...legacyRedirects,
      {source: "/sobre-nosotros", destination: "/es/sobre-nosotros", permanent: true},
      {source: "/dashboard", destination: "/es/partner/dashboard", permanent: true},
      {
        source: "/dashboard/:path*",
        destination: "/es/partner/dashboard/:path*",
        permanent: true,
      },
      {source: "/partner/login", destination: "/es/partner/login", permanent: true},
    ];
  },
};

export default withNextIntl(nextConfig);
