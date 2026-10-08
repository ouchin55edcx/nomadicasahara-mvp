"use client";

import {useEffect, useReducer, useRef, useState} from "react";
import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import {bookingRequestSchema, type BookingRequest} from "@/lib/validations/booking";
import type {ParsedOfferId} from "@/lib/tour-catalog";
import {tourHref} from "@/lib/hrefs";
import type {Locale} from "@/i18n/routing";
import {submitBookingRequest} from "@/app/[locale]/(public)/book/actions";
import {calculatePrice, type TransferTier} from "@/lib/pricing";
import type {Tier} from "@/types/tour-catalog";

type Fields = Omit<BookingRequest, "travelers" | "consent"> & {travelers: number; consent: boolean};
type Field = keyof Fields;
type FormError = "dateRequired" | "travelersRequired" | "nameRequired" | "emailInvalid" | "phoneRequired" | "consentRequired" | "serverError";
type State = {step: 1 | 2 | 3; values: Fields; errors: Partial<Record<Field, FormError>>; pending: boolean};
type Action = {type: "field"; field: Field; value: Fields[Field]} | {type: "errors"; errors: Partial<Record<Field, FormError>>} | {type: "step"; step: 1 | 2 | 3} | {type: "pending"; pending: boolean};

function reducer(state: State, action: Action): State {
  if (action.type === "field") return {...state, values: {...state.values, [action.field]: action.value}, errors: {...state.errors, [action.field]: undefined}};
  if (action.type === "errors") return {...state, errors: action.errors};
  if (action.type === "step") return {...state, step: action.step, errors: {}};
  return {...state, pending: action.pending};
}

function errorFromCode(code: string): FormError {
  return (["dateRequired", "travelersRequired", "nameRequired", "emailInvalid", "phoneRequired", "consentRequired"].includes(code) ? code : "serverError") as FormError;
}

const countryCodes = ["+212", "+34", "+33", "+44", "+1", "+49", "+351"];

