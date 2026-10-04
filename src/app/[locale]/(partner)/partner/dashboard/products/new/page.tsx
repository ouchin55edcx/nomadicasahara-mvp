import type { Metadata } from "next";
import ProductForm from "@/components/partner/ProductForm";

export const metadata: Metadata = {
  title: "Crear producto",
  robots: { index: false, follow: false },
};

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1A1A1A]">Crear producto</h2>
        <p className="mt-1 text-sm text-[#666]">
          Sigue los6 pasos para publicar una nueva excursión en tu portal.
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
