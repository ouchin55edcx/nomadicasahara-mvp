import {useLocale, useTranslations} from "next-intl";

import BrandLogo from "@/components/layout/BrandLogo";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import {Link} from "@/i18n/navigation";
import {categoryHref} from "@/lib/hrefs";
import type {Locale} from "@/i18n/routing";

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale() as Locale;

  const empresa = [
    {label: t("footer.company.about"), href: "/about" as const},
    {label: t("footer.company.becomePartner"), href: "/partner/login" as const},
    {label: t("footer.company.workWithUs"), href: "/contact" as const},
  ];
  const enlaces = [
    {label: t("footer.links.travelGuides"), href: "/help" as const},
    {label: t("footer.links.terms"), href: "/terms" as const},
    {label: t("footer.links.privacy"), href: "/privacy" as const},
  ];
  const footerNavigation = [
    {key: "desert", href: categoryHref("desert", locale)},
    {key: "saidiaBeach", href: categoryHref("saidia-beach", locale)},
    {key: "privateTours", href: categoryHref("private-tours", locale)},
    {key: "airportTransfers", href: categoryHref("transfers", locale)},
    {key: "dinnerShows", href: categoryHref("dinner-shows", locale)},
    {key: "hammamSpa", href: categoryHref("hammam-spa", locale)},
    {key: "multiDay", href: categoryHref("circuits", locale)},
  ];

  const socials = [
    {
      name: "Instagram",
      path: "M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8C2.4 4 4 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 3.6a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.4a1.4 1.4 0 1 0 0-2.9 1.4 1.4 0 0 0 0 2.9z",
    },
    {
      name: "X",
      path: "M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.3 22H3.1l7.3-8.3L2.8 2h6.4l4.4 5.9L18.9 2zm-1.1 18h1.7L7.4 3.8H5.5L17.8 20z",
    },
    {
      name: "Facebook",
      path: "M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z",
    },
    {
      name: "YouTube",
      path: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z",
    },
  ];

  return (
    <footer className="site-footer">
      <nav className="site-footer-nav" aria-label={t("common.mainNavigation")}>
        <div className="site-footer-nav-inner">
          {footerNavigation.map((item) => (
            <Link key={item.key} href={item.href}>{t(`nav.items.${item.key}`)}</Link>
          ))}
        </div>
      </nav>

      <div className="site-footer-brand-strip">
        <div className="site-footer-brand">
          <Link href="/" className="inline-flex items-center">
            <BrandLogo variant="footer" />
          </Link>
          <div className="site-footer-socials">
            {socials.map((s) => (
              <span
                key={s.name}
                role="img"
                aria-label={s.name}
                className="text-white/75"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </span>
            ))}
          </div>
        </div>
        <LanguageSwitcher className="site-footer-language text-white/85" />
      </div>

      <div className="site-footer-main">

        <nav className="site-footer-column">
          <h3>{t("footer.redesign.customerCare")}</h3>
          <ul>
            <li><Link href="/help">{t("footer.links.travelGuides")}</Link></li>
            <li><Link href="/contact">{t("footer.redesign.contact")}</Link></li>
            <li><Link href="/tours">{t("common.allTours")}</Link></li>
          </ul>
        </nav>

        <nav className="site-footer-column">
          <h3>{t("footer.redesign.business")}</h3>
          <ul>
            {empresa.map((e) => <li key={e.label}><Link href={e.href}>{e.label}</Link></li>)}
          </ul>
        </nav>

        <nav className="site-footer-column">
          <h3>{t("footer.redesign.legal")}</h3>
          <ul>{enlaces.filter((item) => item.href !== "/help").map((e) => <li key={e.label}><Link href={e.href}>{e.label}</Link></li>)}</ul>
        </nav>

        <nav className="site-footer-column">
          <h3>{t("footer.redesign.ourBrands")}</h3>
          <ul>{footerNavigation.slice(0, 4).map((item) => <li key={item.key}><Link href={item.href}>{t(`nav.items.${item.key}`)}</Link></li>)}</ul>
        </nav>

        <div className="site-footer-column site-footer-newsletter">
          <h3>{t("footer.redesign.newsletter")}</h3>
          <p>{t("footer.redesign.newsletterCopy")}</p>
          <form action="/contact" method="get">
            <input type="hidden" name="topic" value="newsletter" />
            <label className="sr-only" htmlFor="footer-newsletter-email">{t("footer.redesign.email")}</label>
            <input id="footer-newsletter-email" name="email" type="email" placeholder={t("footer.redesign.email")} required />
            <button type="submit">{t("footer.redesign.subscribe")}</button>
          </form>
        </div>
      </div>

      <div className="site-footer-bottom">
        <div className="site-footer-bottom-inner">
          <p>{t("footer.copyright")}</p>
          <p className="site-footer-payments" aria-label={t("footer.redesign.paymentMethods")}><span>VISA</span><span className="site-footer-mastercard"><i/><i/></span><span>AMEX</span></p>
        </div>
      </div>
      <a className="site-footer-top" href="#" aria-label="Volver arriba">↑</a>
    </footer>
  );
}
