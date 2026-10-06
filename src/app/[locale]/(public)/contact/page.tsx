import type {Metadata} from "next";
import {setRequestLocale} from "next-intl/server";
import InfoPage from "@/components/InfoPage";
import {localeStaticParams, type Locale} from "@/i18n/routing";
import {pageMetadata} from "@/lib/seo/metadata";

export const dynamic = "force-static";
export const generateStaticParams = localeStaticParams;
const meta = {en: ["Contact | Nomadica Sahara", "Contact our team about tours and travel in Morocco."], es: ["Contacto | Nomadica Sahara", "Contacta con nuestro equipo sobre excursiones y viajes por Marruecos."], pt: ["Contacto | Nomadica Sahara", "Contacte a nossa equipa sobre passeios e viagens em Marrocos."]} as const;

export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}): Promise<Metadata> {
  const {locale} = await params;
  const [title, description] = meta[locale];
  return pageMetadata({locale, pathname: "/contact", title, description});
}

export default async function Page({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <InfoPage page="contact" />;
}
