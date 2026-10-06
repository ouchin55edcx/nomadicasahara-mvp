"use client";

import {useState} from "react";
import {Share2} from "lucide-react";

export default function ShareButton({label, copied}: {label: string; copied: string}) {
  const [status, setStatus] = useState("");
  const share = async () => {
    const data = {title: document.title, url: window.location.href};
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(data.url); setStatus(copied); }
    } catch {
      try { await navigator.clipboard.writeText(data.url); setStatus(copied); } catch { setStatus(""); }
    }
    window.setTimeout(() => setStatus(""), 2500);
  };
  return <div className="flex flex-col items-end"><button type="button" onClick={share} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold text-[#006D41] hover:bg-[#EAF6D6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006D41]"><Share2 className="h-4 w-4" />{label}</button><span role="status" aria-live="polite" className="mt-1 text-xs text-[#006D41]">{status}</span></div>;
}
