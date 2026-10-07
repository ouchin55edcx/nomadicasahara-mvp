import { getCategories } from "@/app/actions/categories";
import { getTreks } from "@/app/actions/treks";
import CategoryManagement from "./CategoryManagement";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience Categories",
  description:
    "Organize and manage experience categories to help travelers find their perfect trek.",
};

export default async function PartnerCategoryPage() {
  const categories = await getCategories();
  const tours = await getTreks();

  return (
    <div>
      <CategoryManagement initialCategories={categories} tours={tours} />
    </div>
  );
}
