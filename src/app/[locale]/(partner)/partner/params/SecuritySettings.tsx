"use client";

import {useEffect, useState, useTransition} from "react";
import {AlertCircle, CheckCircle2, Copy, Loader2, ShieldCheck, ShieldOff} from "lucide-react";
import {QRCodeSVG} from "qrcode.react";
import {confirmTwoFactor, disableTwoFactor, enableTwoFactor, getTwoFactorStatus} from "@/app/[locale]/(auth)/partner/login/actions";

export default function SecuritySettings() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [setup, setSetup] = useState<{totpURI: string; backupCodes: string[]; secret: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    void getTwoFactorStatus().then((result) => {
      if ("error" in result) setError(result.error);
      else setEnabled(result.enabled);
      setLoading(false);
    });
  }, []);

  function beginSetup() {
    setError(null);
    startTransition(async () => {
      const result = await enableTwoFactor(password);
      if ("error" in result) { setError(result.error); return; }
      const secret = new URL(result.totpURI).searchParams.get("secret") || "";
      setSetup({...result, secret});
      setPassword("");
    });
  }

  function confirmSetup() {
    setError(null);
    startTransition(async () => {
      const result = await confirmTwoFactor(code);
      if ("error" in result) { setError(result.error); return; }
      setEnabled(true);
      setSetup(null);
      setCode("");
    });
  }

  function turnOff() {
    setError(null);
    startTransition(async () => {
      const result = await disableTwoFactor(password);
      if ("error" in result) { setError(result.error); return; }
      setEnabled(false);
      setPassword("");
    });
  }

  async function copySecret() {
    if (!setup) return;
    await navigator.clipboard.writeText(setup.secret);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  if (loading) return <div className="flex items-center gap-2 rounded-3xl bg-white p-8 text-sm text-gray-500"><Loader2 className="h-4 w-4 animate-spin"/>Loading security settings…</div>;

  return <section className="max-w-3xl rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
    <div className="flex items-start gap-4">
      <span className="rounded-2xl bg-emerald-50 p-3 text-emerald-700"><ShieldCheck className="h-6 w-6"/></span>
      <div><h2 className="text-xl font-black text-gray-900">Two-step verification</h2><p className="mt-1 text-sm text-gray-500">Protect your partner account with a time-based code from an authenticator app.</p></div>
    </div>

    {error && <div role="alert" className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"><AlertCircle className="h-4 w-4 shrink-0"/>{error}</div>}

    {!enabled && !setup && <div className="mt-7 space-y-4">
      <p className="text-sm text-gray-600">Use Google Authenticator, Microsoft Authenticator, 1Password, or another TOTP app.</p>
      <label className="block text-sm font-semibold text-gray-700">Confirm your password<input type="password" autoComplete="current-password" value={password} onChange={(e)=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal"/></label>
      <button onClick={beginSetup} disabled={pending || !password} className="rounded-full bg-[#67B500] px-6 py-3 text-sm font-bold text-white disabled:opacity-50">{pending ? "Preparing…" : "Set up authenticator"}</button>
    </div>}

    {setup && <div className="mt-7 space-y-5">
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-5 text-center">
        <p className="text-sm font-semibold text-gray-700">Scan this code with your authenticator app</p>
        <div className="rounded-xl bg-white p-3 shadow-sm">
          <QRCodeSVG value={setup.totpURI} size={208} level="M" includeMargin aria-label="Authenticator setup QR code" />
        </div>
        <p className="max-w-sm text-xs text-gray-500">Use Google Authenticator, Microsoft Authenticator, 1Password, or another app that supports TOTP.</p>
      </div>
      <div>
        <p className="mb-2 text-sm text-gray-600">Or enter this setup key manually:</p>
        <div className="flex flex-wrap items-center gap-3 rounded-xl bg-gray-50 p-4"><code className="break-all text-sm font-bold tracking-wider">{setup.secret}</code><button onClick={copySecret} className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-xs font-semibold"><Copy className="h-3.5 w-3.5"/>{copied ? "Copied" : "Copy key"}</button></div>
      </div>
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="font-bold text-amber-900">Save these recovery codes somewhere safe</p><p className="mt-1 text-xs text-amber-800">Each code can be used once if you lose access to your authenticator.</p><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">{setup.backupCodes.map((item)=><code key={item} className="rounded bg-white px-2 py-1 text-center text-xs">{item}</code>)}</div></div>
      <label className="block text-sm font-semibold text-gray-700">Enter a code to finish setup<input inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e)=>setCode(e.target.value.replace(/\D/g, ""))} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal tracking-[0.35em]"/></label>
      <button onClick={confirmSetup} disabled={pending || code.length !== 6} className="rounded-full bg-[#67B500] px-6 py-3 text-sm font-bold text-white disabled:opacity-50">{pending ? "Verifying…" : "Verify and enable"}</button>
    </div>}

    {enabled && !setup && <div className="mt-7 rounded-xl border border-emerald-100 bg-emerald-50 p-4"><div className="flex items-center gap-2 font-bold text-emerald-900"><CheckCircle2 className="h-5 w-5"/>Authenticator verification is enabled</div><p className="mt-1 text-sm text-emerald-800">You will need an authenticator code each time you sign in.</p><div className="mt-5 space-y-3"><label className="block text-sm font-semibold text-gray-700">Confirm your password to disable<input type="password" autoComplete="current-password" value={password} onChange={(e)=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-normal"/></label><button onClick={turnOff} disabled={pending || !password} className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-5 py-2.5 text-sm font-bold text-red-700 disabled:opacity-50"><ShieldOff className="h-4 w-4"/>{pending ? "Disabling…" : "Disable two-step verification"}</button></div></div>}
  </section>;
}
