import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";

import {Toaster} from "@/components/ui/sonner";

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "metadata"});

  return {
    title: {
      default: t("partnerLogin.title"),
      template: t("partnerPortal.titleTemplate"),
    },
    robots: {index: false, follow: false},
  };
}

export default async function PartnerLayout({
  children,
  params,
}: Readonly<{children: React.ReactNode; params: Promise<{locale: string}>}>) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <>
      <main className="min-h-screen px-4 py-6 md:px-6 md:py-8">
        <div className="mx-auto w-full max-w-[1400px]">{children}</div>
      </main>
      <Toaster />
    </>
  );
}
