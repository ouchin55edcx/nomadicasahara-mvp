import type {Metadata} from "next";
import {setRequestLocale} from "next-intl/server";
import InfoPage from "@/components/InfoPage";
import {localeStaticParams, type Locale} from "@/i18n/routing";
import {pageMetadata} from "@/lib/seo/metadata";

export const dynamic = "force-static";
export const generateStaticParams = localeStaticParams;
const meta = {en: ["Help | Nomadica Sahara", "Get help choosing a tour or planning a trip in Morocco."], es: ["Ayuda | Nomadica Sahara", "Recibe ayuda para elegir una excursión o planificar un viaje por Marruecos."], pt: ["Ajuda | Nomadica Sahara", "Obtenha ajuda para escolher um passeio ou planear uma viagem em Marrocos."]} as const;

export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}): Promise<Metadata> {
  const {locale} = await params;
  const [title, description] = meta[locale];
  return pageMetadata({locale, pathname: "/help", title, description});
}

export default async function Page({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <InfoPage page="help" />;
}
