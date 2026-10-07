import { getAllReviews } from "@/app/actions/reviews";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

const ReviewsManagement = dynamic(() => import("./ReviewsManagement"), {
  loading: () => (
    <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
      <div className="animate-pulse space-y-4">
        <div className="h-14 rounded-2xl bg-gray-100" />
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-16 rounded-2xl bg-gray-50" />
        ))}
      </div>
    </div>
  ),
});

export const metadata: Metadata = { title: "Reviews | Admin" };

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews(0, 50);
  const pendingCount = reviews.filter((review:any) => review.status === "pending").length;
  const approvedCount = reviews.filter((review:any) => review.status === "approved").length;
  const rejectedCount = reviews.filter((review:any) => review.status === "rejected").length;
  const ratingValues = reviews.filter((review:any) => review.status === "approved")
    .map((review) => review.rating)
    .filter((rating): rating is number => typeof rating === "number");
  const avgRating =
    ratingValues.length > 0
      ? ratingValues.reduce((sum, rating) => sum + rating, 0) / ratingValues.length
      : 0;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold tracking-wider text-gray-500 uppercase">Reviews</p>
        <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-[2rem]">
          Review moderation
        </h1>
        <p className="mt-1 text-sm font-medium text-gray-500 sm:text-base">
          Approve traveler reviews or reject inappropriate content.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: "Pending review",
            value: pendingCount,
            color: "text-amber-700",
            bg: "bg-amber-50",
          },
          {
            label: "Approved",
            value: approvedCount,
            color: "text-gray-800",
            bg: "bg-emerald-50",
          },
          {
            label: "Rejected",
            value: rejectedCount,
            color: "text-red-700",
            bg: "bg-red-50",
          },
          {
            label: "Avg rating",
            value: avgRating > 0 ? `${avgRating.toFixed(1)} ⭐` : "—",
            color: "text-gray-900",
            bg: "bg-[#edf7f1]",
          },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-3xl ${stat.bg} flex flex-col gap-1 p-6`}>
            <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
              {stat.label}
            </p>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <ReviewsManagement
        initialReviews={reviews}
        initialOffset={reviews.length}
      />
    </div>
  );
}
