import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";

import CatalogPage from "@/components/catalog/CatalogPage";
import {catalogConfigs} from "@/data/catalog";
import {pageMetadata} from "@/lib/seo/metadata";

type PageProps = {
  params: Promise<{locale: string; citySlug: string}>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return Object.keys(catalogConfigs).map((citySlug) => ({citySlug}));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string; citySlug: string}>;
}): Promise<Metadata> {
  const {locale, citySlug} = await params;
  const config = catalogConfigs[citySlug];

  if (!config) {
    const t = await getTranslations({locale, namespace: "metadata"});
    return {title: t("catalogNotFound.title"), robots: {index: false, follow: false}};
  }

  return pageMetadata({
    locale,
    pathname: config.path,
    title: config.seoTitle,
    description: config.seoDescription,
  });
}

export default async function CatalogRoute({params, searchParams}: PageProps) {
  const {locale, citySlug} = await params;
  setRequestLocale(locale);
  const query = await searchParams;
  const config = catalogConfigs[citySlug];
  if (!config) notFound();
  return <CatalogPage config={config} query={query} />;
}
