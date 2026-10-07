"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  Star,
  Check,
  X,
  Eye,
  Send,
  Loader2,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import {
  approveReview,
  rejectReview,
  sendReviewRequest,
  getAllReviews,
} from "@/app/actions/reviews";

type StatusFilter = "all" | "pending" | "approved" | "rejected" | "unsent";

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3.5 w-3.5 ${
            s <= rating ? "fill-[#00aa6c] text-[#00aa6c]" : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}



export default function ReviewsManagement({
  initialReviews,
  initialOffset,
}: {
  initialReviews: any[];
  initialOffset: number;
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [statusFilter, setFilter] = useState<StatusFilter>("pending");
  const [selected, setSelected] = useState<any | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [offset, setOffset] = useState(initialOffset);
  const [hasMore, setHasMore] = useState(initialReviews.length === 50);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  }

  const filtered = reviews.filter((r) => {
    if (statusFilter === "unsent") return !r.body || r.body.length === 0;
    if (statusFilter === "pending") return r.status === "pending" && r.body?.length > 0;
    if (statusFilter === "all") return r.body?.length > 0;
    return r.status === statusFilter;
  });



  return (
    <div className="space-y-6">
      {/* ── FILTER TABS ────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {(["pending", "all", "approved", "rejected", "unsent"] as StatusFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
              statusFilter === f
                ? "bg-[#67B500] text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:border-[#67B500]"
            }`}
          >
            {f === "unsent" ? "Not sent yet" : f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ml-2 text-xs opacity-70">
              (
              {f === "unsent"
                ? reviews.filter((r) => !r.body || r.body.length === 0).length
                : f === "all"
                  ? reviews.filter((r) => r.body?.length > 0).length
                  : reviews.filter((r) => r.status === f && r.body?.length > 0).length}
              )
            </span>
          </button>
        ))}
      </div>

      {/* ── REVIEWS TABLE ─────────────────────────────────── */}
      <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <span className="text-4xl">⭐</span>
            <p className="mt-4 text-lg font-black text-gray-300">No reviews in this category</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Trek", "Tourist", "Rating", "Review", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-4 text-left text-[11px] font-black tracking-widest text-gray-400 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((review) => (
                <tr key={review.id} className="group transition-colors hover:bg-[#f7fdf9]">
                  {/* Trek */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {review.treks?.cover_image && (
                        <div className="relative h-9 w-12 shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={review.treks.cover_image}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <p className="line-clamp-2 max-w-[120px] text-xs font-bold text-gray-900">
                        {review.treks?.title ?? "—"}
                      </p>
                    </div>
                  </td>

                  {/* Tourist */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-gray-800">{review.tourist_name}</p>
                    <p className="text-[11px] text-gray-400">{review.tourist_email}</p>
                  </td>

                  {/* Rating */}
                  <td className="px-5 py-4">
                    {review.rating && review.body ? (
                      <div className="space-y-1">
                        <RatingStars rating={review.rating} />
                        <p className="text-xs font-black text-gray-600">{review.rating}/5</p>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Not submitted</span>
                    )}
                  </td>

                  {/* Review excerpt */}
                  <td className="max-w-[200px] px-5 py-4">
                    {review.body ? (
                      <div>
                        {review.title && (
                          <p className="mb-0.5 line-clamp-1 text-xs font-bold text-gray-800">
                            "{review.title}"
                          </p>
                        )}
                        <p className="line-clamp-2 text-xs text-gray-500">{review.body}</p>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-amber-600">Awaiting tourist</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-black tracking-wide uppercase ${
                        review.status === "approved"
                          ? "bg-emerald-100 text-gray-800"
                          : review.status === "rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {review.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => {
                          setSelected(review);
                          setShowReject(false);
                          setRejectNote("");
                        }}
                        className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-[11px] font-bold text-gray-600 transition-all hover:border-[#67B500] hover:text-[#67B500]"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </button>

                      {/* Quick approve */}
                      {review.body && review.body.length > 0 && review.status !== "approved" && (
                        <button
                          onClick={() =>
                            startTransition(async () => {
                              const r = await approveReview(review.id);
                              if ("success" in r) {
                                setReviews((prev) =>
                                  prev.map((rv) =>
                                    rv.id === review.id ? { ...rv, status: "approved" } : rv,
                                  ),
                                );
                                showToast("✓ Review approved");
                              }
                            })
                          }
                          disabled={isPending}
                          className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-black text-gray-800 transition-all hover:bg-emerald-100 disabled:opacity-50"
                        >
                          <Check className="h-3 w-3" />
                          Approve
                        </button>
                      )}

                      {/* Send email if not submitted */}
                      {(!review.body || review.body.length === 0) && (
                        <button
                          onClick={() =>
                            startTransition(async () => {
                              const r = await sendReviewRequest(review.booking_id);
                              if ("success" in r) showToast("Email sent ✓");
                              else showToast("❌ " + r.error);
                            })
                          }
                          disabled={isPending}
                          className="flex items-center gap-1 rounded-full bg-[#67B500] px-3 py-1.5 text-[11px] font-black text-white transition-all hover:bg-[#0f3d24] disabled:opacity-50"
                        >
                          <Send className="h-3 w-3" />
                          Send email
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={async () => {
              setIsLoadingMore(true);
              const nextPage = await getAllReviews(offset, 50);
              setReviews((prev) => [...prev, ...nextPage]);
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

      {/* ── DETAIL PANEL ──────────────────────────────────── */}
      {selected && (
        <div className="fixed inset-0 z-[300] flex">
          <div
            className="hidden flex-1 bg-black/40 backdrop-blur-sm lg:block"
            onClick={() => {
              setSelected(null);
              setShowReject(false);
            }}
          />
          <div className="animate-in slide-in-from-right flex h-full w-full flex-col overflow-y-auto bg-white shadow-2xl duration-300 lg:max-w-md">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
              <h2 className="text-lg font-black text-gray-900">Review detail</h2>
              <button
                onClick={() => {
                  setSelected(null);
                  setShowReject(false);
                }}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 space-y-5 px-6 py-6">
              {/* Trek */}
              {selected.treks && (
                <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4">
                  {selected.treks.cover_image && (
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={selected.treks.cover_image}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <p className="text-sm leading-snug font-black text-gray-900">
                    {selected.treks.title}
                  </p>
                </div>
              )}

              {/* Tourist */}
              <div className="space-y-1.5 rounded-2xl bg-gray-50 p-4">
                <p className="mb-2 text-xs font-black tracking-widest text-gray-400 uppercase">
                  Tourist
                </p>
                <p className="font-bold text-gray-800">{selected.tourist_name}</p>
                <p className="text-sm text-gray-500">{selected.tourist_email}</p>
              </div>

              {/* Rating */}
              {selected.rating && selected.body && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <RatingStars rating={selected.rating} />
                    <span className="text-lg font-black text-gray-900">{selected.rating}/5</span>
                  </div>

                  {(selected.rating_guide || selected.rating_value || selected.rating_service) && (
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "Guide", val: selected.rating_guide },
                        { label: "Value", val: selected.rating_value },
                        { label: "Service", val: selected.rating_service },
                      ]
                        .filter((x) => x.val)
                        .map((x) => (
                          <div key={x.label} className="rounded-xl bg-gray-50 p-2.5 text-center">
                            <p className="mb-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                              {x.label}
                            </p>
                            <p className="text-sm font-black text-gray-900">{x.val}/5</p>
                          </div>
                        ))}
                    </div>
                  )}

                  {selected.title && <p className="font-black text-gray-800">"{selected.title}"</p>}
                  <p className="rounded-2xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-600">
                    {selected.body}
                  </p>
                </div>
              )}

              {/* Status */}
              <span
                className={`inline-block rounded-full px-3 py-1 text-[11px] font-black tracking-wide uppercase ${
                  selected.status === "approved"
                    ? "bg-emerald-100 text-gray-800"
                    : selected.status === "rejected"
                      ? "bg-red-100 text-red-600"
                      : "bg-amber-100 text-amber-700"
                }`}
              >
                {selected.status}
              </span>

              <p className="text-xs text-gray-400">
                Submitted{" "}
                {new Date(selected.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Footer actions */}
            {selected.body && selected.body.length > 0 && selected.status !== "approved" && (
              <div className="sticky bottom-0 space-y-3 border-t border-gray-100 bg-white px-6 py-5">
                {showReject ? (
                  <div className="space-y-2">
                    <textarea
                      value={rejectNote}
                      onChange={(e) => setRejectNote(e.target.value)}
                      placeholder="Reason for rejection (optional)..."
                      rows={3}
                      className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm placeholder:text-gray-700 focus:border-red-300 focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowReject(false)}
                        className="flex-1 rounded-full border border-gray-200 py-2.5 text-sm font-bold text-gray-500"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() =>
                          startTransition(async () => {
                            const r = await rejectReview(selected.id, rejectNote);
                            if ("success" in r) {
                              setReviews((prev) =>
                                prev.map((rv) =>
                                  rv.id === selected.id ? { ...rv, status: "rejected" } : rv,
                                ),
                              );
                              setSelected(null);
                              setShowReject(false);
                              showToast("Review rejected");
                            }
                          })
                        }
                        disabled={isPending}
                        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-red-600 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                      >
                        {isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Confirm reject"
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowReject(true)}
                      className="flex-1 rounded-full border-2 border-red-200 bg-red-50 py-3 text-sm font-black text-red-500 transition-all hover:bg-red-100"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() =>
                        startTransition(async () => {
                          const r = await approveReview(selected.id);
                          if ("success" in r) {
                            setReviews((prev) =>
                              prev.map((rv) =>
                                rv.id === selected.id ? { ...rv, status: "approved" } : rv,
                              ),
                            );
                            setSelected(null);
                            showToast("✓ Review approved and published");
                          }
                        })
                      }
                      disabled={isPending}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#67B500] py-3 text-sm font-black text-white transition-all hover:bg-[#0f3d24] disabled:opacity-60"
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Approve & publish
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="animate-in slide-in-from-bottom-4 fixed right-6 bottom-6 z-[400] flex items-center gap-2 rounded-2xl bg-[#67B500] px-5 py-3 text-sm font-semibold text-white shadow-2xl">
          <CheckCircle2 className="h-4 w-4 text-gray-900" />
          {toast}
        </div>
      )}
    </div>
  );
}
