import {getLocale} from "next-intl/server";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";

const copy = {
  en: {
    contact: ["Contact", "Talk to our team about a tour or ask for help planning your trip."],
    help: ["Help", "Browse our tours and contact us if you need help choosing an experience or route."],
    terms: ["Terms", "Please contact us if you need the current terms before booking."],
    privacy: ["Privacy policy", "Please contact us if you need the current privacy information before booking."],
    tours: "Browse tours",
    contactLink: "Contact the team",
    home: "Home",
  },
  es: {
    contact: ["Contacto", "Habla con nuestro equipo sobre una excursión o pide ayuda para planificar tu viaje."],
    help: ["Ayuda", "Explora las excursiones y contacta con nosotros si necesitas ayuda para elegir una experiencia o ruta."],
    terms: ["Condiciones", "Contacta con nosotros si necesitas las condiciones vigentes antes de reservar."],
    privacy: ["Política de privacidad", "Contacta con nosotros si necesitas la información de privacidad vigente antes de reservar."],
    tours: "Ver excursiones",
    contactLink: "Contactar con el equipo",
    home: "Inicio",
  },
  pt: {
    contact: ["Contacto", "Fale com a nossa equipa sobre um passeio ou peça ajuda para planear a sua viagem."],
    help: ["Ajuda", "Explore os passeios e contacte-nos se precisar de ajuda para escolher uma experiência ou percurso."],
    terms: ["Termos", "Contacte-nos se precisar dos termos atuais antes de reservar."],
    privacy: ["Política de privacidade", "Contacte-nos se precisar das informações de privacidade atuais antes de reservar."],
    tours: "Ver passeios",
    contactLink: "Contactar a equipa",
    home: "Início",
  },
} as const;

export default async function InfoPage({page}: {page: "contact" | "help" | "terms" | "privacy"}) {
  const locale = await getLocale() as Locale;
  const labels = copy[locale][page];
  const email = process.env.NEXT_PUBLIC_EMAIL;
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");

  return (
    <main className="mx-auto min-h-[50vh] w-full max-w-[1100px] px-4 py-12 sm:py-16">
      <nav aria-label={copy[locale].home} className="mb-4 flex items-center gap-2 text-xs text-muted"><Link href="/" className="hover:text-[#006D41]">{copy[locale].home}</Link><span aria-hidden="true">›</span><span aria-current="page">{labels[0]}</span></nav>
      <h1 className="text-3xl font-semibold text-ink">{labels[0]}</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{labels[1]}</p>
      {page === "contact" && (email || whatsapp) ? (
        <div className="mt-6 flex flex-wrap gap-3">
          {email ? <a className="btn btn-primary" href={`mailto:${email}`}>{email}</a> : null}
          {whatsapp ? <a className="btn btn-primary" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a> : null}
        </div>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
        <Link className="text-brand underline underline-offset-4" href="/tours">{copy[locale].tours}</Link>
        {page !== "contact" ? <Link className="text-brand underline underline-offset-4" href="/contact">{copy[locale].contactLink}</Link> : null}
      </div>
    </main>
  );
}
