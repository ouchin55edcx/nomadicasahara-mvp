"use client";

import {CalendarDays} from "lucide-react";

export default function ChooseDateButton({label}: {label: string}) {
  return <button type="button" className="detail-outline-button" onClick={() => {
    const input = document.getElementById("tour-date");
    input?.scrollIntoView({behavior: "smooth", block: "center"});
    input?.focus();
  }}><CalendarDays size={16} aria-hidden="true"/>{label}</button>;
}
