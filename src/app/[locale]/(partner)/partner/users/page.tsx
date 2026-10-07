import type { AuthUser } from "@/lib/auth";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getAdminUsersPage } from "@/app/actions/users";

const UsersManagement = dynamic(() => import("./UsersManagement"), {
  loading: () => (
    <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
      <div className="animate-pulse space-y-4">
        <div className="flex gap-3">
          <div className="h-11 w-80 rounded-2xl bg-gray-100" />
          <div className="h-11 flex-1 rounded-2xl bg-gray-100" />
        </div>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-16 rounded-2xl bg-gray-50" />
        ))}
      </div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: "User Management",
  description:
    "Manage platform tourists and local guides, verify credentials, and moderate access.",
};

export default async function AdminUsersPage() {
  const users = await getAdminUsersPage(0, 50) as AuthUser[];
  const pendingGuidesCount = users.filter((user) => user.role === "guide" && user.verification_status === "pending").length;

  return (
    <div>
      <UsersManagement
        initialUsers={users}
        initialOffset={users.length}
        pendingGuidesCount={pendingGuidesCount}
      />
    </div>
  );
}
