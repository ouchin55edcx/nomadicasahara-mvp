"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Eye, EyeOff, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { loginStep1Schema, loginStep2Schema } from "@/lib/validations/partner";
import { verifyCode, verifyCredentials, type AuthState } from "./actions";

const RESEND_SECONDS = 30;

export default function LoginForm() {
  const [step, setStep] = useState<1 | 2>(1);

  // Step1
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors1, setErrors1] = useState<{ email?: string; password?: string }>({});

  // Step2
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | undefined>();
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [resendNote, setResendNote] = useState(false);

  const [isPending, setIsPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (step !== 2 || countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [step, countdown]);

  function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const parsed = loginStep1Schema.safeParse({ email, password });
    if (!parsed.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      for (const issue of parsed.error.issues) {
        if (issue.path[0] === "email") fieldErrors.email = issue.message;
        if (issue.path[0] === "password") fieldErrors.password = issue.message;
      }
      setErrors1(fieldErrors);
      return;
    }

    setErrors1({});
    setIsPending(true);
    void (async () => {
      try {
        const formData = new FormData();
        formData.set("email", parsed.data.email);
        formData.set("password", parsed.data.password);
        const result: AuthState = await verifyCredentials(null, formData);
        if (result?.error) {
          setServerError(result.error);
          return;
        }
        setStep(2);
        setCountdown(RESEND_SECONDS);
      } finally {
        setIsPending(false);
      }
    })();
  }

  function handleStep2(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const parsed = loginStep2Schema.safeParse({ code });
    if (!parsed.success) {
      setCodeError(parsed.error.issues[0].message);
      return;
    }

    setCodeError(undefined);
    setIsPending(true);
    void (async () => {
      try {
        const formData = new FormData();
        formData.set("code", parsed.data.code);
        // En éxito hace redirect("/dashboard").
        const result: AuthState = await verifyCode(null, formData);
        if (result?.error) setServerError(result.error);
      } finally {
        setIsPending(false);
      }
    })();
  }

  function handleResend() {
    if (countdown > 0) return;
    setCountdown(RESEND_SECONDS);
    setResendNote(true);
    setCode("");
    setCodeError(undefined);
  }

  return (
    <div>
      {/* Indicador de paso */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#666]">
          Paso {step} de2
        </span>
        <div className="flex gap-1.5" aria-hidden>
          <span
            className={`h-1.5 w-8 rounded-full transition-colors ${step >= 1 ? "bg-[#66B600]" : "bg-[#E5E5E5]"}`}
          />
          <span
            className={`h-1.5 w-8 rounded-full transition-colors ${step >= 2 ? "bg-[#66B600]" : "bg-[#E5E5E5]"}`}
          />
        </div>
      </div>

      {step === 1 ? (
        <form onSubmit={handleStep1} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email" className="text-xs font-medium text-[#222]">
              Correo electrónico
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="partner@nomadicasahara.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(errors1.email)}
              className="h-12"
            />
            {errors1.email ? (
              <p role="alert" className="text-xs font-medium text-[#D93025]">
                {errors1.email}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-medium text-[#222]">
                Contraseña
              </Label>
              <a
                href="#"
                className="text-xs font-medium text-[#66B600] underline-offset-2 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(errors1.password)}
                className="h-12 pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-0 top-0 flex h-12 w-11 items-center justify-center text-[#666] transition-colors hover:text-[#222] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors1.password ? (
              <p role="alert" className="text-xs font-medium text-[#D93025]">
                {errors1.password}
              </p>
            ) : null}
          </div>

          {serverError ? (
            <p role="alert" className="rounded-sm bg-[#FFF4DC] px-3 py-2 text-xs font-medium text-[#8A6100]">
              {serverError}
            </p>
          ) : null}

          <Button type="submit" disabled={isPending} className="mt-1 h-12 w-full">
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Comprobando…
              </span>
            ) : (
              "Continuar"
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleStep2} noValidate className="flex flex-col gap-5">
          <div className="text-center">
            <p className="text-sm font-medium text-[#222]">Introduce el código de verificación</p>
            <p className="mt-1 text-xs text-[#666]">
              Hemos enviado un código de6 dígitos a{" "}
              <span className="font-medium text-[#222]">{email}</span>
            </p>
          </div>

          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(v) => {
                setCode(v);
                setCodeError(undefined);
              }}
              aria-label="Código de verificación"
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, i) => (
                  <InputOTPSlot key={i} index={i} className="h-12 w-11 text-lg" />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {codeError ? (
            <p role="alert" className="text-center text-xs font-medium text-[#D93025]">
              {codeError}
            </p>
          ) : null}
          {serverError ? (
            <p role="alert" className="rounded-sm bg-[#FFF4DC] px-3 py-2 text-center text-xs font-medium text-[#8A6100]">
              {serverError}
            </p>
          ) : null}

          <div className="text-center text-xs text-[#666]">
            {countdown > 0 ? (
              <span>
                Podrás reenviar el código en{" "}
                <span className="font-semibold tabular-nums text-[#222]">{countdown}s</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="inline-flex items-center gap-1.5 font-medium text-[#66B600] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600]"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reenviar código
              </button>
            )}
          </div>
          {resendNote && countdown > RESEND_SECONDS - 1 ? (
            <p className="text-center text-xs text-[#66B600]">Código reenviado (simulado).</p>
          ) : null}

          <Button type="submit" disabled={isPending} className="h-12 w-full">
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Verificando…
              </span>
            ) : (
              "Verificar"
            )}
          </Button>

          <button
            type="button"
            onClick={() => {
              setStep(1);
              setCode("");
              setServerError(null);
            }}
            className="mx-auto inline-flex items-center gap-1.5 text-xs font-medium text-[#666] transition-colors hover:text-[#222] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Volver
          </button>
        </form>
      )}
    </div>
  );
}
