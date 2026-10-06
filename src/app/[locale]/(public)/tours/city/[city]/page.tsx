import type {Metadata} from "next";
import {notFound, permanentRedirect} from "next/navigation";
import {getLocale} from "next-intl/server";
import TourListingPage from "@/components/catalog/TourListingPage";
import {routing, type Locale} from "@/i18n/routing";
import {cities, cityFromAnySlug, cityFromSlug, type TourCity} from "@/data/tour-taxonomy";
import {localizedCityPath} from "@/lib/hrefs";
import {absoluteUrl} from "@/lib/seo/metadata";

type Props = {params: Promise<{city: string}>; searchParams: Promise<Record<string, string | string[] | undefined>>};

export function generateStaticParams({params}: {params: {locale: string}}) {
  const locale = routing.locales.includes(params.locale as Locale) ? params.locale as Locale : routing.defaultLocale;
  return (Object.keys(cities) as TourCity[]).map((city) => ({city: cities[city].slug[locale]}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {city: slug} = await params;
  const locale = await getLocale() as Locale;
  const city = cityFromSlug(locale, slug);
  if (!city) return {robots: {index: false, follow: false}};
  const canonical = absoluteUrl(locale, localizedCityPath(locale, city).slice(locale.length + 1));
  const languages = Object.fromEntries(routing.locales.map((item) => [item, absoluteUrl(item, localizedCityPath(item as Locale, city).slice(item.length + 1))]));
  return {title: cities[city].name[locale], description: cities[city].description[locale], alternates: {canonical, languages}, openGraph: {title: cities[city].name[locale], description: cities[city].description[locale], url: canonical, siteName: "Nomadica Sahara", type: "website"}};
}

export default async function TourCityPage({params, searchParams}: Props) {
  const [{city: slug}, query] = await Promise.all([params, searchParams]);
  const locale = await getLocale() as Locale;
  const city = cityFromSlug(locale, slug);
  if (!city) {
    const equivalent = cityFromAnySlug(slug);
    if (equivalent) permanentRedirect(localizedCityPath(locale, equivalent));
    notFound();
  }
  return <TourListingPage kind="city" city={city} query={query} />;
}
