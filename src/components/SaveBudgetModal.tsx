"use client";

import { useEffect, useState } from "react";

function Field({
  label,
  flag = false,
  type = "text",
}: {
  label: string;
  flag?: boolean;
  type?: string;
}) {
  return (
    <label className="relative block cursor-text rounded-sm border border-line-soft bg-white px-3 pb-1.5 pt-3.5 transition-colors focus-within:border-brand">
      <span className="flex items-center gap-1.5 text-[13px] text-muted">
        {flag && (
          <span
            aria-hidden="true"
            className="flex items-center gap-0.5 text-[12px]"
          >
            🇪🇸
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        )}
        {label}
      </span>
      <input
        type={type}
        className="w-full bg-transparent text-[14px] text-ink outline-none"
      />
    </label>
  );
}

export default function SaveBudgetModal({
  autoOpen = false,
  triggerLabel = "Guardar presupuesto",
  triggerClassName = "",
}: {
  autoOpen?: boolean;
  triggerLabel?: string;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(autoOpen);
  const [mode, setMode] = useState<"save" | "login">("save");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setMode("save");
          setOpen(true);
        }}
        className={triggerClassName}
      >
        {triggerLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <button
            type="button"
            aria-label="Cerrar modal"
            onClick={() => setOpen(false)}
            className="fixed inset-0 h-full w-full bg-ink-dark/50"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={
              mode === "login" ? "Iniciar sesión" : "Guardar presupuesto"
            }
            className="relative mx-auto my-6 w-full max-w-[1000px] overflow-hidden rounded-md bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4 sm:px-8">
              <h2 className="text-[20px] font-semibold text-ink">
                {mode === "login" ? "Iniciar sesión" : "Guardar presupuesto"}
              </h2>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setOpen(false)}
                className="-mr-1 -mt-1 p-1 text-ink transition-colors hover:text-brand"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {mode === "save" ? (
              <div className="px-6 py-7 sm:px-8">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <Field label="Nombre: *" />
                    <Field label="E-mail: *" />
                    <p className="pt-10 text-[12px] text-muted">
                      * Todos los campos son obligatorios
                    </p>
                  </div>
                  <div className="space-y-4">
                    <Field label="Apellidos: *" />
                    <Field label="Código Postal: *" flag />
                    <Field
                      label="Teléfono y código de zona en caso necesario: *"
                      flag
                    />
                  </div>
                </div>

                <p className="mt-4 text-[14px] leading-relaxed text-ink">
                  Este presupuesto está sujeto a disponibilidad de plazas y tarifa
                  en el momento de efectuar la reserva.
                </p>

                <div className="mt-7 flex flex-wrap items-center justify-end gap-3">
                  <p className="mr-auto hidden text-[13px] text-muted sm:block">
                    ¿Ya tienes cuenta?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="font-semibold text-brand-dark underline underline-offset-2"
                    >
                      Inicia sesión
                    </button>{" "}
                    para guardarlo en tu perfil.
                  </p>
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="rounded-sm border border-brand bg-white px-5 py-3 text-[13px] font-semibold uppercase tracking-nav text-ink transition-colors hover:bg-brand-soft"
                  >
                    Iniciar sesión
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="btn btn-primary px-6"
                  >
                    Guardar presupuesto
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-6 py-7 sm:px-8">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="E-mail: *" />
                  <Field label="Contraseña: *" type="password" />
                </div>
                <p className="mt-3 text-[12px] text-muted">
                  * Todos los campos son obligatorios
                </p>
                <button
                  type="button"
                  className="mt-3 block text-[13px] font-medium text-brand-dark underline underline-offset-2"
                >
                  ¿Has olvidado tu contraseña?
                </button>

                <p className="mt-4 text-[14px] leading-relaxed text-ink">
                  Accede con tu e-mail y contraseña para recuperar tus
                  presupuestos guardados y gestionar tus reservas.
                </p>

                <div className="mt-7 flex flex-wrap items-center justify-end gap-3">
                  <p className="mr-auto hidden text-[13px] text-muted sm:block">
                    ¿No tienes cuenta?{" "}
                    <button
                      type="button"
                      className="font-semibold text-brand-dark underline underline-offset-2"
                    >
                      Regístrate
                    </button>
                  </p>
                  <button
                    type="button"
                    onClick={() => setMode("save")}
                    className="rounded-sm border border-brand bg-white px-5 py-3 text-[13px] font-semibold uppercase tracking-nav text-ink transition-colors hover:bg-brand-soft"
                  >
                    Volver
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="btn btn-primary px-6"
                  >
                    Iniciar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
