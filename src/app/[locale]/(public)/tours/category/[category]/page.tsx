import type {Metadata} from "next";
import {notFound, permanentRedirect} from "next/navigation";
import {getLocale, getTranslations} from "next-intl/server";
import TourListingPage from "@/components/catalog/TourListingPage";
import {routing, type Locale} from "@/i18n/routing";
import {categories, categoryFromAnySlug, categoryFromSlug, type TourCategory} from "@/data/tour-taxonomy";
import {localizedCategoryPath} from "@/lib/hrefs";
import {absoluteUrl} from "@/lib/seo/metadata";

type Props = {params: Promise<{category: string}>; searchParams: Promise<Record<string, string | string[] | undefined>>};

export function generateStaticParams({params}: {params: {locale: string}}) {
  const locale = routing.locales.includes(params.locale as Locale) ? params.locale as Locale : routing.defaultLocale;
  return (Object.keys(categories) as TourCategory[]).map((category) => ({category: categories[category].slug[locale]}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {category: slug} = await params;
  const locale = await getLocale() as Locale;
  const category = categoryFromSlug(locale, slug);
  if (!category) return {robots: {index: false, follow: false}};
  const current = absoluteUrl(locale, localizedCategoryPath(locale, category).slice(locale.length + 1));
  const languages = Object.fromEntries(routing.locales.map((item) => [item, absoluteUrl(item, localizedCategoryPath(item as Locale, category).slice(item.length + 1))]));
  return {title: categories[category].name[locale], description: categories[category].description[locale], alternates: {canonical: current, languages}, openGraph: {title: categories[category].name[locale], description: categories[category].description[locale], url: current, siteName: "Nomadica Sahara", type: "website"}};
}

export default async function TourCategoryPage({params, searchParams}: Props) {
  const [{category: slug}, query] = await Promise.all([params, searchParams]);
  const locale = await getLocale() as Locale;
  const category = categoryFromSlug(locale, slug);
  if (!category) {
    const equivalent = categoryFromAnySlug(slug);
    if (equivalent) permanentRedirect(localizedCategoryPath(locale, equivalent));
    notFound();
  }
  return <TourListingPage kind="category" category={category} query={query} />;
}
