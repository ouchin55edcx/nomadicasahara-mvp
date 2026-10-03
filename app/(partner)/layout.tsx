import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarShell } from "@/components/partner/Sidebar";
import Topbar from "@/components/partner/Topbar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "Portal de socios | Nomadica Sahara",
    template: "%s | Portal de socios",
  },
  robots: { index: false, follow: false },
};

export default async function PartnerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const store = await cookies();
  const session = store.get("partner_session")?.value;

  if (session !== "1") {
    redirect("/partner/login");
  }

  return (
    <SidebarProvider>
      <SidebarShell>
        <Topbar />
        <main className="flex-1 px-4 py-6 md:px-6 md:py-8">
          <div className="mx-auto w-full max-w-[1400px]">{children}</div>
        </main>
        <Toaster />
      </SidebarShell>
    </SidebarProvider>
  );
}
