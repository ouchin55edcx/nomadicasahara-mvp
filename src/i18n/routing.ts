import {defineRouting} from "next-intl/routing";

// Locales + locale prefix policy.
// To localize pathnames later (e.g. /es/excursiones vs /en/tours), add a
// `pathnames` map here — next-intl then handles hrefs, alternates and redirects.
export const routing = defineRouting({
  locales: ["es", "en", "pt"],
  defaultLocale: "es",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

/**
 * Concrete params for the `[locale]` segment. Pages that sit directly inside
 * `[locale]` need their own `generateStaticParams` to be prerendered per
 * locale (a layout-level one is only inherited by deeper dynamic segments).
 */
export const localeStaticParams = () =>
  routing.locales.map((locale) => ({locale}));
