"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import {useParams} from "next/navigation";

import BrandLogo from "@/components/layout/BrandLogo";
import { Link, usePathname } from "@/i18n/navigation";
import {categoryHref, destinationHref} from "@/lib/hrefs";
import type {Locale} from "@/i18n/routing";

type NavLink = { key: string; href: {pathname: string; params: Record<string, string>} };
type NavItem = { key: string; href: {pathname: string; params: Record<string, string>}; links: NavLink[] };

// Hrefs are canonical (locale-independent) so the same entry serves every
// language; only the labels come from the message catalogs.
const NAV_ITEMS = (locale: Locale): NavItem[] => [
  {key: "desert", href: categoryHref("desert", locale), links: [
    {key: "agafay", href: destinationHref("agafay", locale)},
    {key: "zagora", href: destinationHref("zagora", locale)},
    {key: "merzouga", href: destinationHref("merzouga", locale)},
  ]},
  {key: "saidiaBeach", href: categoryHref("saidia-beach", locale), links: []},
  {key: "privateTours", href: categoryHref("private-tours", locale), links: []},
  {key: "airportTransfers", href: categoryHref("transfers", locale), links: []},
  {key: "dinnerShows", href: categoryHref("dinner-shows", locale), links: []},
  {key: "hammamSpa", href: categoryHref("hammam-spa", locale), links: []},
  {key: "multiDay", href: categoryHref("circuits", locale), links: []},
];

const CHEVRON = "M6 9l6 6 6-6";

export default function MainNav() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const routeParams = useParams<Record<string, string | string[]>>();
  const [active, setActive] = useState(-1);
  const [hovered, setHovered] = useState<number | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [openSection, setOpenSection] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const items = NAV_ITEMS(locale).map((item) => ({
    ...item,
    label: t(`nav.items.${item.key}`),
    links: item.links.map((link) => ({
      ...link,
      label: t(`nav.places.${link.key}`),
    })),
  }));

  const cancelClose = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    timer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenMenu(null);
      setSheetOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const matches = (href: {pathname: string; params: Record<string, string>}) => href.pathname === pathname && Object.entries(href.params).every(([key, value]) => routeParams[key] === value);
    setActive(
      items.findIndex(
        (it) =>
          matches(it.href) || it.links.some((link) => matches(link.href)),
      ),
    );
  }, [pathname, routeParams]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  useEffect(() => () => cancelClose(), []);

  const item = openMenu !== null ? items[openMenu] : null;

  return (
    <nav
      aria-label={t("common.mainNavigation")}
      className="relative z-30 bg-white"
      onMouseLeave={() => {
        scheduleClose();
        setHovered(null);
      }}
    >
      {/* Mobile trigger */}
      <div className="flex h-11 items-center justify-between border-b border-line px-3 lg:hidden">
        <span className="text-[13px] font-medium uppercase tracking-nav">
          {t("common.menu")}
        </span>
        <button
          type="button"
          aria-label={t("common.openMenu")}
          aria-expanded={sheetOpen}
          onClick={() => setSheetOpen(true)}
          className="-mr-2 p-2 text-ink"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 6h18M3 12h18M3 18h18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Desktop nav: category row spanning the full width, ECI-style */}
      <div className="hidden border-b border-line lg:block">
        <div className="w-full overflow-x-auto px-6">
          <ul className="mx-auto flex h-[60px] w-max min-w-full items-stretch justify-center gap-2 xl:gap-3">
            {items.map((it, i) => (
              <li key={it.key} className="flex">
                <Link
                  href={it.href}
                  aria-expanded={it.links.length ? openMenu === i : undefined}
                  onMouseEnter={() => {
                    cancelClose();
                    setHovered(i);
                    setOpenMenu(it.links.length ? i : null);
                  }}
                  onFocus={() => {
                    setHovered(i);
                    setOpenMenu(it.links.length ? i : null);
                  }}
                  onBlur={() => setHovered(null)}
                  className={`flex h-[42px] select-none items-center self-center whitespace-nowrap border-b-2 px-1.5 text-center text-[13px] uppercase tracking-[0.08em] transition-colors xl:px-2 xl:text-[14px] ${
                    hovered === i
                      ? "border-[#26372D] bg-[#D8EBDD] font-medium text-ink"
                      : active === i
                        ? "border-ink font-semibold text-ink"
                        : "border-transparent font-medium text-ink"
                  }`}
                >
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mega menu */}
      {item && item.links.length > 0 && (
        <div
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          className="absolute inset-x-0 top-full hidden border-b border-line bg-white shadow-[0_24px_40px_-32px_rgba(0,0,0,0.45)] lg:block"
        >
          <div className="mx-auto w-full max-w-[1200px] px-3">
            <ul className="grid gap-7 py-6 sm:grid-cols-2 lg:grid-cols-3">
              {item.links.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-[14px] leading-snug text-ink transition-colors hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Mobile sheet */}
      {sheetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("common.navigationMenu")}
          className="fixed inset-0 z-50 lg:hidden"
        >
          <button
            type="button"
            aria-label={t("common.closeMenu")}
            onClick={() => setSheetOpen(false)}
            className="absolute inset-0 h-full w-full bg-ink-dark/50"
          />
          <div className="absolute inset-y-0 right-0 flex w-[min(380px,90vw)] flex-col bg-white shadow-2xl">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4">
              <BrandLogo />
              <button
                type="button"
                aria-label={t("common.closeMenu")}
                onClick={() => setSheetOpen(false)}
                className="-mr-2 p-2 text-ink"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-4">
              {items.map((it, i) => (
                <div key={it.key} className="border-b border-line">
                  {it.links.length === 0 ? (
                    <Link
                      href={it.href}
                      onClick={() => {
                        setActive(i);
                        setSheetOpen(false);
                      }}
                      className={`block py-3.5 text-[14px] font-medium uppercase tracking-nav transition-colors ${
                        active === i ? "text-brand" : "text-ink"
                      }`}
                    >
                      {it.label}
                    </Link>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-3">
                        <Link
                          href={it.href}
                          onClick={() => {
                            setActive(i);
                            setSheetOpen(false);
                          }}
                          className={`flex-1 py-3.5 text-[14px] font-medium uppercase tracking-nav transition-colors ${
                            active === i ? "text-brand" : "text-ink"
                          }`}
                        >
                          {it.label}
                        </Link>
                        <button
                          type="button"
                          aria-label={t("common.showOptionsFor", { item: it.label })}
                          aria-expanded={openSection === i}
                          onClick={() => {
                            setActive(i);
                            setOpenSection(openSection === i ? null : i);
                          }}
                          className="p-2 text-muted"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                            className={`shrink-0 transition-transform ${
                              openSection === i
                                ? "rotate-180 text-brand"
                                : "text-muted"
                            }`}
                          >
                            <path
                              d={CHEVRON}
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>

                      {openSection === i && (
                        <ul className="pb-4">
                          {it.links.map((link) => (
                            <li key={link.key}>
                              <Link
                                href={link.href}
                                onClick={() => setSheetOpen(false)}
                                className="block py-0.5 text-[14px] text-ink transition-colors hover:text-brand"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="shrink-0 space-y-3 border-t border-line p-4">
              <a
                href={t("common.phoneHref")}
                className="flex items-center gap-2 text-[13px] text-muted transition-colors hover:text-brand"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="text-brand"
                >
                  <path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t("common.phone")}
              </a>
              <div className="flex gap-2">
                <Link href="/tours" className="btn btn-primary flex-1">
                  {t("common.reserveNow")}
                </Link>
                <Link href="/partner/login" className="btn btn-secondary flex-1">
                  {t("common.signIn")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
