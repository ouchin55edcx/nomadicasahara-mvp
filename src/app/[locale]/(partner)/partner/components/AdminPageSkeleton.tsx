type AdminPageSkeletonProps = {
  showStats?: boolean;
  showSecondaryCard?: boolean;
  showToolbar?: boolean;
  rows?: number;
};

export default function AdminPageSkeleton({
  showStats = true,
  showSecondaryCard = false,
  showToolbar = true,
  rows = 6,
}: AdminPageSkeletonProps) {
  return (
    <div className="animate-pulse space-y-8">
      <div className="space-y-3">
        <div className="h-4 w-24 rounded-full bg-gray-200" />
        <div className="h-9 w-72 rounded-2xl bg-gray-200" />
        <div className="h-4 w-full max-w-xl rounded-full bg-gray-100" />
      </div>

      {showStats && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <div className="mb-3 h-3 w-24 rounded-full bg-gray-100" />
              <div className="h-8 w-16 rounded-full bg-gray-200" />
            </div>
          ))}
        </div>
      )}

      {showSecondaryCard && (
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-2xl bg-gray-200" />
            <div className="flex-1 space-y-3">
              <div className="h-3 w-24 rounded-full bg-gray-100" />
              <div className="h-6 w-48 rounded-full bg-gray-200" />
              <div className="h-4 w-full max-w-lg rounded-full bg-gray-100" />
            </div>
          </div>
        </div>
      )}

      <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
        {showToolbar && (
          <div className="mb-6 flex flex-wrap gap-3">
            <div className="h-11 flex-1 rounded-2xl bg-gray-100" />
            <div className="h-11 w-36 rounded-2xl bg-gray-100" />
            <div className="h-11 w-36 rounded-2xl bg-gray-100" />
          </div>
        )}

        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 rounded-2xl border border-gray-100 p-4">
              <div className="h-12 w-12 rounded-2xl bg-gray-100" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 rounded-full bg-gray-200" />
                <div className="h-3 w-1/2 rounded-full bg-gray-100" />
              </div>
              <div className="h-9 w-24 rounded-full bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
