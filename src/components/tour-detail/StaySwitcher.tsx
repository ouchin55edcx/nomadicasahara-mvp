"use client";

import Image from "next/image";
import {BedDouble, ChevronRight, CircleCheck} from "lucide-react";
import {useState} from "react";
import type {Locale} from "@/i18n/routing";
import type {Stay} from "@/types/tour-catalog";

export default function StaySwitcher({stays, images, title, description, offerName, nightLabel, locale}: {
  stays: Stay[]; images: (string | null)[]; title: string; description: string; offerName: string; nightLabel: (number: number) => string;
  locale: Locale;
}) {
  const nights = [...new Set(stays.flatMap((stay) => stay.nights))].sort((a, b) => a - b);
  const [activeNight, setActiveNight] = useState(nights[0] ?? 1);
  if (!stays.length) return null;
  return <section className="detail-stays-section" aria-labelledby="detail-stays-heading">
    <h2 id="detail-stays-heading">{title}</h2><p className="detail-section-description">{description}</p>
    <div className="detail-stays-block">
      <div role="tablist" aria-label={title} aria-orientation="vertical" className="detail-night-tabs">{nights.map((night) => <button key={night} type="button" role="tab" id={`night-tab-${night}`} aria-controls={`night-panel-${night}`} aria-selected={activeNight === night} tabIndex={activeNight === night ? 0 : -1} onClick={() => setActiveNight(night)} onKeyDown={(event) => {
        if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const index = nights.indexOf(night);
        const next = event.key === "ArrowDown" ? (index + 1) % nights.length : event.key === "ArrowUp" ? (index + nights.length - 1) % nights.length : event.key === "Home" ? 0 : nights.length - 1;
        setActiveNight(nights[next]);
        document.getElementById(`night-tab-${nights[next]}`)?.focus();
      }}><span>{nightLabel(night)}</span><ChevronRight size={18} aria-hidden="true"/></button>)}</div>
      <div className="detail-stays-content">{nights.map((night) => <div key={night} role="tabpanel" id={`night-panel-${night}`} aria-labelledby={`night-tab-${night}`} hidden={activeNight !== night} className="detail-stay-panel">
        <div className="detail-stay-cards">{stays.map((stay, index) => stay.nights.includes(night) ? <article key={`${night}-${stay.name.en}-${index}`} className="detail-stay-card">
          <span className="detail-stay-tier-label">{offerName}</span>
          <div className="detail-stay-image">{images[index] ? <Image src={images[index]!} alt={stay.name[locale]} fill sizes="120px" className="object-cover"/> : <span className="detail-stay-fallback" aria-hidden="true"><BedDouble size={30}/></span>}</div>
          <div className="detail-stay-copy"><h3>{stay.name[locale]}</h3><p>{stay.type[locale]} · {nightLabel(night)}</p><p className="detail-stay-board"><CircleCheck size={14} aria-hidden="true"/>{stay.board[locale]}</p></div>
        </article> : null)}</div>
      </div>)}</div>
    </div>
  </section>;
}