export default function BookingForm({offerId, parsed, locale, initialDate, initialTravelers, initialArrival, initialDeparture, transferPrices, cancellationPolicy, paymentCancelled}: {offerId: string; parsed: ParsedOfferId; locale: Locale; initialDate: string; initialTravelers: number; initialArrival: TransferTier; initialDeparture: TransferTier; transferPrices: Record<Tier, number>; cancellationPolicy: string; paymentCancelled: boolean}) {
  const t = useTranslations("Booking");
  const common = useTranslations("common");
  const offerT = useTranslations("TourOffers");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [submitError, setSubmitError] = useState<FormError | null>(null);
  const [state, dispatch] = useReducer(reducer, {
    step: 1,
    values: {date: initialDate, travelers: initialTravelers, pickup: "", notes: "", name: "", email: "", countryCode: "+212", phone: "", consent: false},
    errors: {},
    pending: false,
  });
  const arrival = parsed.tour.transferAddon ? initialArrival : "none";
  const departure = parsed.tour.transferAddon ? initialDeparture : "none";

  useEffect(() => { headingRef.current?.focus(); }, [state.step]);

  const unit = parsed.pricing.unit;
  const perTraveler = unit === "person" || unit === "ticket";
  const breakdown = calculatePrice({unit, tierPrice: parsed.price, travelers: state.values.travelers, arrival, departure, transferPrices});
  const total = breakdown.total;
  const money = (value: number) => new Intl.NumberFormat(locale, {style: "currency", currency: parsed.tour.currency || "EUR", maximumFractionDigits: 2}).format(value);
  const unitLabel = unit === "vehicle" ? t("unitVehicle") : unit === "group" ? t("unitGroup") : unit === "ticket" ? t("unitTicket") : t("unitPerson");
  const tierName = parsed.tier === "base" ? "" : offerT(parsed.tier);
  const setField = <K extends Field>(field: K, value: Fields[K]) => dispatch({type: "field", field, value} as Action);

  function validateStep(step: 1 | 2 | 3) {
    const schema = step === 1
      ? bookingRequestSchema.pick({date: true, travelers: true})
      : step === 2
        ? bookingRequestSchema.pick({name: true, email: true, countryCode: true, phone: true})
        : bookingRequestSchema;
    const input = step === 1
      ? {date: state.values.date, travelers: state.values.travelers}
      : step === 2
        ? {name: state.values.name, email: state.values.email, countryCode: state.values.countryCode, phone: state.values.phone}
        : state.values;
    const parsedStep = schema.safeParse(input);
    if (parsedStep.success) {
      dispatch({type: "errors", errors: {}});
      return true;
    }
    const errors: Partial<Record<Field, FormError>> = {};
    for (const issue of parsedStep.error.issues) {
      const field = issue.path[0] as Field | undefined;
      if (field) errors[field] = errorFromCode(issue.message);
    }
    dispatch({type: "errors", errors});
    return false;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);
    if (state.step < 3) {
      if (validateStep(state.step)) dispatch({type: "step", step: (state.step + 1) as 2 | 3});
      return;
    }
    if (!validateStep(3)) return;
    dispatch({type: "pending", pending: true});
    try {
      const response = await submitBookingRequest({offerId, locale, form: state.values});
      if (!response.ok) {
        setSubmitError(errorFromCode(response.error));
        dispatch({type: "pending", pending: false});
        return;
      }
      window.location.assign(response.checkoutUrl);
    } catch {
      setSubmitError("serverError");
    } finally {
      dispatch({type: "pending", pending: false});
    }
  }

  const textField = (field: "name" | "email" | "phone", label: string, type: string, autoComplete: string) => <label className="block text-sm font-semibold" htmlFor={`booking-${field}`}>{label}<input id={`booking-${field}`} type={type} autoComplete={autoComplete} value={state.values[field]} onChange={(event) => setField(field, event.target.value)} aria-invalid={Boolean(state.errors[field])} aria-describedby={state.errors[field] ? `error-${field}` : undefined} className="mt-1.5 h-12 w-full rounded-md border border-line px-3 font-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006D41]" />{state.errors[field] ? <span id={`error-${field}`} className="mt-1 block text-xs font-normal text-red-700">{t(state.errors[field]!)}</span> : null}</label>;

  const Summary = <section aria-label={t("summary")} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
    <h2 className="text-lg font-bold">{t("summary")}</h2>
    <p className="mt-3 font-semibold">{parsed.tour.title[locale]}</p>
    {tierName ? <p className="mt-1 text-sm text-[#006D41]">{tierName}</p> : null}
    <div className="mt-4 space-y-2 border-t border-dashed border-[#006D41]/40 pt-4 text-sm">
      <p className="flex justify-between gap-3"><span>{t("date")}</span><span className="font-medium">{state.values.date || "—"}</span></p>
      <p className="flex justify-between gap-3"><span>{t("travelers")}</span><span className="font-medium">{state.values.travelers}</span></p>
      <p className="flex justify-between gap-3"><span>{money(parsed.price)} {unitLabel}</span><span className="font-medium">{perTraveler ? `× ${state.values.travelers}` : ""}</span></p>
      {breakdown.arrivalTotal ? <p className="flex justify-between gap-3"><span>{offerT("arrivalTransfer")}</span><span>{money(breakdown.arrivalTotal)}</span></p> : null}
      {breakdown.departureTotal ? <p className="flex justify-between gap-3"><span>{offerT("departureTransfer")}</span><span>{money(breakdown.departureTotal)}</span></p> : null}
      <p className="flex justify-between gap-3 border-t border-line pt-2 text-base"><b>{t("estimatedTotalLabel")}</b><b>{money(total)}</b></p>
    </div>
    <p className="mt-3 text-xs leading-5 text-muted">{t("paymentNotice")}</p>
    <p className="mt-2 text-xs leading-5 text-muted"><b>{t("cancellationPolicy")}: </b>{cancellationPolicy}</p>
  </section>;

  return <main className="min-h-[70vh] bg-[#F8FAF5] px-4 py-8 sm:py-12">
    <div className="mx-auto max-w-6xl">
      <nav aria-label={t("steps")} className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted"><Link href="/" className="hover:text-[#006D41]">{common("home")}</Link><span aria-hidden="true">›</span><Link href={tourHref(parsed.tour)} className="max-w-[60vw] truncate hover:text-[#006D41]">{parsed.tour.title[locale]}</Link><span aria-hidden="true">›</span><span aria-current="page">{t("title")}</span></nav>
      <ol aria-label={t("steps")} className="mb-8 grid grid-cols-3 gap-2">
        {[t("stepTrip"), t("stepDetails"), t("stepReview")].map((label, index) => <li key={label} className={`border-b-2 pb-2 text-xs font-semibold sm:text-sm ${state.step === index + 1 ? "border-[#006D41] text-[#006D41]" : state.step > index + 1 ? "border-[#67B500] text-[#333]" : "border-line text-muted"}`}><span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-[#EAF6D6] text-xs text-[#222]">{index + 1}</span>{label}</li>)}
      </ol>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-8">
          <h1 ref={headingRef} tabIndex={-1} id="booking-step-heading" className="text-2xl font-bold outline-none sm:text-3xl">{state.step === 1 ? t("title") : state.step === 2 ? t("stepDetails") : t("review")}</h1>
          {paymentCancelled ? <p role="status" className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{t("paymentCancelled")}</p> : null}
          {state.step === 1 ? <div className="mt-6 space-y-5">
            <label htmlFor="booking-date" className="block text-sm font-semibold">{t("date")}<input id="booking-date" type="date" min={new Date().toISOString().slice(0, 10)} value={state.values.date} onChange={(event) => setField("date", event.target.value)} aria-invalid={Boolean(state.errors.date)} aria-describedby={state.errors.date ? "error-date" : undefined} className="mt-1.5 h-12 w-full rounded-md border border-line px-3 font-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006D41]" />{state.errors.date ? <span id="error-date" className="mt-1 block text-xs font-normal text-red-700">{t(state.errors.date)}</span> : null}</label>
            <label htmlFor="booking-travelers" className="block text-sm font-semibold">{t("travelers")}<input id="booking-travelers" type="number" min={1} max={20} value={state.values.travelers} onChange={(event) => setField("travelers", Number(event.target.value))} aria-invalid={Boolean(state.errors.travelers)} className="mt-1.5 h-12 w-full rounded-md border border-line px-3 font-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006D41]" />{state.errors.travelers ? <span className="mt-1 block text-xs font-normal text-red-700">{t(state.errors.travelers)}</span> : null}</label>
            <label htmlFor="booking-pickup" className="block text-sm font-semibold">{t("pickup")}<input id="booking-pickup" value={state.values.pickup} onChange={(event) => setField("pickup", event.target.value)} className="mt-1.5 h-12 w-full rounded-md border border-line px-3 font-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006D41]" /></label>
            <label htmlFor="booking-notes" className="block text-sm font-semibold">{t("notes")}<textarea id="booking-notes" rows={3} value={state.values.notes} onChange={(event) => setField("notes", event.target.value)} className="mt-1.5 w-full rounded-md border border-line px-3 py-2 font-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006D41]" /></label>
          </div> : null}
          {state.step === 2 ? <div className="mt-6 space-y-5">{textField("name", t("name"), "text", "name")}{textField("email", t("email"), "email", "email")}<div className="grid grid-cols-[130px_1fr] items-end gap-3"><label htmlFor="booking-code" className="block text-sm font-semibold">{t("countryCode")}<select id="booking-code" value={state.values.countryCode} onChange={(event) => setField("countryCode", event.target.value)} className="mt-1.5 h-12 w-full rounded-md border border-line bg-white px-2 font-normal">{countryCodes.map((code) => <option key={code} value={code}>{code}</option>)}</select></label>{textField("phone", t("phone"), "tel", "tel")}</div></div> : null}
          {state.step === 3 ? <div className="mt-6 space-y-5">
            <p className="text-sm leading-6 text-muted">{t("reviewIntro")}</p>
            <p className="rounded-lg border border-[#929547]/40 bg-[#F8FAF5] p-3 text-sm leading-6"><b>{t("cancellationPolicy")}: </b>{cancellationPolicy}</p>
            <dl className="grid gap-3 rounded-xl bg-[#F8FAF5] p-4 text-sm sm:grid-cols-2"><div><dt className="text-muted">{t("name")}</dt><dd className="font-semibold">{state.values.name}</dd></div><div><dt className="text-muted">{t("email")}</dt><dd className="font-semibold">{state.values.email}</dd></div><div><dt className="text-muted">{t("phone")}</dt><dd className="font-semibold">{state.values.countryCode} {state.values.phone}</dd></div><div><dt className="text-muted">{t("pickup")}</dt><dd className="font-semibold">{state.values.pickup || "—"}</dd></div><div className="sm:col-span-2"><dt className="text-muted">{t("notes")}</dt><dd className="font-semibold">{state.values.notes || "—"}</dd></div></dl>
            <label className="flex min-h-11 items-start gap-3 text-sm leading-6"><input type="checkbox" checked={state.values.consent} onChange={(event) => setField("consent", event.target.checked)} className="mt-1 h-5 w-5 accent-[#006D41]" /><span>{t("consentPrefix")} <Link href={{pathname: "/terms"}} className="font-semibold text-[#006D41] underline">{t("terms")}</Link> {t("and")} <Link href={{pathname: "/privacy"}} className="font-semibold text-[#006D41] underline">{t("privacy")}</Link></span></label>
            {state.errors.consent ? <p className="text-xs text-red-700">{t(state.errors.consent)}</p> : null}
          </div> : null}
          {submitError ? <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{t(submitError)}</p> : null}
          <div className="mt-8 flex flex-wrap justify-between gap-3">{state.step > 1 ? <button type="button" onClick={() => dispatch({type: "step", step: (state.step - 1) as 1 | 2})} className="inline-flex min-h-12 items-center justify-center rounded-md border border-line px-5 text-sm font-semibold">{t("back")}</button> : <span />}{state.step < 3 ? <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#67B500] px-6 text-sm font-bold text-black">{t("continue")}</button> : <button type="submit" disabled={state.pending} className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#67B500] px-6 text-sm font-bold text-black disabled:opacity-60">{state.pending ? t("sending") : t("send")}</button>}</div>
        </form>
        <div className="hidden lg:block lg:sticky lg:top-6">{Summary}</div>
        <details className="order-first rounded-xl border border-line bg-white p-4 lg:hidden"><summary className="cursor-pointer font-semibold">{t("summary")} · {money(total)}</summary><div className="mt-4">{Summary}</div></details>
      </div>
    </div>
  </main>;
}
