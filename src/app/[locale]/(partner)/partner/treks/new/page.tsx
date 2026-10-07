import { getCurrentUser } from "@/lib/auth";
import { getCategories } from "@/app/actions/categories";
import dynamic from "next/dynamic";

const TrekWizard = dynamic(() => import("./TrekWizard"), {
  loading: () => (
    <div className="min-h-screen bg-[#f5f7f6] p-6">
      <div className="animate-pulse space-y-6">
        <div className="h-12 w-64 rounded-2xl bg-gray-200" />
        <div className="h-[70vh] rounded-[2rem] bg-white" />
      </div>
    </div>
  ),
});

export const metadata = { title: "Add New Trek | Admin" };

export default async function NewTrekPage() {
  const user = await getCurrentUser();
  const categories = await getCategories();
  return <TrekWizard categories={categories} />;
}
