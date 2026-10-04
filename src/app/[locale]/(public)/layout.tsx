import {setRequestLocale} from "next-intl/server";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import MainNav from "@/components/layout/MainNav";

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export default async function PublicLayout({children, params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <MainNav />
      {children}
      <Footer />
    </>
  );
}
