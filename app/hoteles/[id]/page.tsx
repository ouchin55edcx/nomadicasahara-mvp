import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MainNav from "@/components/MainNav";
import HotelHero from "@/components/hotels/HotelHero";
import HotelInfo from "@/components/hotels/HotelInfo";
import HotelReviews from "@/components/hotels/HotelReviews";
import RoomList from "@/components/hotels/RoomList";
import { products } from "@/content/catalog";

export const dynamic = "force-static";
export const dynamicParams = false;

const hotels = products.filter((product) => product.type === "hotel");

export function generateStaticParams() {
  return hotels.map((hotel) => ({ id: hotel.id }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const hotel = hotels.find((product) => product.id === params.id);
  return {
    title: hotel ? `${hotel.title} | Nomadica Sahara` : "Hotel no encontrado | Nomadica Sahara",
    description:
      hotel?.description ??
      `Consulta habitaciones, opiniones e instalaciones de ${hotel?.title ?? "este alojamiento"} en Marrakech.`,
  };
}

export default function HotelDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const hotel = hotels.find((product) => product.id === params.id);
  if (!hotel) notFound();

  return (
    <>
      <Header />
      <MainNav />
      <main className="mx-auto min-h-screen w-full max-w-[1200px] bg-white px-3 pb-12 pt-5 text-ink sm:px-5 lg:px-6">
        <HotelHero hotel={hotel} />

        <RoomList hotel={hotel} />

        <section className="mt-8 flex flex-wrap items-center justify-between gap-4 border border-green-200 bg-green-50 px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-sm font-semibold">Guardar presupuesto</h2>
            <p className="mt-1 text-xs text-muted">
              Guarda los detalles de esta estancia para consultarlos más tarde.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex min-h-10 items-center justify-center bg-green-700 px-5 text-xs font-semibold uppercase text-white transition-colors hover:bg-green-800"
          >
            Guardar
          </button>
        </section>

        <HotelReviews hotel={hotel} />
        <HotelInfo hotel={hotel} />

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border border-green-200 bg-green-50 px-4 py-4 text-sm">
          <p className="font-medium">¿Listo para organizar tu estancia en Marrakech?</p>
          <a href="#rooms" className="font-semibold text-green-800 underline decoration-green-600 underline-offset-2">
            Elegir habitación
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}