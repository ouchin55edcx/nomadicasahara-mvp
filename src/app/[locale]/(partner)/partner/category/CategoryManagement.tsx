"use client";

import { useState, useTransition, useEffect } from "react";
import {useRouter} from "next/navigation";
import {
  Category,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/app/actions/categories";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface CategoryManagementProps {
  initialCategories: Category[];
  tours: any[];
}

export default function CategoryManagement({ initialCategories, tours }: CategoryManagementProps) {
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const router = useRouter();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const filteredCategories = initialCategories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  function getCategoryTours(category: Category) {
    const normalize = (value?: string) => value?.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ") ?? "";
    return tours.filter((tour) =>
      tour.category_id === category.id ||
      [tour.category_name, tour.category].some((value) => normalize(value) === normalize(category.name)),
    );
  }

  useEffect(() => {
    setPhotoUrl(editingCategory?.photo || "");
    setImageFile(null);
    setRemovePhoto(false);
    setPhotoError(null);
  }, [editingCategory, isModalOpen]);

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.currentTarget.value = "";
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Image must be 5 MB or smaller.");
      return;
    }
    setPhotoError(null);
    setImageFile(file);
    setPhotoUrl(URL.createObjectURL(file));
    setRemovePhoto(false);
  }

  async function handleSubmit(formData: FormData) {
    setMessage(null);
    const payload = new FormData();
    payload.set("name", String(formData.get("name") || ""));
    payload.set("description", String(formData.get("description") || ""));
    payload.set("removeImage", String(removePhoto));
    if (imageFile) payload.set("image", imageFile);
    startTransition(async () => {
      const result = editingCategory
        ? await updateCategory(editingCategory.id, payload)
        : await createCategory(payload);

      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({
          type: "success",
          text: `Category ${editingCategory ? "updated" : "created"} successfully`,
        });
        setIsModalOpen(false);
        setEditingCategory(null);
        setPhotoUrl("");
        setImageFile(null);
        setRemovePhoto(false);
        setPhotoError(null);
        router.refresh();
      }
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;

    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result.error) {
        alert(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-black/5 bg-white py-3 pr-4 pl-11 text-sm shadow-sm transition-all placeholder:text-gray-700 focus:ring-4 focus:ring-[#67B500]/5 focus:outline-none"
          />
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-full bg-[#67B500] px-6 py-3 text-sm font-bold text-white shadow-xl shadow-[#67B500]/20 transition-transform hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {message && (
        <div
          className={`animate-in fade-in slide-in-from-top-2 flex items-center gap-3 rounded-2xl p-4 text-sm font-medium duration-300 ${
            message.type === "success"
              ? "border border-emerald-100 bg-emerald-50 text-gray-800"
              : "border border-red-100 bg-red-50 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          {message.text}
        </div>
      )}

      {/* Stats row */}
      <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
        <span>
          <span className="text-lg font-black text-gray-900">{filteredCategories.length}</span>{" "}
          {filteredCategories.length === 1 ? "category" : "categories"}
        </span>
        {searchQuery && (
          <span className="text-gray-400">— filtered from {initialCategories.length} total</span>
        )}
      </div>

      {/* Category cards */}
      <div className="flex flex-col gap-3">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => {
            const categoryTours = getCategoryTours(category);
            const expanded = !!expandedCategories[category.id];
            return (
              <article key={category.id} className="rounded-[25px] border border-gray-200 bg-white p-4 transition-colors hover:bg-[#f8fbf5] sm:p-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                    {category.photo ? <img src={category.photo} alt={category.name} className="h-full w-full object-cover" /> : <ImageIcon className="h-5 w-5 text-gray-400" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-bold text-gray-900">{category.name}</p>
                    <p className="mt-1 line-clamp-1 text-sm text-gray-500">{category.description || "No description"}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button type="button" onClick={() => { setEditingCategory(category); setIsModalOpen(true); }} aria-label={`Edit ${category.name}`} className="rounded-full border border-gray-200 bg-white p-2 text-gray-700 transition-colors hover:border-[#67B500] hover:text-gray-900">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => handleDelete(category.id)} disabled={isPending} aria-label={`Delete ${category.name}`} className="rounded-full border border-gray-200 bg-white p-2 text-gray-700 transition-colors hover:border-red-300 hover:text-red-600 disabled:opacity-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-xs font-medium text-gray-500">{categoryTours.length} {categoryTours.length === 1 ? "tour" : "tours"}</span>
                  <button type="button" onClick={() => setExpandedCategories((current) => ({ ...current, [category.id]: !expanded }))} aria-expanded={expanded} className="inline-flex items-center gap-1 text-sm font-bold text-blue-700 hover:text-blue-800">
                    {expanded ? "Show less" : "Show more"}
                    {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
                {expanded && (
                  <div className="mt-2 border-t border-gray-100 pt-2">
                    {categoryTours.length ? (
                      <ul className="divide-y divide-gray-100">
                        {categoryTours.map((tour, tourIndex) => <li key={tour.id ?? `${category.id}-${tourIndex}`} className="py-2 text-sm font-medium text-gray-800">{tour.title}</li>)}
                      </ul>
                    ) : <p className="py-2 text-sm text-gray-500">No tours in this category yet.</p>}
                  </div>
                )}
              </article>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-full bg-gray-50 p-6">
              <ImageIcon className="h-10 w-10 text-gray-200" />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              {searchQuery ? "No categories match your search" : "No categories yet"}
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              {searchQuery
                ? "Try a different search term"
                : "Add your first category to get started"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setIsModalOpen(true);
                }}
                className="mt-6 flex items-center gap-2 rounded-full bg-[#67B500] px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#0f3d24]"
              >
                <Plus className="h-4 w-4" /> Add category
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="animate-in fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm duration-200">
          <div className="animate-in zoom-in-95 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2.5rem] bg-white shadow-2xl duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 px-8 py-6">
              <h2 className="text-2xl font-black text-gray-900">
                {editingCategory ? "Edit Category" : "New Category"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingCategory(null);
                }}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form action={handleSubmit} className="grid grid-cols-1 items-start gap-6 p-6 sm:p-8 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Category Photo <span className="font-normal text-gray-500">(optional)</span></label>

                <label
                  className={`relative flex h-56 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all ${
                    photoUrl
                      ? "border-[#67B500]"
                      : "border-gray-200 hover:border-[#67B500] hover:bg-[#f7fdf9]"
                  }`}
                >
                  {isPending && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-white/90">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-900" />
                      <p className="text-sm font-semibold text-gray-900">Saving to Neon…</p>
                    </div>
                  )}

                  {photoUrl && !isPending && (
                    <>
                      <img src={photoUrl} alt="Preview" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all hover:bg-black/30 hover:opacity-100">
                        <span className="rounded-full bg-black/50 px-4 py-2 text-sm font-semibold text-white">
                          Change photo
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setPhotoUrl("");
                          setImageFile(null);
                          setRemovePhoto(Boolean(editingCategory));
                        }}
                        className="absolute top-2 right-2 z-10 rounded-full bg-white p-1.5 shadow-lg transition-colors hover:bg-red-50"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    </>
                  )}

                  {!photoUrl && !isPending && (
                    <div className="flex flex-col items-center gap-2 p-6 text-center">
                      <UploadCloud className="h-8 w-8 text-gray-300" />
                      <p className="text-sm font-semibold text-gray-500">Click to upload a photo</p>
                      <p className="text-xs text-gray-400">JPG, PNG or WebP · Max 5 MB</p>
                      <span className="pointer-events-none mt-1 rounded-full bg-[#67B500] px-4 py-2 text-xs font-bold text-white">
                        Browse file
                      </span>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>

                {photoError && (
                  <p className="flex items-center gap-1.5 text-xs font-medium text-red-500">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {photoError}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-700">Category Name</label>
                  <input
                    name="name"
                    defaultValue={editingCategory?.name}
                    required
                    placeholder="e.g., Adventure Tours"
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black transition-all placeholder:text-gray-700 focus:bg-white focus:ring-4 focus:ring-[#67B500]/5 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingCategory?.description || ""}
                    rows={6}
                    placeholder="What makes this category special?"
                    className="mt-2 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black transition-all placeholder:text-gray-700 focus:bg-white focus:ring-4 focus:ring-[#67B500]/5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="col-span-full flex gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setEditingCategory(null); }}
                  className="transition-active flex-1 rounded-full border border-gray-200 py-3.5 text-sm font-bold text-gray-600 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="transition-active flex-1 rounded-full bg-[#67B500] py-3.5 text-sm font-bold text-white shadow-xl shadow-[#67B500]/10 hover:bg-[#67B500]/90 active:scale-95 disabled:opacity-70"
                >
                  {isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </div>
                  ) : editingCategory ? (
                    "Update Category"
                  ) : (
                    "Create Category"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
