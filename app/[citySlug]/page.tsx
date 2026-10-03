import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import MainNav from "@/components/MainNav";
import Footer from "@/components/Footer";
import CatalogPage from "@/components/catalog/CatalogPage";
import { catalogConfigs } from "@/content/catalog";

type PageProps = {
  params: { citySlug: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

export function generateStaticParams() {
  return Object.keys(catalogConfigs).map((citySlug) => ({ citySlug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const config = catalogConfigs[params.citySlug];
  if (!config) return { title: "Catálogo no encontrado | Nomadica Sahara" };
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nomadicasahara.com";
  return {
    title: config.seoTitle,
    description: config.seoDescription,
    alternates: { canonical: `${baseUrl}${config.path}` },
    openGraph: {
      title: config.seoTitle,
      description: config.seoDescription,
      url: `${baseUrl}${config.path}`,
      siteName: "Nomadica Sahara",
      locale: "es_ES",
      type: "website",
      images: [{ url: "/images/hero.jpg", alt: config.title }],
    },
  };
}

export default function CatalogRoute({ params, searchParams = {} }: PageProps) {
  const config = catalogConfigs[params.citySlug];
  if (!config) notFound();
  return <><Header /><MainNav /><CatalogPage config={config} query={searchParams} /><Footer /></>;
}