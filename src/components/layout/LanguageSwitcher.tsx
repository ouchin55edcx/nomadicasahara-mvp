"use client";

import {useLocale, useTranslations} from "next-intl";

import {Link, usePathname} from "@/i18n/navigation";
import {routing, type Locale} from "@/i18n/routing";

/**
 * Switches locale while keeping the current pathname, so
 * /es/excursiones-marruecos → /en/excursiones-marruecos.
 */
export default function LanguageSwitcher({className = ""}: {className?: string}) {
  const t = useTranslations("languages");
  const common = useTranslations("common");
  const activeLocale = useLocale();
  const pathname = usePathname();

  return (
    <div
      className={`flex items-center gap-3 text-[13px] ${className}`}
      aria-label={common("selectLanguage")}
    >
      {routing.locales.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale as Locale}
          hrefLang={locale}
          aria-current={locale === activeLocale ? "true" : undefined}
          className={
            locale === activeLocale
              ? "font-semibold text-brand underline underline-offset-[3px]"
              : "text-current/60 transition-colors hover:text-current"
          }
        >
          {t(locale)}
        </Link>
      ))}
    </div>
  );
}
