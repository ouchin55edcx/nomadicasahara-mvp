"use client";

import {useEffect, useState} from "react";

export type SectionLink = {id: string; label: string};

export default function SectionNav({items, label}: {items: SectionLink[]; label: string}) {
  const [current, setCurrent] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const nodes = items.map(({id}) => document.getElementById(id)).filter((node): node is HTMLElement => Boolean(node));
    if (!nodes.length) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setCurrent(visible[0].target.id);
    }, {rootMargin: "-22% 0px -68% 0px"});
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [items]);

  return <nav aria-label={label} className="sticky top-0 z-20 -mx-3 mt-6 overflow-x-auto border-y border-line bg-white/95 px-3 backdrop-blur sm:-mx-5 sm:px-5 lg:-mx-6 lg:px-6">
    <ul className="mx-auto flex min-w-max max-w-[1200px] gap-1 py-2">{items.map((item) => <li key={item.id}><a href={`#${item.id}`} aria-current={current === item.id ? "location" : undefined} onClick={(event) => { event.preventDefault(); document.getElementById(item.id)?.scrollIntoView({behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start"}); }} className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006D41] ${current === item.id ? "bg-[#EAF6D6] text-[#006D41]" : "text-[#555] hover:bg-[#F7F7F7]"}`}>{item.label}</a></li>)}</ul>
  </nav>;
}
