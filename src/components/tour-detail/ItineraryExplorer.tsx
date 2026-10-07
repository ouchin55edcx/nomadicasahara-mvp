"use client";

import Image from "next/image";
import {BedDouble, ChevronRight, Clock3, MapPin} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import type {MealType} from "@/types/tour-catalog";

export type ItineraryItem = {
  id: string; label: string; title: string; route?: string; time?: string; duration?: string;
  overnight?: string; meals?: MealType[]; text: string; descriptionParts?: {label: string; text: string}[]; highlights: string[]; image?: string | null; tierLabel?: string;
};

export default function ItineraryExplorer({items, title, mealLabels, includeLabel}: {
  items: ItineraryItem[]; title: string; mealLabels: Record<MealType, string>; includeLabel: string;
}) {
  const [active, setActive] = useState(0);
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("vertical");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    const sync = () => setOrientation(window.matchMedia("(max-width: 1023px)").matches ? "horizontal" : "vertical");
    sync();
    window.addEventListener("resize", sync);
    const index = items.findIndex((item) => `#${item.id}` === window.location.hash);
    if (index >= 0) setActive(index);
    return () => window.removeEventListener("resize", sync);
  }, [items]);
  if (!items.length) return null;
  const select = (index: number) => {
    setActive(index);
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${items[index].id}`);
  };
  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = orientation === "vertical"
      ? event.key === "ArrowDown" ? (index + 1) % items.length : event.key === "ArrowUp" ? (index + items.length - 1) % items.length : event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : -1
      : event.key === "ArrowRight" ? (index + 1) % items.length : event.key === "ArrowLeft" ? (index + items.length - 1) % items.length : event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : -1;
    if (next < 0) return;
    event.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  };
  return <section className="detail-itinerary-section" aria-labelledby="detail-itinerary-title">
    <h2 id="detail-itinerary-title">{title}</h2>
    <div className="detail-itinerary-layout">
      <div role="tablist" aria-label={title} aria-orientation={orientation} className="detail-itinerary-tabs">
        {items.map((item, index) => <button key={item.id} ref={(node) => {tabRefs.current[index] = node;}} id={`tab-${item.id}`} type="button" role="tab" aria-controls={`panel-${item.id}`} aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => select(index)} onKeyDown={(event) => onKeyDown(event, index)} className={`detail-itinerary-tab ${active === index ? "is-active" : ""}`}>
          <span className="detail-itinerary-marker" aria-hidden="true"/><span className="detail-itinerary-tab-copy"><small>{item.label}</small><strong>{item.title}</strong></span><ChevronRight className="detail-itinerary-chevron" size={18} aria-hidden="true"/>
        </button>)}
      </div>
      <div className="detail-itinerary-panels">
        {items.map((item, index) => <section key={item.id} id={`panel-${item.id}`} role="tabpanel" aria-labelledby={`tab-${item.id}`} hidden={active !== index} tabIndex={0} className="detail-itinerary-panel">
          {item.image ? <div className="detail-itinerary-image"><Image src={item.image} alt={`${item.title} — ${title}`} fill sizes="(max-width: 1024px) 100vw, 65vw" className="object-cover"/></div> : <div className="detail-itinerary-image detail-image-fallback" aria-hidden="true">{item.time || item.duration ? <Clock3 size={38}/> : <MapPin size={38}/>}</div>}
          <h3>{item.title}</h3><span className="detail-accent-bar" aria-hidden="true"/>
          {item.route ? <p className="detail-panel-route"><MapPin size={15} aria-hidden="true"/>{item.route}</p> : null}
          {item.tierLabel ? <p className="detail-panel-route">{item.tierLabel}</p> : null}
          {item.meals?.length ? <div className="detail-meal-row"><strong>{includeLabel}</strong>{item.meals.map((meal) => <span key={meal}>{mealLabels[meal]}</span>)}</div> : null}
          {item.overnight ? <p className="detail-panel-overnight"><BedDouble size={15} aria-hidden="true"/>{item.overnight}</p> : null}
          {item.descriptionParts?.length ? <div className="detail-panel-description">{item.descriptionParts.map((part, partIndex) => <p key={`${item.id}-text-${partIndex}`}><strong>{part.label}: </strong>{part.text}</p>)}</div> : <p className="detail-panel-description">{item.text}</p>}
          {item.highlights.length ? <ul className="detail-panel-highlights">{item.highlights.map((highlight, key) => <li key={`${item.id}-${key}`}>{highlight}</li>)}</ul> : null}
        </section>)}
      </div>
    </div>
  </section>;
}
