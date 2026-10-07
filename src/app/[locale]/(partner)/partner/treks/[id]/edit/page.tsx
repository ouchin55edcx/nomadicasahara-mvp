import { getTrekById } from "@/app/actions/treks";
import { getCategories } from "@/app/actions/categories";
import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import dynamic from "next/dynamic";

const TrekWizard = dynamic(() => import("../../new/TrekWizard"), {
  loading: () => (
    <div className="min-h-screen bg-[#f5f7f6] p-6">
      <div className="animate-pulse space-y-6">
        <div className="h-12 w-64 rounded-2xl bg-gray-200" />
        <div className="h-[70vh] rounded-[2rem] bg-white" />
      </div>
    </div>
  ),
});

export const metadata = { title: "Edit Trek | Admin" };

export default async function EditTrekPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();

  const [trek, categories] = await Promise.all([getTrekById(id), getCategories()]);

  if (!trek) notFound();

  return <TrekWizard categories={categories} initialData={trek} trekId={id} />;
}
