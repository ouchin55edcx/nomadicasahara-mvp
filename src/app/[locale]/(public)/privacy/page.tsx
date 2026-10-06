import type {Metadata} from "next";
import {setRequestLocale} from "next-intl/server";
import InfoPage from "@/components/InfoPage";
import {localeStaticParams, type Locale} from "@/i18n/routing";
import {pageMetadata} from "@/lib/seo/metadata";

export const dynamic = "force-static";
export const generateStaticParams = localeStaticParams;
const meta = {en: ["Privacy policy | Nomadica Sahara", "Privacy information for Nomadica Sahara."], es: ["Privacidad | Nomadica Sahara", "Información de privacidad de Nomadica Sahara."], pt: ["Privacidade | Nomadica Sahara", "Informações de privacidade da Nomadica Sahara."]} as const;

export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}): Promise<Metadata> {
  const {locale} = await params;
  const [title, description] = meta[locale];
  return pageMetadata({locale, pathname: "/privacy", title, description});
}

export default async function Page({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <InfoPage page="privacy" />;
}
