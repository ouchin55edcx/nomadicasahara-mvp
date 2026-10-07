"use client";

import { useState, useTransition } from "react";
import { Image as ImageIcon, Upload, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";
import { updateGeneralSettings, uploadLogo } from "@/app/actions/settings";
import Image from "next/image";

interface SettingsFormProps {
  initialSettings: Record<string, string | null>;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [siteName, setSiteName] = useState(initialSettings["site_name"] || "Toledano Viajes");
  const [logoUrl, setLogoUrl] = useState(initialSettings["site_logo_url"] || "");
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const fd = new FormData();
    fd.append("file", file);

    const result = await uploadLogo(fd);

    setUploading(false);

    if ("error" in result) {
      setError(result.error || "Upload failed");
    } else {
      setLogoUrl(result.url);
      setSaved(false);
    }
  }

  async function handleSave() {
    startTransition(async () => {
      setError(null);
      setSaved(false);

      const result = await updateGeneralSettings({
        site_name: siteName,
        site_logo_url: logoUrl,
      });

      if ("error" in result) {
        setError(result.error || "Save failed");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    });
  }

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="mb-6 text-2xl font-black text-gray-900">Branding</h2>

      <div className="space-y-8">
        {/* Logo Upload */}
        <div className="space-y-4">
          <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase">Site Logo</h3>

          <label
            className={`relative flex h-40 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all hover:border-[#67B500] ${
              logoUrl ? "border-[#67B500] bg-[#f7fdf9]" : "border-gray-200 hover:bg-[#f7fdf9]"
            }`}
          >
            {uploading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/90">
                <Loader2 className="h-6 w-6 animate-spin text-gray-900" />
              </div>
            )}

            {logoUrl && !uploading && (
              <>
                <div className="relative h-28 w-28 overflow-hidden rounded-xl bg-white p-2">
                  <Image src={logoUrl} alt="Site logo" fill className="object-contain" />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setLogoUrl("");
                  }}
                  className="absolute top-2 right-2 z-10 rounded-full bg-white p-1.5 shadow hover:bg-red-50"
                >
                  <X className="h-3 w-3 text-gray-500" />
                </button>
              </>
            )}

            {!logoUrl && !uploading && (
              <div className="flex flex-col items-center gap-2 text-center">
                <ImageIcon className="h-8 w-8 text-gray-300" />
                <p className="text-sm font-semibold text-gray-500">Upload logo</p>
                <p className="text-xs text-gray-400">PNG, JPG or WebP · Max 5 MB</p>
              </div>
            )}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleLogoUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Site Name */}
        <div className="space-y-4">
          <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase">Site Name</h3>

          <div>
            <label className="text-sm font-bold text-gray-700">Display name</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Toledano Viajes"
              className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm placeholder:text-gray-700 focus:bg-white focus:ring-2 focus:ring-[#67B500]/10 focus:outline-none"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={isPending || uploading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#67B500] py-4 text-base font-black text-white shadow-lg transition-all hover:bg-[#0f3d24] active:scale-95 disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <CheckCircle2 className="h-5 w-5" />✓ Settings saved!
            </>
          ) : (
            <>
              <Upload className="h-5 w-5" />
              Save settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}
