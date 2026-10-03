import type { Metadata } from "next";
import { Phone } from "lucide-react";
import CategoryTiles from "@/components/landing/CategoryTiles";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MainNav from "@/components/MainNav";
import { allContent } from "@/content/landing/all";

export const metadata: Metadata = {
  title: "Sobre nosotros | Nomadica Sahara",
  description:
    "Conoce Nomadica Sahara, nuestras excursiones por Marruecos y cómo contactar con nuestro equipo para una cita previa.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <MainNav />

      <main className="mx-auto w-full max-w-[1200px] px-3 pb-12">
        <Hero
          image="/images/banner-kasbahs.jpg"
          alt="Kasbahs de adobe en el sur de Marruecos"
          title="Marruecos se descubre mejor viajando a tu ritmo."
        />

        <section className="mt-10 grid gap-5 border-b border-line pb-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-nav text-brand">
              Sobre Nomadica Sahara
            </p>
            <h1 className="mt-2 text-2xl font-semibold leading-tight text-ink sm:text-3xl">
              Experiencias para conocer el Marruecos real
            </h1>
          </div>
          <div className="space-y-3 text-[15px] leading-relaxed text-muted">
            <p>
              Organizamos excursiones y viajes por los paisajes que hacen único
              al país: las medinas, las montañas del Atlas, las kasbahs, el
              desierto y la costa.
            </p>
            <p>
              Puedes elegir una salida desde Marrakech, descubrir una
              experiencia de un día o planificar una ruta de varias jornadas.
              Encontrarás opciones con guía, transporte privado y estancias en
              riads o campamentos.
            </p>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="why-heading">
          <h2 id="why-heading" className="text-2xl font-medium text-ink">
            Por qué viajar con nosotros
          </h2>
          <div className="mt-5">
            <CategoryTiles tiles={allContent.whyTiles} columns={3} />
          </div>
        </section>

        <section className="mt-10 flex flex-col gap-4 border-y border-line py-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink">
              Agencias y cita previa
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
              Para consultar agencias disponibles o solicitar una cita, contacta
              con nuestro equipo por teléfono.
            </p>
          </div>
          <a href="tel:913300732" className="btn btn-primary gap-2">
            <Phone className="h-4 w-4" aria-hidden="true" />
            91 33 00 732
          </a>
        </section>
      </main>

      <Footer />
    </>
  );
}