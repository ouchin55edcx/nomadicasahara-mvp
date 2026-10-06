import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import TourListingPage from "@/components/catalog/TourListingPage";
import {routing, type Locale} from "@/i18n/routing";
import {absoluteUrl} from "@/lib/seo/metadata";

type Props = {params: Promise<{locale: Locale}>; searchParams: Promise<Record<string, string | string[] | undefined>>};

export async function generateMetadata({params}: Pick<Props, "params">): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "RoutePages"});
  const paths = Object.fromEntries(routing.locales.map((item) => [item, absoluteUrl(item, item === "es" ? "/excursiones" : item === "pt" ? "/passeios" : "/tours")]));
  const current = paths[locale];
  return {title: t("allTours"), description: t("allToursDescription"), alternates: {canonical: current, languages: paths}, openGraph: {title: t("allTours"), description: t("allToursDescription"), url: current, siteName: "Nomadica Sahara", type: "website"}};
}

export default async function ToursPage({params, searchParams}: Props) {
  const [{locale}, query] = await Promise.all([params, searchParams]);
  setRequestLocale(locale);
  return <TourListingPage kind="all" query={query} />;
}
