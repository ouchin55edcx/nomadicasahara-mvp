import type { ReactNode } from "react";
import type { Metadata } from "next";
import AdminHeader from "./components/AdminHeader";

export const metadata: Metadata = {
  title: {
    template: "%s | Toledano Viajes",
    default: "Partner Dashboard | Toledano Viajes",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div data-admin-dashboard className="relative -mx-4 -mt-6 min-h-screen bg-white pb-20 lg:pb-0 md:-mx-6 md:-mt-8">
      <AdminHeader />
      <main className="relative mx-auto w-full max-w-[1440px] px-4 pt-5 pb-16 sm:px-6 lg:px-8 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
