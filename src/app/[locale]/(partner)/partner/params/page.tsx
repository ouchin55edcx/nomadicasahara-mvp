import { Metadata } from "next";
import Link from "next/link";
import {getPartnerProfile} from "@/app/actions/profile";
import SecuritySettings from "./SecuritySettings";
import ProfileForm from "../profile/ProfileForm";

export const metadata: Metadata = { title: "Partner Information | Admin" };

export default async function PartnerSettingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const activeTab = resolvedSearchParams?.tab === "security" ? "security" : "information";
  const partner = activeTab === "information" ? await getPartnerProfile() : null;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-gray-500">Partner</p>
        <h1 className="text-3xl font-black text-gray-900 sm:text-[2rem]">Partner Information</h1>
        <p className="mt-1 max-w-2xl text-sm font-medium text-gray-500 sm:text-base">
          Manage your partner account information and security.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/partner/params"
          className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
            activeTab === "information"
              ? "bg-[#67B500] text-white"
              : "border border-gray-200 bg-white text-gray-600 hover:border-[#67B500]"
          }`}
        >
          Partner Information
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
      </div>

      {partner ? <ProfileForm user={partner} /> : <SecuritySettings />}
    </div>
  );
}
