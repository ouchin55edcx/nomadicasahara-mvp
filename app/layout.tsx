import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Nomadica Sahara — Viajes a Marruecos: desierto, medinas y costa atlántica",
  description:
    "Viajes organizados y experiencias de autor por Marruecos: noches en jaima en el Sáhara, ciudades imperiales, trekking por el Alto Atlas y la costa de Essaouira.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
