import type {Metadata} from "next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://nomadicasahara.com",
  ),
  title: "Nomadica Sahara — Viajes a Marruecos: desierto, medinas y costa atlántica",
  description:
    "Viajes organizados y experiencias de autor por Marruecos: noches en jaima en el Sáhara, ciudades imperiales, trekking por el Alto Atlas y la costa de Essaouira.",
  robots: {index: true, follow: true},
};

export default function RootLayout({
  children,
}: Readonly<{children: React.ReactNode}>) {
  // Pass-through root layout: <html>/<body> live in app/[locale]/layout.tsx,
  // and NextIntlClientProvider has to live there too — the root layout renders
  // before setRequestLocale() runs, so messages resolved up here would always
  // fall back to the default locale for client components.
  return children;
}
