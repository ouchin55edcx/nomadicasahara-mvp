import { Skeleton } from "@/components/ui/skeleton";

export default function PartnerLoading() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Cargando">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-sm border border-[#E5E5E5] bg-white p-5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-3 h-8 w-24" />
            <Skeleton className="mt-3 h-3 w-36" />
          </div>
        ))}
      </div>

      <div className="rounded-sm border border-[#E5E5E5] bg-white p-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="mt-5 flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-10 w-10 shrink-0" />
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="hidden h-10 w-32 sm:block" />
              <Skeleton className="hidden h-10 w-24 md:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
