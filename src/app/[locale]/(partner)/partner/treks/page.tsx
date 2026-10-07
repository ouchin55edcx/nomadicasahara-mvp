import { getTreks } from "@/app/actions/treks";
import TreksList from "./TreksList";
import Link from "next/link";
import { Compass, Plus } from "lucide-react";
import { Suspense } from "react";

export const metadata = { title: "Treks | Admin Dashboard" };

export default async function AdminTreksPage() {
  const treks = await getTreks();
  const totalCount = treks.length;
  const publishedCount = treks.filter((trek: any) => trek.is_active).length;

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#67B500]/10 text-gray-900">
              <Compass className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold tracking-wider text-gray-500 uppercase">Treks</p>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-[2rem]">
            Manage treks
          </h1>
          <p className="text-sm font-medium text-gray-400 sm:text-base">
            {totalCount} total ·{" "}
            <span className="text-gray-900">{publishedCount} published</span> ·{" "}
            <span className="text-gray-400">
              {totalCount - publishedCount} drafts
            </span>
          </p>
        </div>

        <Link
          href="/partner/treks/new"
          className="group flex items-center gap-3 rounded-full bg-[#67B500] px-8 py-4 text-sm font-black text-white shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Add new trek
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center rounded-[2.5rem] border-2 border-dashed border-gray-100 bg-white">
            <div className="flex flex-col items-center gap-3 text-gray-300">
              <Compass className="h-10 w-10 animate-spin" />
              <p className="text-sm font-black tracking-widest uppercase">Loading treks...</p>
            </div>
          </div>
        }
      >
        <TreksList initialTreks={treks} />
      </Suspense>
    </div>
  );
}
