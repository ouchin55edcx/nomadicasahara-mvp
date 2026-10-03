import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookingDetails from "@/components/partner/BookingDetails";
import { getBookingById } from "@/content/partner-mock";

export const metadata: Metadata = {
  title: "Detalle de reserva",
  robots: { index: false, follow: false },
};

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = getBookingById(decodeURIComponent(id));

  if (!booking) notFound();

  return <BookingDetails booking={booking} />;
}
