"use client";

import {useTranslations} from "next-intl";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  const t = useTranslations("common.error");

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-[1200px] flex-col items-center justify-center gap-4 px-3 text-center">
      <h1 className="text-3xl font-semibold text-ink">{t("title")}</h1>
      <p className="max-w-[52ch] text-ink/70">{t("description")}</p>
      {error.digest ? (
        <p className="text-xs text-ink/50">Reference: {error.digest}</p>
      ) : null}
      <button type="button" onClick={reset} className="btn btn-primary mt-2">
        {t("retry")}
      </button>
    </main>
  );
}
