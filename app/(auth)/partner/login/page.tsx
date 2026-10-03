import type { Metadata } from "next";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Portal de socios | Nomadica Sahara",
  description: "Acceso exclusivo para partners y operadores de Nomadica Sahara.",
  robots: { index: false, follow: false },
};

export default function PartnerLoginPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white text-ink">
      <header className="w-full border-b border-line bg-white">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-baseline gap-2" aria-label="Nomadica Sahara, inicio">
            <span className="text-[22px] font-medium leading-none">Nomadica</span>
            <span
              className="text-[28px] leading-none text-brand"
              style={{ fontFamily: "'Brush Script MT', 'Snell Roundhand', 'Segoe Script', cursive" }}
            >
              Sahara
            </span>
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-muted transition-colors hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver a la web
          </a>
        </div>
      </header>

      <section className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-[440px]">
          <div className="mb-7">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-sm bg-[#EAF6D6] text-brand">
              <LockKeyhole className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
              Área profesional
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-ink sm:text-[28px]">
              Acceso para partners
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              Gestiona tus reservas, disponibilidad y finanzas desde tu portal de socios.
            </p>
          </div>

          <div className="rounded-sm border border-line bg-white p-6 sm:p-8">
            <LoginForm />
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            © 2026 Nomadica Sahara S.L. · Acceso restringido a partners
          </p>
        </div>
      </section>
    </main>
  );
}
