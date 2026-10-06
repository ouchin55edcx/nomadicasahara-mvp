"use client";

import {useState} from "react";

export default function CopyRequestButton({text, label, copied}: {text: string; label: string; copied: string}) {
  const [isCopied, setIsCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 2500);
    } catch {
      setIsCopied(false);
    }
  }
  return <button type="button" onClick={copy} className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#006D41] px-4 text-sm font-semibold text-[#006D41] hover:bg-[#EAF6D6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006D41]">{isCopied ? copied : label}</button>;
}
