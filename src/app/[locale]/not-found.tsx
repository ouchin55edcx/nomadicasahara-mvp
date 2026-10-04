import {useTranslations} from "next-intl";

import {Link} from "@/i18n/navigation";

export default function LocaleNotFound() {
  const t = useTranslations("common.notFound");

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-[1200px] flex-col items-center justify-center gap-4 px-3 text-center">
      <p className="text-[13px] font-semibold uppercase tracking-nav text-brand">404</p>
      <h1 className="text-3xl font-semibold text-ink">{t("title")}</h1>
      <p className="max-w-[52ch] text-ink/70">{t("description")}</p>
      <Link href="/" className="btn btn-primary mt-2">
        {t("backHome")}
      </Link>
    </main>
  );
}
