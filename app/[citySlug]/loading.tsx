export default function CatalogLoading() {
  return (
    <main aria-label="Cargando catálogo" className="min-h-[60vh] bg-[#F7F8F5]">
      <div className="mx-auto max-w-[1200px] animate-pulse px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-5 h-3 w-36 rounded bg-[#E2E6DD]" />
        <div className="mb-3 h-9 w-2/3 rounded bg-[#E2E6DD]" />
        <div className="mb-9 h-4 w-1/2 rounded bg-[#E2E6DD]" />
        <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
          <div className="hidden h-80 rounded-sm bg-[#E2E6DD] lg:block" />
          <div className="space-y-4">{[0, 1, 2].map((item) => <div key={item} className="h-56 rounded-sm bg-[#E2E6DD]" />)}</div>
        </div>
      </div>
    </main>
  );
}