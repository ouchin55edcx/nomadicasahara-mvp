import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {getTranslations} from "next-intl/server";
import CopyRequestButton from "@/components/booking/CopyRequestButton";
import {Link} from "@/i18n/navigation";
import {getBookingConfirmation} from "@/app/[locale]/(public)/book/actions";
import {isLocale} from "@/lib/tour-route";

export const dynamicParams = true;
type Props = {params: Promise<{locale: string; offerId: string}>; searchParams: Promise<{ref?: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) return {robots: {index: false, follow: false}};
  const t = await getTranslations({locale, namespace: "Booking"});
  return {title: t("confirmationTitle"), robots: {index: false, follow: false}};
}

export default async function BookingConfirmation({params, searchParams}: Props) {
  const [{locale, offerId}, query] = await Promise.all([params, searchParams]);
  if (!isLocale(locale) || !query.ref) notFound();
  const booking = await getBookingConfirmation(query.ref, offerId);
  if (!booking) notFound();

  const t = await getTranslations({locale, namespace: "Booking"});
  const common = await getTranslations({locale, namespace: "common"});
  const tierLabel = booking.offer_tier === "base"
    ? ""
    : await getTranslations({locale, namespace: "TourOffers"}).then((offerT) => offerT(booking.offer_tier));
  const date = String(booking.booking_date).slice(0, 10);
  const travelers = Number(booking.travelers);
  const total = Number(booking.total);
  const formatPrice = (amount: number) => new Intl.NumberFormat(locale, {
    style: "currency",
    currency: booking.currency || "EUR",
    maximumFractionDigits: 2,
  }).format(amount);
  const summary = [
    `${booking.product_title}${tierLabel ? ` - ${tierLabel}` : ""}`,
    `${t("date")}: ${date}`,
    `${t("travelers")}: ${travelers}`,
    `${t("estimatedTotalLabel")}: ${formatPrice(total)}`,
    `${t("reference")}: ${booking.reference}`,
  ].join("\n");
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const email = process.env.NEXT_PUBLIC_EMAIL;
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(summary)}` : undefined;
  const emailHref = email ? `mailto:${email}?subject=${encodeURIComponent(`${t("title")} ${booking.reference}`)}&body=${encodeURIComponent(summary)}` : undefined;

  return <main className="min-h-[70vh] bg-[#F8FAF5] px-4 py-10 sm:py-16">
    <nav aria-label={t("steps")} className="mx-auto mb-4 flex max-w-2xl flex-wrap items-center gap-2 text-xs text-muted">
      <Link href="/" className="hover:text-[#006D41]">{common("home")}</Link><span aria-hidden="true">›</span>
      <Link href={{pathname: "/tours/[slug]", params: {slug: booking.product_slug}}} className="max-w-[60vw] truncate hover:text-[#006D41]">{booking.product_title}</Link>
      <span aria-hidden="true">›</span><span aria-current="page">{t("confirmationTitle")}</span>
    </nav>
    <section className="mx-auto max-w-2xl rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-10">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#006D41]">{t("confirmationTitle")}</p>
      <h1 className="mt-2 text-3xl font-bold">{t("confirmationDescription")}</h1>
      <p className="mt-5 text-sm text-muted">{t("reference")}</p>
      <p className="text-2xl font-bold text-[#006D41]">{booking.reference}</p>
      <div className="mt-6 rounded-xl bg-[#F8FAF5] p-4">
        <h2 className="font-semibold">{t("summary")}</h2>
        <p className="mt-2 font-semibold">{booking.product_title}{tierLabel ? ` · ${tierLabel}` : ""}</p>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="text-muted">{t("date")}</dt><dd>{date}</dd></div>
          <div><dt className="text-muted">{t("travelers")}</dt><dd>{travelers}</dd></div>
          <div className="sm:col-span-2"><dt className="text-muted">{t("estimatedTotalLabel")}</dt><dd className="text-lg font-bold">{formatPrice(total)}</dd></div>
        </dl>
      </div>
      <h2 className="mt-7 text-lg font-bold">{t("whatNext")}</h2>
      <p className="mt-2 text-sm leading-6 text-[#444]">{t("weReview")}</p>
      <p className="mt-4 rounded-lg border border-[#929547]/40 bg-[#F8FAF5] p-3 text-sm leading-6">{t("deliveryNote")}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        {whatsappHref ? <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#67B500] px-4 text-sm font-bold text-black">{t("sendWhatsapp")}</a> : null}
        {emailHref ? <a href={emailHref} className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#006D41] px-4 text-sm font-semibold text-[#006D41]">{t("sendEmail")}</a> : null}
        <CopyRequestButton text={summary} label={t("copy")} copied={t("copied")} />
      </div>
      <Link href={{pathname: "/contact"}} className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-[#006D41] underline underline-offset-4">{t("contact")}</Link>
    </section>
  </main>;
}
