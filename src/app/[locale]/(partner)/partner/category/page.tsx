import { getCategories } from "@/app/actions/categories";
import { getPublicProducts } from "@/app/actions/catalog";
import CategoryManagement from "./CategoryManagement";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience Categories",
  description:
    "Organize and manage experience categories to help travelers find their perfect trek.",
};

export default async function PartnerCategoryPage() {
  const categories = await getCategories();
  const products = await getPublicProducts();
  const tours = products.map((product) => ({id: product.id, title: product.title.es, category_name: product.productCategory}));

  return (
    <div>
      <CategoryManagement initialCategories={categories} tours={tours} />
    </div>
  );
}
