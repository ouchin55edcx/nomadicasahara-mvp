"use client";

import Image from "next/image";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {useCallback, useEffect, useRef, useState} from "react";

export default function PlacesCarousel({places, title, previous, next}: {places: {id: string; name: string; image?: string | null}[]; title: string; previous: string; next: string}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const updateControls = useCallback(() => {
    const node = trackRef.current;
    if (!node) return;
    setCanPrevious(node.scrollLeft > 2);
    setCanNext(node.scrollLeft + node.clientWidth < node.scrollWidth - 2);
  }, []);
  useEffect(() => {
    updateControls();
    const node = trackRef.current;
    if (!node) return;
    node.addEventListener("scroll", updateControls, {passive: true});
    const observer = new ResizeObserver(updateControls);
    observer.observe(node);
    return () => {node.removeEventListener("scroll", updateControls); observer.disconnect();};
  }, [updateControls, places.length]);
  const scroll = (direction: -1 | 1) => {
    const node = trackRef.current;
    const card = node?.querySelector<HTMLElement>(".detail-place-card");
    if (!node || !card) return;
    const gap = Number.parseFloat(getComputedStyle(node).columnGap || "20") || 20;
    node.scrollBy({left: direction * (card.getBoundingClientRect().width + gap), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
  };
  if (places.length < 2) return null;
  return <section className="detail-places-section" aria-labelledby="detail-places-heading">
    <div className="detail-section-heading"><h2 id="detail-places-heading">{title}</h2><div className="detail-carousel-controls"><button type="button" onClick={() => scroll(-1)} disabled={!canPrevious} aria-label={previous}><ChevronLeft aria-hidden="true"/></button><button type="button" onClick={() => scroll(1)} disabled={!canNext} aria-label={next}><ChevronRight aria-hidden="true"/></button></div></div>
    <div ref={trackRef} className="detail-places-track" role="region" aria-label={title} tabIndex={0}>
      {places.map((place) => <article key={place.id} className="detail-place-card" tabIndex={0} aria-label={place.name}>
        {place.image ? <Image src={place.image} alt={place.name} fill sizes="(max-width: 767px) 75vw, (max-width: 1279px) 46vw, 25vw" className="object-cover"/> : <div className="detail-image-fallback" aria-hidden="true"/>}
        <div className="detail-place-gradient" aria-hidden="true"/><h3>{place.name}</h3><span className="detail-place-accent" aria-hidden="true"/>
      </article>)}
    </div>
  </section>;
}
