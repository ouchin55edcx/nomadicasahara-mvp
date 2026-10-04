import type {Metadata} from "next";
import {cookies} from "next/headers";
import {getTranslations, setRequestLocale} from "next-intl/server";

import {SidebarProvider, SidebarShell} from "@/components/partner/Sidebar";
import Topbar from "@/components/partner/Topbar";
import {Toaster} from "@/components/ui/sonner";
import {redirect} from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "metadata"});

  return {
    title: {
      default: t("partnerLogin.title"),
      template: t("partnerPortal.titleTemplate"),
    },
    robots: {index: false, follow: false},
  };
}

export default async function PartnerLayout({
  children,
  params,
}: Readonly<{children: React.ReactNode; params: Promise<{locale: string}>}>) {
  const {locale} = await params;
  setRequestLocale(locale);

  const store = await cookies();
  const session = store.get("partner_session")?.value;

  if (session !== "1") {
    redirect({href: "/partner/login", locale});
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
