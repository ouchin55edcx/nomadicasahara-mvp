import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HotelHero from "@/components/hotels/HotelHero";
import HotelInfo from "@/components/hotels/HotelInfo";
import HotelReviews from "@/components/hotels/HotelReviews";
import RoomList from "@/components/hotels/RoomList";
import {products} from "@/data/catalog";
import {pageMetadata} from "@/lib/seo/metadata";

export const dynamic = "force-static";
export const dynamicParams = false;

const hotels = products.filter((product) => product.type === "hotel");

export function generateStaticParams() {
  return hotels.map((hotel) => ({ id: hotel.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string; id: string}>;
}): Promise<Metadata> {
  const {locale, id} = await params;
  const hotel = hotels.find((product) => product.id === id);

  if (!hotel) {
    return {title: "Hotel no encontrado | Nomadica Sahara", robots: {index: false, follow: false}};
  }

  return pageMetadata({
    locale,
    pathname: `/hoteles/${id}`,
    title: hotel.title,
    description:
      hotel.description ??
      `Consulta habitaciones, opiniones e instalaciones de ${hotel.title} en Marrakech.`,
    image: hotel.image,
  });
}

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{locale: string; id: string}>;
}) {
  const {id} = await params;
  const hotel = hotels.find((product) => product.id === id);
  if (!hotel) notFound();

  return (
    <>
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
    </>
  );
}