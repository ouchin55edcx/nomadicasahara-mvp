import {getLocale, getTranslations} from "next-intl/server";
import TourCard from "@/components/TourCard";
import CategoryHero from "@/components/catalog/CategoryHero";
import {Link} from "@/i18n/navigation";
import {allTourRecords} from "@/data/static/tour-catalog";
import {cities, categories, type TourCategory, type TourCity} from "@/data/tour-taxonomy";
import {categoryHref, destinationHref, tourHref} from "@/lib/hrefs";
import type {Locale} from "@/i18n/routing";
import type {TourRecord} from "@/types/tour-catalog";

type Query = Record<string, string | string[] | undefined>;
type ListingKind = "all" | "category" | "city";

function queryValue(query: Query, key: string): string {
  const value = query[key];
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function tourPrice(tour: TourRecord) {
  if (tour.pricing.kind === "quote") return undefined;
  return tour.pricing.kind === "single" ? tour.pricing.amount : Math.min(...Object.values(tour.pricing.tiers));
}

export default async function TourListingPage({kind, category, city, query = {}}: {kind: ListingKind; category?: TourCategory; city?: TourCity; query?: Query}) {
  const locale = await getLocale() as Locale;
  const t = await getTranslations({locale, namespace: "RoutePages"});
  let tours = allTourRecords;
  if (category) tours = tours.filter((tour) => categories[category].tourIds.includes(tour.id));
  if (city) tours = tours.filter((tour) => cities[city].tourIds.includes(tour.id));

  const search = queryValue(query, "q").trim().toLocaleLowerCase(locale);
  if (search) tours = tours.filter((tour) => `${tour.title[locale]} ${tour.summary[locale]} ${tour.destination[locale]}`.toLocaleLowerCase(locale).includes(search));
  const selectedCategory = queryValue(query, "category");
  const selectedCity = queryValue(query, "city");
  if (selectedCategory) tours = tours.filter((tour) => categories[selectedCategory as TourCategory]?.tourIds.includes(tour.id));
  if (selectedCity) tours = tours.filter((tour) => cities[selectedCity as TourCity]?.tourIds.includes(tour.id));
  const maxPrice = Number(queryValue(query, "maxPrice"));
  if (Number.isFinite(maxPrice) && maxPrice > 0) tours = tours.filter((tour) => (tourPrice(tour) ?? Number.POSITIVE_INFINITY) <= maxPrice);
  const length = queryValue(query, "days");
  if (length === "multi") tours = tours.filter((tour) => (tour.durationDays ?? 1) >= 2);
  if (length === "short") tours = tours.filter((tour) => (tour.durationDays ?? 1) < 2);

  const title = category ? categories[category].name[locale] : city ? cities[city].name[locale] : t("allTours");
  const description = category ? categories[category].description[locale] : city ? cities[city].description[locale] : t("allToursDescription");
  const heading = kind === "category" ? t("categoryTitle", {category: title}) : kind === "city" ? t("cityTitle", {city: title}) : title;
  const image = category ? categories[category].image : city ? cities[city].image : "/images/hero.jpg";
  const imageAlt = category ? categories[category].name[locale] : city ? cities[city].name[locale] : t("allTours");
  const action = kind === "all" ? `/${locale}${locale === "es" ? "/excursiones" : locale === "pt" ? "/passeios" : "/tours"}`
    : kind === "category" && category ? `/${locale}${locale === "es" ? "/excursiones/categoria" : locale === "pt" ? "/passeios/categoria" : "/tours/category"}/${categories[category].slug[locale]}`
      : city ? `/${locale}${locale === "es" ? "/excursiones/destino" : locale === "pt" ? "/passeios/cidade" : "/tours/city"}/${cities[city].slug[locale]}` : `/${locale}/tours`;
  const priceLabel = (amount: number) => new Intl.NumberFormat(locale, {style: "currency", currency: "EUR", maximumFractionDigits: 0}).format(amount);

  return <main className="min-h-screen bg-[#F5F6F4] text-[#252925]">
    <div className="mx-auto max-w-[1200px] px-3 pb-16 pt-5 sm:px-5 lg:px-6">
      <nav aria-label={t("home")} className="mb-4 flex items-center gap-2 text-xs text-muted"><Link href="/" className="hover:text-[#006D41]">{t("home")}</Link><span aria-hidden="true">›</span><Link href="/tours" className="hover:text-[#006D41]">{t("allTours")}</Link>{category || city ? <><span aria-hidden="true">›</span><span aria-current="page">{title}</span></> : null}</nav>
      <CategoryHero image={image} imageAlt={imageAlt} eyebrow={t("heroEyebrow")} title={heading} description={description} actionLabel={t("exploreExperiences")} />
      {kind === "all" ? <div className="mb-6 space-y-4">
        <section aria-labelledby="category-shortcuts"><h2 id="category-shortcuts" className="mb-2 text-sm font-semibold">{t("categories")}</h2><div className="flex flex-wrap gap-2">{(Object.keys(categories) as TourCategory[]).map((key) => <Link key={key} href={categoryHref(key, locale)} className="inline-flex min-h-10 items-center rounded-full border border-line bg-white px-4 text-sm hover:border-[#006D41]">{categories[key].name[locale]}</Link>)}</div></section>
        <section aria-labelledby="city-shortcuts"><h2 id="city-shortcuts" className="mb-2 text-sm font-semibold">{t("destinations")}</h2><div className="flex flex-wrap gap-2">{(Object.keys(cities) as TourCity[]).map((key) => <Link key={key} href={destinationHref(key, locale)} className="inline-flex min-h-10 items-center rounded-full border border-line bg-white px-4 text-sm hover:border-[#006D41]">{cities[key].name[locale]}</Link>)}</div></section>
      </div> : null}
      <form action={action} method="get" className="mb-6 grid gap-2 border border-line bg-white p-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))_auto]">
        <label className="block text-xs font-semibold">{t("search")}<input name="q" defaultValue={queryValue(query, "q")} className="mt-1 block h-10 w-full border border-line px-3 text-sm font-normal" /></label>
        <label className="block text-xs font-semibold">{t("category")}<select name="category" defaultValue={selectedCategory} className="mt-1 block h-10 w-full border border-line bg-white px-3 text-sm font-normal"><option value="">{t("allCategories")}</option>{(Object.keys(categories) as TourCategory[]).map((key) => <option key={key} value={key}>{categories[key].name[locale]}</option>)}</select></label>
        <label className="block text-xs font-semibold">{t("city")}<select name="city" defaultValue={selectedCity} className="mt-1 block h-10 w-full border border-line bg-white px-3 text-sm font-normal"><option value="">{t("allCities")}</option>{(Object.keys(cities) as TourCity[]).map((key) => <option key={key} value={key}>{cities[key].name[locale]}</option>)}</select></label>
        <label className="block text-xs font-semibold">{t("days")}<select name="days" defaultValue={length} className="mt-1 block h-10 w-full border border-line bg-white px-3 text-sm font-normal"><option value="">{t("anyLength")}</option><option value="short">{t("shortTrip")}</option><option value="multi">{t("multiDay")}</option></select></label>
        <label className="block text-xs font-semibold">{t("maxPrice")}<input name="maxPrice" type="number" min="1" defaultValue={queryValue(query, "maxPrice")} placeholder={t("anyPrice")} className="mt-1 block h-10 w-full border border-line px-3 text-sm font-normal" /></label>
        <button type="submit" className="inline-flex min-h-11 items-center justify-center self-end bg-[#67B500] px-5 text-sm font-bold text-black sm:col-span-2 lg:col-span-1">{t("searchButton")}</button>
      </form>
      <div id="experiences" className="mb-4 flex items-center justify-between border-b border-[#D5D9D6] pb-3"><h2 className="font-semibold">{t("results")} <span className="text-muted">({tours.length})</span></h2>{category || city ? <Link href="/tours" className="text-sm font-semibold text-[#006D41] underline underline-offset-4">{t("allTours")}</Link> : null}</div>
      {tours.length ? <div className="grid grid-cols-[repeat(auto-fill,270px)] items-stretch gap-4">{tours.map((tour) => <TourCard key={tour.id} image={tour.image} imageAlt={tour.title[locale]} title={tour.title[locale]} tag={tour.category[locale]} meta={tour.destination[locale]} description={tour.summary[locale]} price={tourPrice(tour) === undefined ? undefined : priceLabel(tourPrice(tour)!)} duration={tour.duration[locale]} actionLabel={t("viewTour")} actionHref={tourHref(tour)} priceLabel={t("from")} />)}</div> : <p className="border border-dashed border-[#CFD8C9] bg-white px-6 py-12 text-center text-sm text-muted">{t("noResults")}</p>}
    </div>
  </main>;
}
