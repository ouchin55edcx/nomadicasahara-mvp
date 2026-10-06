import {useTranslations} from "next-intl";

import BrandLogo from "@/components/layout/BrandLogo";
import {Link} from "@/i18n/navigation";

export default function Header() {
  const t = useTranslations();

  return (
    <header className="bg-white">
      {/* Brand + utility row */}
      <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-6 sm:px-8 lg:px-10">
        <Link href="/" className="flex shrink-0 items-center">
          <BrandLogo />
        </Link>

        <div className="flex items-center gap-5 text-[12px] text-ink md:gap-8">
          <a
            href={t("common.phoneHref")}
            className="hidden items-center gap-2 transition-colors hover:text-brand sm:flex"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t("common.phone")}
          </a>

          <Link
            href="/about"
            className="hidden items-center gap-2 transition-colors hover:text-brand lg:flex"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 21s-7-5.6-7-11a7 7 0 1 1 14 0c0 5.4-7 11-7 11z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.7" />
            </svg>
            <span className="underline underline-offset-[3px]">
              {t("common.agencies")}
            </span>
          </Link>

          <Link
            href="/help"
            className="hidden items-center gap-2 transition-colors hover:text-brand lg:flex"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="3.5"
                y="4.5"
                width="17"
                height="15"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="M9.9 9.7a2.3 2.3 0 1 1 3.1 2.2c-.7.3-1.1.9-1.1 1.7v.3"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
              <path
                d="M11.9 16.4h.02"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="underline underline-offset-[3px]">
              {t("common.helpCenter")}
            </span>
          </Link>

          <Link
            href="/partner/login"
            className="flex items-center gap-1.5 transition-colors hover:text-brand"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="12" cy="10" r="2.8" stroke="currentColor" strokeWidth="1.7" />
              <path
                d="M6.6 18.6a6 6 0 0 1 10.8 0"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
            {t("common.signIn")}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
