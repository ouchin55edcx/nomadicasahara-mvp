"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { updateGalleryImage } from "@/app/actions/gallery";

type GallerySlot = {
  id: string;
  slot: number;
  image_url: string;
  cf_image_id: string | null;
  title: string | null;
};

export default function GalleryManagement({
  initialSlots,
  showHeader = true,
}: {
  initialSlots: GallerySlot[];
  showHeader?: boolean;
}) {
  const [activeTab, setActiveTab] = useState("gallery");
  const [gallerySlots, setGallerySlots] = useState<GallerySlot[]>(initialSlots);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function showToast(type: "success" | "error", text: string) {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleFileSelect(slot: number, file: File | null) {
    if (!file) return;

    setUploadingSlot(slot);

    const formData = new FormData();
    formData.append("file", file);

    const result = await updateGalleryImage(slot, formData);

    if ("success" in result) {
      setGallerySlots((prev) =>
        prev.map((s) => (s.slot === slot ? { ...s, image_url: result.image_url } : s)),
      );
      showToast("success", "Photo updated ✓");
    } else {
      showToast("error", result.error);
    }

    setUploadingSlot(null);

    // Reset file input
    const input = fileInputRefs.current[slot - 1];
    if (input) input.value = "";
  }

  return (
    <div className="space-y-6">
      {showHeader && (
        <div>
          <p className="text-sm font-bold tracking-wider text-gray-500 uppercase">Settings</p>
          <h1 className="text-4xl font-black tracking-tight text-gray-900">Platform Settings</h1>
          <p className="mt-1 text-base font-medium text-gray-500">
            Manage gallery images and platform configuration.
          </p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className={`flex gap-2 ${showHeader ? "" : "hidden"}`}>
        <button
          onClick={() => setActiveTab("gallery")}
          className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
            activeTab === "gallery"
              ? "bg-[#67B500] text-white"
              : "border border-gray-200 bg-white text-gray-600 hover:border-[#67B500]"
          }`}
        >
          Gallery Images
        </button>
        <button
          onClick={() => setActiveTab("general")}
          className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
            activeTab === "general"
              ? "bg-[#67B500] text-white"
              : "border border-gray-200 bg-white text-gray-600 hover:border-[#67B500]"
          }`}
        >
          General
        </button>
      </div>

      {/* Gallery Tab */}
      {activeTab === "gallery" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-black text-gray-900">Home Page Gallery</h2>
            <p className="mt-1 text-sm text-gray-500">
              Upload photos for the 4 gallery slots on the home page. Each upload replaces the
              existing image.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {gallerySlots.map((slot) => (
              <div
                key={slot.id}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                {/* Image Preview */}
                <div className="relative aspect-video w-full">
                  <Image
                    key={slot.image_url}
                    src={slot.image_url}
                    alt={slot.title || `Gallery slot ${slot.slot}`}
                    fill
                    className="object-cover"
                  />

                  {/* Slot Badge */}
                  <div className="absolute top-3 left-3 rounded-full bg-[#67B500]/90 px-3 py-1 text-xs font-black text-white backdrop-blur-sm">
                    Photo {slot.slot}
                  </div>

                  {/* Upload Overlay */}
                  <div
                    className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#67B500]/80 transition-opacity ${
                      uploadingSlot === slot.slot
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {uploadingSlot === slot.slot ? (
                      <>
                        <Loader2 className="h-10 w-10 animate-spin text-white" />
                        <p className="text-sm font-bold text-white">Uploading...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-gray-900" />
                        <p className="text-sm font-black text-white">Replace photo</p>
                        <input
                          type="file"
                          accept="image/*"
                          ref={(el) => {
                            fileInputRefs.current[slot.slot - 1] = el;
                          }}
                          onChange={(e) => handleFileSelect(slot.slot, e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRefs.current[slot.slot - 1]?.click()}
                          className="rounded-full bg-[#67B500] px-6 py-2 text-sm font-black text-white transition-transform hover:scale-105 active:scale-95"
                        >
                          Choose file
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div className="border-t border-gray-100 px-4 py-3">
                  <p className="text-sm font-bold text-gray-700">{slot.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General Tab Placeholder */}
      {showHeader && activeTab === "general" && (
        <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
          <p className="text-lg font-semibold text-gray-800">General settings coming soon...</p>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`animate-in slide-in-from-bottom-4 fixed right-6 bottom-6 z-[400] flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-semibold shadow-2xl ${
            toast.type === "success" ? "bg-[#67B500] text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-gray-900" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          {toast.text}
        </div>
      )}
    </div>
  );
}
