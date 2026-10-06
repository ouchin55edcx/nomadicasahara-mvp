import type {Metadata} from "next";
import {setRequestLocale} from "next-intl/server";
import InfoPage from "@/components/InfoPage";
import {localeStaticParams, type Locale} from "@/i18n/routing";
import {pageMetadata} from "@/lib/seo/metadata";

export const dynamic = "force-static";
export const generateStaticParams = localeStaticParams;
const meta = {en: ["Terms | Nomadica Sahara", "Terms and booking information for Nomadica Sahara."], es: ["Condiciones | Nomadica Sahara", "Condiciones e información de reserva de Nomadica Sahara."], pt: ["Termos | Nomadica Sahara", "Termos e informações de reserva da Nomadica Sahara."]} as const;

export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}): Promise<Metadata> {
  const {locale} = await params;
  const [title, description] = meta[locale];
  return pageMetadata({locale, pathname: "/terms", title, description});
}

export default async function Page({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <InfoPage page="terms" />;
}
