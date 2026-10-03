import type { Metadata } from "next";
import ProductsTable from "@/components/partner/ProductsTable";
import { products } from "@/content/partner-mock";

export const metadata: Metadata = {
  title: "Productos",
  robots: { index: false, follow: false },
};

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1A1A1A]">Productos</h2>
        <p className="mt-1 text-sm text-[#666]">
          Tus excursiones publicadas: precios, estado y métricas.
        </p>
      </div>

      <ProductsTable products={products} />
    </div>
  );
}
