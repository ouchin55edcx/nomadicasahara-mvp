import type {Metadata} from "next";
import dynamic from "next/dynamic";
import {getAllBookings} from "@/app/actions/bookings";

const BookingsManagement = dynamic(() => import("./BookingsManagement"), {
  loading: () => (
    <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
      <div className="animate-pulse space-y-4">
        <div className="flex gap-3">
          <div className="h-11 flex-1 rounded-2xl bg-gray-100" />
          <div className="h-11 w-36 rounded-2xl bg-gray-100" />
          <div className="h-11 w-36 rounded-2xl bg-gray-100" />
        </div>
        {Array.from({length: 6}).map((_, index) => <div key={index} className="h-16 rounded-2xl bg-gray-50" />)}
      </div>
    </div>
  ),
});

export const metadata: Metadata = {title: "Bookings | Partner Dashboard"};

export default async function AdminBookingPage() {
  const bookings = await getAllBookings(0, 50);
  return <BookingsManagement initialBookings={bookings} initialOffset={bookings.length} />;
}
