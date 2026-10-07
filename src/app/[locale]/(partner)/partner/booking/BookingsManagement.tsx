"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  Search,
  Calendar,
  Clock,
  Users,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  Loader2,
  DollarSign,
  Eye,
  MapPin,
  ClipboardList,
  ShoppingCart,
  Download,
} from "lucide-react";
import {
  updateBookingStatus,
  markBookingPaid,
  getActiveGuides,
  getAllBookings,
} from "@/app/actions/bookings";

type Booking = any;


export default function BookingsManagement({
  initialBookings,
  initialOffset,
}: {
  initialBookings: Booking[];
  initialOffset: number;
}) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [search, setSearch] = useState("");
  const [activityStartDate, setActivityStartDate] = useState("");
  const [activityEndDate, setActivityEndDate] = useState("");
  const [bookingStartDate, setBookingStartDate] = useState("");
  const [bookingEndDate, setBookingEndDate] = useState("");
  const activityEndDateRef = useRef<HTMLInputElement>(null);
  const bookingEndDateRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [offset, setOffset] = useState(initialOffset);
  const [hasMore, setHasMore] = useState(initialBookings.length === 50);
  const [guides, setGuides] = useState<any[]>([]);

  useEffect(() => {
    getActiveGuides().then(setGuides);
  }, []);

  function showToast(type: "success" | "error", text: string) {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  }

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.tourist_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.tourist_email?.toLowerCase().includes(search.toLowerCase()) ||
      b.tourist_phone?.toLowerCase().includes(search.toLowerCase()) ||
      b.booking_ref?.toLowerCase().includes(search.toLowerCase()) ||
      b.treks?.title?.toLowerCase().includes(search.toLowerCase());
    const activityDate = b.trek_date ? String(b.trek_date).slice(0, 10) : "";
    const bookingDate = b.created_at ? String(b.created_at).slice(0, 10) : "";
    const matchActivityDate =
      (!activityStartDate || (activityDate && activityDate >= activityStartDate)) &&
      (!activityEndDate || (activityDate && activityDate <= activityEndDate));
    const matchBookingDate =
      (!bookingStartDate || (bookingDate && bookingDate >= bookingStartDate)) &&
      (!bookingEndDate || (bookingDate && bookingDate <= bookingEndDate));
    return matchSearch && matchActivityDate && matchBookingDate;
  });

  function handleStatusChange(bookingId: string, newStatus: string) {
    startTransition(async () => {
      const result = await updateBookingStatus(bookingId, newStatus as any);
      if ("success" in result) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)),
        );
        if (selected?.id === bookingId) {
          setSelected((prev: Booking | null) => (prev ? { ...prev, status: newStatus } : null));
        }
        showToast("success", `Booking ${newStatus}`);
      } else {
        showToast("error", result.error);
      }
    });
  }

  function handleMarkPaid(bookingId: string) {
    startTransition(async () => {
      const result = await markBookingPaid(bookingId);
      if ("success" in result) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, payment_status: "paid", status: "confirmed" } : b,
          ),
        );
        if (selected?.id === bookingId) {
          setSelected((prev: Booking | null) =>
            prev ? { ...prev, payment_status: "paid", status: "confirmed" } : null,
          );
        }
        showToast("success", "Payment confirmed ✓");
      } else {
        showToast("error", result.error);
      }
    });
  }

  function downloadBookings() {
    const columns = ["Booking ID", "Activity", "Destination", "Activity date", "Time", "Adults", "Children", "Tourist", "Email", "Phone", "Status", "Payment status", "Source", "Total", "Booking date"];
    const csvValue = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const rows = filtered.map((booking) => [
      booking.booking_ref,
      booking.treks?.title ?? "Activity booking",
      booking.treks?.destination ?? booking.treks?.category,
      booking.trek_date,
      booking.trek_time,
      booking.adults,
      booking.children,
      booking.tourist_name,
      booking.tourist_email,
      booking.tourist_phone,
      booking.status,
      booking.payment_status,
      booking.source,
      booking.total_price,
      booking.created_at,
    ]);
    const csv = [columns, ...rows].map((row) => row.map(csvValue).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "bookings.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  // ── STATUS BADGE helper ────────────────────────────────────────
  function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
      pending: "bg-amber-100 text-amber-700",
      confirmed: "bg-emerald-100 text-gray-800",
      cancelled: "bg-red-100 text-red-600",
      completed: "bg-blue-100 text-blue-700",
    };
    return (
      <span
        className={`rounded-full px-3 py-1 text-[11px] font-black tracking-wide uppercase ${styles[status] ?? "bg-gray-100 text-gray-500"}`}
      >
        {status}
      </span>
    );
  }

  function PayBadge({ status }: { status: string }) {
    return (
      <span
        className={`rounded-full px-3 py-1 text-[11px] font-black tracking-wide uppercase ${
          status === "paid" ? "bg-emerald-100 text-gray-800" : "bg-gray-100 text-gray-500"
        }`}
      >
        {status}
      </span>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── FILTERS ───────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search name, email, ref or trek..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-gray-100 bg-white py-3 pr-4 pl-11 text-sm shadow-sm placeholder:text-gray-700 focus:ring-2 focus:ring-[#67B500]/10 focus:outline-none"
          />
        </div>

        <div className="flex w-full flex-nowrap items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm sm:w-auto">
          <span className="shrink-0 text-xs font-bold text-gray-700">Activity date:</span>
          <div className="flex min-w-0 flex-1 items-center sm:flex-none">
            <input aria-label="Activity date start" type="date" value={activityStartDate} onChange={(e) => { setActivityStartDate(e.target.value); if (e.target.value) { const endPicker = activityEndDateRef.current; endPicker?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" }); endPicker?.focus(); endPicker?.showPicker?.(); } }} className="min-w-0 flex-1 border-0 p-0 text-sm outline-none sm:w-[135px] sm:flex-none" />
            <span className="px-2 text-xs text-gray-400">/</span>
            <input ref={activityEndDateRef} aria-label="Activity date end" type="date" min={activityStartDate || undefined} value={activityEndDate} onChange={(e) => setActivityEndDate(e.target.value)} className="min-w-0 flex-1 border-0 p-0 text-sm outline-none sm:w-[135px] sm:flex-none" />
          </div>
        </div>

        <div className="flex w-full flex-nowrap items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm sm:w-auto">
          <span className="shrink-0 text-xs font-bold text-gray-700">Booking date:</span>
          <div className="flex min-w-0 flex-1 items-center sm:flex-none">
            <input aria-label="Booking date start" type="date" value={bookingStartDate} onChange={(e) => { setBookingStartDate(e.target.value); if (e.target.value) { const endPicker = bookingEndDateRef.current; endPicker?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" }); endPicker?.focus(); endPicker?.showPicker?.(); } }} className="min-w-0 flex-1 border-0 p-0 text-sm outline-none sm:w-[135px] sm:flex-none" />
            <span className="px-2 text-xs text-gray-400">/</span>
            <input ref={bookingEndDateRef} aria-label="Booking date end" type="date" min={bookingStartDate || undefined} value={bookingEndDate} onChange={(e) => setBookingEndDate(e.target.value)} className="min-w-0 flex-1 border-0 p-0 text-sm outline-none sm:w-[135px] sm:flex-none" />
          </div>
        </div>

        <button type="button" onClick={downloadBookings} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700">
          <Download className="h-4 w-4" /> Download bookings
        </button>

      </div>

      {/* ── TABLE ─────────────────────────────────────────────── */}
      <div className="overflow-hidden overflow-x-auto rounded-none border-0 bg-transparent shadow-none">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <span className="mb-4 text-5xl">📋</span>
            <p className="text-xl font-black text-gray-300">No bookings found</p>
            {(search || activityStartDate || activityEndDate || bookingStartDate || bookingEndDate) && (
              <button
                onClick={() => {
                  setSearch("");
                  setActivityStartDate("");
                  setActivityEndDate("");
                  setBookingStartDate("");
                  setBookingEndDate("");
                }}
                className="mt-4 text-sm font-bold text-gray-900 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3 bg-white">
            {filtered.map((booking) => {
              const activityDate = new Date(`${booking.trek_date}T${booking.trek_time || "12:00"}`);
              const bookedDate = booking.created_at ? new Date(booking.created_at) : null;
              const guestCount = (booking.adults ?? 0) + (booking.children ?? 0);
              return (
                <article key={booking.id} className="rounded-[25px] border border-gray-200 bg-white px-4 py-4 transition-colors hover:bg-[#f8fbf5] sm:px-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {booking.treks?.cover_image ? (
                        <Image src={booking.treks.cover_image} alt="" fill sizes="56px" className="object-cover" />
                      ) : <MapPin className="absolute inset-0 m-auto h-5 w-5 text-gray-400" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <button onClick={() => setSelected(booking)} className="block max-w-full truncate text-left text-sm font-bold text-gray-800 transition-colors hover:text-[#67B500] sm:text-base">
                        {booking.treks?.title ?? "Activity booking"}
                      </button>
                      <p className="mt-1 truncate text-xs text-gray-500">
                        {booking.treks?.destination ?? booking.treks?.category ?? (booking.booking_type === "private" ? "Private experience" : "Group experience")}
                        <span className="mx-1.5 text-gray-300">|</span>{booking.source === "walkin" ? "Walk-in" : booking.source === "partner" ? "Partner booking" : "Direct booking"}
                      </p>
                    </div>
                    <div className="hidden shrink-0 items-center gap-3 sm:flex">
                      <PayBadge status={booking.payment_status} />
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col gap-3 border-t border-gray-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 flex-wrap items-center gap-x-7 gap-y-3 pl-[68px] text-sm font-medium text-gray-600 sm:gap-x-8 sm:pl-0">
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><Calendar className="h-4 w-4 text-gray-400" />{Number.isNaN(activityDate.getTime()) ? booking.trek_date : activityDate.toLocaleDateString("en-US", {month:"short", day:"numeric", year:"numeric"})}</span>
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><Clock className="h-4 w-4 text-gray-400" />{booking.trek_time || activityDate.toLocaleTimeString("en-US", {hour:"numeric", minute:"2-digit"})}</span>
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><Users className="h-4 w-4 text-gray-400" />{guestCount} {guestCount === 1 ? "participant" : "participants"}</span>
                      <span className="inline-flex items-center gap-1.5 font-mono whitespace-nowrap"><ClipboardList className="h-4 w-4 text-gray-400" />{booking.booking_ref}</span>
                      {bookedDate && !Number.isNaN(bookedDate.getTime()) && <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><ShoppingCart className="h-4 w-4 text-gray-400" />Booked {bookedDate.toLocaleDateString("en-US", {month:"short", day:"numeric", year:"numeric"})}</span>}
                    </div>
                    <div className="flex items-center justify-between gap-3 pl-[68px] sm:justify-end sm:pl-0">
                      <div className="flex items-center gap-2 sm:hidden"><PayBadge status={booking.payment_status} /></div>
                      <button onClick={() => setSelected(booking)} aria-label={`Show more about booking ${booking.booking_ref}`} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-white px-3 text-xs font-bold text-blue-700 transition-colors hover:text-blue-800">
                        <Eye className="h-3.5 w-3.5" /><span>Show more</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={async () => {
              setIsLoadingMore(true);
              const nextPage = await getAllBookings(offset, 50);
              setBookings((prev) => [...prev, ...nextPage]);
              setOffset((prev) => prev + nextPage.length);
              setHasMore(nextPage.length === 50);
              setIsLoadingMore(false);
            }}
            disabled={isLoadingMore}
            className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50"
          >
            {isLoadingMore ? "Loading..." : "Load more"}
          </button>
        </div>
      )}

      {/* ── DETAIL PANEL (right drawer) ──────────────────────── */}
      {selected && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[300] flex">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="animate-in slide-in-from-right flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl duration-300">
            {/* Panel header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
              <div>
                <p className="text-xs font-black tracking-widest text-gray-400 uppercase">
                  Booking detail
                </p>
                <h2 className="text-lg font-black text-gray-900">{selected.booking_ref}</h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <XCircle className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Panel body */}
            <div className="flex-1 space-y-6 px-6 py-6">
              {/* Trek info */}
              {selected.treks && (
                <div className="flex items-center gap-4">
                  {selected.treks.cover_image && (
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-2xl">
                      <Image
                        src={selected.treks.cover_image}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-sm leading-snug font-black text-gray-900">
                      {selected.treks.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {selected.treks.duration}
                      &nbsp;·&nbsp;
                      {selected.booking_type === "private" ? "🔒 Private tour" : "👥 Group tour"}
                    </p>
                  </div>
                </div>
              )}

              {/* Status row */}
              <div className="flex items-center gap-3">
                <StatusBadge status={selected.status} />
                <PayBadge status={selected.payment_status} />
                {selected.payment_status === "unpaid" && (
                  <span className="text-xs font-semibold text-amber-600">Pay at bureau</span>
                )}
              </div>

              {/* Trip details */}
              <div className="space-y-3 rounded-2xl bg-gray-50 p-5">
                <p className="mb-3 text-xs font-black tracking-widest text-gray-400 uppercase">
                  Trip details
                </p>
                {[
                  {
                    icon: Calendar,
                    label: "Date",
                    value: new Date(selected.trek_date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }),
                  },
                  { icon: Clock, label: "Time", value: selected.trek_time },
                  {
                    icon: Users,
                    label: "Guests",
                    value: `${selected.adults} adult${selected.adults > 1 ? "s" : ""}${
                      selected.children > 0
                        ? ` + ${selected.children} child${selected.children > 1 ? "ren" : ""}`
                        : ""
                    }`,
                  },
                ].map((row) => {
                  const Icon = row.icon;
                  return (
                    <div key={row.label} className="flex items-center gap-3">
                      <Icon className="h-4 w-4 shrink-0 text-gray-900" />
                      <span className="w-12 shrink-0 text-xs text-gray-500">{row.label}</span>
                      <span className="text-sm font-semibold text-gray-800">{row.value}</span>
                    </div>
                  );
                })}
              </div>

              {/* Tourist info */}
              <div className="space-y-3 rounded-2xl bg-gray-50 p-5">
                <p className="mb-3 text-xs font-black tracking-widest text-gray-400 uppercase">
                  Tourist
                </p>
                <p className="font-bold text-gray-800">{selected.tourist_name}</p>
                <a
                  href={`mailto:${selected.tourist_email}`}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {selected.tourist_email}
                </a>
                <a
                  href={`tel:${selected.tourist_phone}`}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {selected.tourist_phone}
                </a>
              </div>

              {/* Pricing */}
              <div className="space-y-2 rounded-2xl bg-gray-50 p-5">
                <p className="mb-3 text-xs font-black tracking-widest text-gray-400 uppercase">
                  Pricing
                </p>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    {selected.adults} adult{selected.adults > 1 ? "s" : ""}× $
                    {selected.price_per_adult?.toFixed(2)}
                  </span>
                  <span>${(selected.adults * selected.price_per_adult).toFixed(2)}</span>
                </div>
                {selected.children > 0 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      {selected.children} child{selected.children > 1 ? "ren" : ""}× $
                      {selected.price_per_child?.toFixed(2)}
                    </span>
                    <span>${(selected.children * selected.price_per_child).toFixed(2)}</span>
                  </div>
                )}
                <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 font-black text-gray-900">
                  <span>Total</span>
                  <span>${selected.total_price?.toFixed(2)}</span>
                </div>
              </div>

              {/* Special requests */}
              {selected.special_requests && (
                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                  <p className="mb-2 text-xs font-black tracking-widest text-amber-600 uppercase">
                    Special requests
                  </p>
                  <p className="text-sm text-gray-700">{selected.special_requests}</p>
                </div>
              )}

              {/* Booked on */}
              <p className="text-center text-xs text-gray-400">
                Booked on{" "}
                {new Date(selected.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* Panel footer — actions */}
            <div className="sticky bottom-0 space-y-3 border-t border-gray-100 bg-white px-6 py-5">
              {/* Mark as paid */}
              {selected.payment_status === "unpaid" && selected.status !== "cancelled" && (
                <button
                  onClick={() => handleMarkPaid(selected.id)}
                  disabled={isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#67B500] py-3.5 text-sm font-black text-white transition-all hover:bg-[#0f3d24] active:scale-95 disabled:opacity-60"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Mark as paid & confirm
                </button>
              )}

              {/* Status actions */}
              <div className="grid grid-cols-2 gap-2">
                {selected.status !== "confirmed" && selected.status !== "cancelled" && (
                  <button
                    onClick={() => handleStatusChange(selected.id, "confirmed")}
                    disabled={isPending}
                    className="rounded-full border-2 border-emerald-200 bg-emerald-50 py-2.5 text-xs font-black text-gray-800 transition-all hover:bg-emerald-100 disabled:opacity-50"
                  >
                    ✓ Confirm
                  </button>
                )}
                {selected.status !== "completed" && selected.status !== "cancelled" && (
                  <button
                    onClick={() => handleStatusChange(selected.id, "completed")}
                    disabled={isPending}
                    className="col-span-2 rounded-full border-2 border-blue-200 bg-blue-50 py-2.5 text-xs font-black text-blue-700 transition-all hover:bg-blue-100 disabled:opacity-50"
                  >
                    No show
                  </button>
                )}
                {selected.status !== "cancelled" && (
                  <button
                    onClick={() => handleStatusChange(selected.id, "cancelled")}
                    disabled={isPending}
                    className="col-span-2 rounded-full border-2 border-red-200 bg-red-50 py-2.5 text-xs font-black text-red-500 transition-all hover:bg-red-100 disabled:opacity-50"
                  >
                    Cancel booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`animate-in slide-in-from-bottom-4 fixed right-6 bottom-6 z-[400] flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-semibold shadow-2xl duration-300 ${
            toast.type === "success" ? "bg-[#67B500] text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          {toast.text}
        </div>
      )}
    </div>
  );
}
