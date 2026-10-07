"use client";

import {useState} from "react";
import {Eye, EyeOff, Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Link} from "@/i18n/navigation";
import {loginStep1Schema} from "@/lib/validations/partner";
import {verifyCredentials, verifyPartnerTotp, type AuthState} from "./actions";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const [isPending, setIsPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [requiresTotp, setRequiresTotp] = useState(false);
  const [totpCode, setTotpCode] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setServerError(null);

    const parsed = loginStep1Schema.safeParse({email, password});
    if (!parsed.success) {
      const fieldErrors: {email?: string; password?: string} = {};
      for (const issue of parsed.error.issues) {
        if (issue.path[0] === "email") fieldErrors.email = issue.message;
        if (issue.path[0] === "password") fieldErrors.password = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsPending(true);
    void (async () => {
      try {
        const formData = new FormData();
        formData.set("email", parsed.data.email);
        formData.set("password", parsed.data.password);
        const result: AuthState = await verifyCredentials(null, formData);
        if (result?.error) setServerError(result.error);
        if (result?.twoFactorRequired) setRequiresTotp(true);
      } finally {
        setIsPending(false);
      }
    })();
  }

  async function handleTotpSubmit(event: React.FormEvent) {
    event.preventDefault();
    setServerError(null);
    setIsPending(true);
    try {
      const formData = new FormData();
      formData.set("code", totpCode);
      const result = await verifyPartnerTotp(null, formData);
      if (result?.error) setServerError(result.error);
    } finally { setIsPending(false); }
  }

  if (requiresTotp) return (
    <form onSubmit={handleTotpSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="totp-code">Authenticator code</Label>
        <Input id="totp-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={totpCode} onChange={(event) => setTotpCode(event.target.value.replace(/\D/g, ""))} className="h-12 tracking-[0.35em]" autoFocus />
        <p className="text-xs text-gray-500">Enter the 6-digit code from your authenticator app.</p>
      </div>
      {serverError ? <p role="alert" className="rounded-sm bg-[#FFF4DC] px-3 py-2 text-xs font-medium text-[#8A6100]">{serverError}</p> : null}
      <Button type="submit" disabled={isPending || totpCode.length !== 6} className="h-12 w-full rounded-xl text-sm">{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify code"}</Button>
      <button type="button" onClick={() => {setRequiresTotp(false); setTotpCode(""); setServerError(null);}} className="text-sm text-gray-500 underline">Back to sign in</button>
    </form>
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" className="text-xs font-medium text-[#222]">Email address</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="partner@toledanoviajes.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(errors.email)}
          className="h-12"
        />
        {errors.email ? <p role="alert" className="text-xs font-medium text-[#D93025]">{errors.email}</p> : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-xs font-medium text-[#222]">Contraseña</Label>
          <Link href="/help" className="text-xs font-medium text-[#66B600] underline-offset-2 hover:underline">Forgot password?</Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={Boolean(errors.password)}
            className="h-12 pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-0 top-0 flex h-12 w-11 items-center justify-center text-[#666] transition-colors hover:text-[#222] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600]"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password ? <p role="alert" className="text-xs font-medium text-[#D93025]">{errors.password}</p> : null}
      </div>

      {serverError ? <p role="alert" className="rounded-sm bg-[#FFF4DC] px-3 py-2 text-xs font-medium text-[#8A6100]">{serverError}</p> : null}

      <Button type="submit" disabled={isPending} className="mt-1 h-12 w-full rounded-xl text-sm shadow-lg shadow-[#67B500]/20">
        {isPending ? <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</span> : "Sign in"}
      </Button>
    </form>
  );
}
