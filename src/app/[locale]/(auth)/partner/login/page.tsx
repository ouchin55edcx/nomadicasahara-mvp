import type {Metadata} from "next";
import {LockKeyhole} from "lucide-react";
import {getTranslations, setRequestLocale} from "next-intl/server";

import {localeStaticParams} from "@/i18n/routing";

import LoginForm from "./login-form";

type Params = Promise<{locale: string}>;

// No request-time data on this route, so it can be prerendered per locale.
export const dynamic = "force-static";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({params}: {params: Params}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "metadata"});

  return {
    title: {absolute: `${t("partnerLogin.title")} | Toledano Viajes`},
    description: t("partnerLogin.description"),
    robots: {index: false, follow: false},
  };
}

export default async function PartnerLoginPage({params}: {params: Params}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f2f2f4] px-4 py-10 text-[#222]">
      <section className="w-full max-w-[500px] rounded-lg border border-[#d8d8d8] bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-12">
        <div className="mb-8 text-center" aria-label="Toledano Viajes">
          <span className="text-[42px] font-black leading-none tracking-[-0.07em] text-[#006D73] sm:text-[50px]">TOLEDANO</span>
          <span className="ml-2 inline-block text-[27px] leading-none text-black" style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive" }}>viajes</span>
        </div>

        <div className="mb-7 flex items-center gap-3">
          <LockKeyhole className="h-5 w-5 shrink-0 text-[#006D73]" aria-hidden="true" />
          <h1 className="text-[25px] font-bold tracking-tight text-black sm:text-[29px]">Partner sign in</h1>
        </div>

        <LoginForm />

        <p className="mt-7 text-center text-sm text-gray-600">
          Don&apos;t have a partner account?{" "}
          <a href={`/${locale}/contact?topic=partner`} className="font-semibold text-[#006D73] hover:underline">Contact us</a>
        </p>
        <p className="mt-8 text-center text-xs text-gray-500">© 2026 Toledano Viajes · Partner access only</p>
      </section>
    </main>
  );
}
