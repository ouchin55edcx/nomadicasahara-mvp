import { Metadata } from "next";
import Link from "next/link";
import SettingsForm from "./SettingsForm";
import GalleryManagement from "./GalleryManagement";
import SecuritySettings from "./SecuritySettings";
import { getGalleryImages } from "@/app/actions/gallery";

export const metadata: Metadata = { title: "General Settings | Admin" };

export default async function GeneralSettingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const activeTab = resolvedSearchParams?.tab === "gallery" ? "gallery" : resolvedSearchParams?.tab === "security" ? "security" : "general";
  const [galleryImages] = await Promise.all([getGalleryImages()]);
  const settingsObj: Record<string, string | null> = {site_name:"Toledano Viajes",site_logo_url:""};

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-gray-500">Partner</p>
        <h1 className="text-3xl font-black text-gray-900 sm:text-[2rem]">General Settings</h1>
        <p className="mt-1 max-w-2xl text-sm font-medium text-gray-500 sm:text-base">
          Manage partner access and site settings.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/partner/params"
          className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
            activeTab === "general"
              ? "bg-[#67B500] text-white"
              : "border border-gray-200 bg-white text-gray-600 hover:border-[#67B500]"
          }`}
        >
          General
        </Link>
        <Link
          href="/partner/params?tab=security"
          className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
            activeTab === "security"
              ? "bg-[#67B500] text-white"
              : "border border-gray-200 bg-white text-gray-600 hover:border-[#67B500]"
          }`}
        >
          Security
        </Link>
        <Link
          href="/partner/params?tab=gallery"
          className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
            activeTab === "gallery"
              ? "bg-[#67B500] text-white"
              : "border border-gray-200 bg-white text-gray-600 hover:border-[#67B500]"
          }`}
        >
          Gallery
        </Link>
      </div>

      {activeTab === "general" ? <SettingsForm initialSettings={settingsObj} /> : activeTab === "security" ? <SecuritySettings /> : <GalleryManagement initialSlots={galleryImages} showHeader={false} />}
    </div>
  );
}
