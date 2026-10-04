import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";

import CheckoutForm from "@/components/booking/CheckoutForm";
import {pageMetadata} from "@/lib/seo/metadata";
import {localeStaticParams} from "@/i18n/routing";

type Params = Promise<{locale: string}>;

// No request-time data on this route, so it can be prerendered per locale.
export const dynamic = "force-static";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({params}: {params: Params}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "metadata"});

  return pageMetadata({
    locale,
    pathname: "/booking/checkout",
    title: t("checkout.title"),
    description: t("checkout.description"),
    noindex: true,
  });
}

export default async function CheckoutPage({params}: {params: Params}) {
  const {locale} = await params;
  setRequestLocale(locale);

  return <CheckoutForm />;
}
