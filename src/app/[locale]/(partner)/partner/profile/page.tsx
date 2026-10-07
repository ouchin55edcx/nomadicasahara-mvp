import { getCurrentUser } from "@/lib/auth";
import type { AuthUser } from "@/lib/auth";
import ProfileForm from "./ProfileForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Profile",
  description: "Manage your administrative account settings and personal information.",
};

export default async function AdminProfilePage() {
  const user = await getCurrentUser();


  const publicAdmin = user ?? { full_name: "Public Admin", email: "public@nomadicashara.com", role: "partner" };

  return (
    <div className="space-y-8 py-4">
      <div>
        <p className="text-sm font-bold tracking-wider text-gray-500 uppercase">Settings</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-gray-900 sm:text-[2rem]">
          Admin Profile
        </h1>
        <p className="mt-1 text-sm font-medium text-gray-500 sm:text-base">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="overflow-hidden rounded-[2.5rem] border border-black/5 bg-white p-8 shadow-2xl shadow-black/[0.03]">
        <div className="mb-8 flex items-center gap-6 border-b border-gray-100 pb-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#67B500] text-2xl font-bold text-white shadow-xl shadow-[#67B500]/20">
            {publicAdmin.full_name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{publicAdmin.full_name}</h2>
            <p className="text-sm font-medium text-gray-400">{publicAdmin.email}</p>
            <div className="mt-2 inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold tracking-tighter text-gray-800 uppercase">
              {publicAdmin.role} Account
            </div>
          </div>
        </div>

        <ProfileForm user={publicAdmin as AuthUser} />
      </div>
    </div>
  );
}
