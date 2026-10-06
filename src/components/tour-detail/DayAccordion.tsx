"use client";

import {useState} from "react";
import {BedDouble, ChevronDown, Utensils} from "lucide-react";
import type {Locale} from "@/i18n/routing";
import type {Day} from "@/types/tour-catalog";

export default function DayAccordion({days, labels, locale}: {days: Day[]; labels: {day: Record<number, string>; expand: string; collapse: string; overnight: string; meals: string}; locale: Locale}) {
  const [openDays, setOpenDays] = useState<Set<number>>(() => new Set(days.length ? [days[0].day] : []));
  const allOpen = openDays.size === days.length;
  const toggleAll = () => setOpenDays(allOpen ? new Set() : new Set(days.map((day) => day.day)));

  return <div>
    <div className="mb-4 flex justify-end"><button type="button" onClick={toggleAll} className="inline-flex min-h-11 items-center px-3 text-sm font-semibold text-[#006D41] underline underline-offset-4">{allOpen ? labels.collapse : labels.expand}</button></div>
    <ol className="space-y-3 border-l-2 border-dashed border-[#006D41]/50 pl-4 sm:pl-7">{days.map((day) => {
      const isOpen = openDays.has(day.day);
      return <li key={day.day} className="relative">
        <span className="absolute -left-[25px] top-5 h-3 w-3 rotate-45 bg-[#006D41] sm:-left-[38px]" />
        <details open={isOpen} onToggle={(event) => { const open = event.currentTarget.open; setOpenDays((current) => { const next = new Set(current); if (open) next.add(day.day); else next.delete(day.day); return next; }); }} className="overflow-hidden rounded-xl border border-line bg-white">
          <summary className="flex min-h-[72px] cursor-pointer list-none items-center gap-4 p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006D41] [&::-webkit-details-marker]:hidden">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-[#67B500] text-lg font-extrabold text-black">{String(day.day).padStart(2, "0")}</span>
            <span className="min-w-0 flex-1"><span className="inline-block rounded-full bg-[#67B500] px-2.5 py-1 text-[10px] font-bold text-black">{labels.day[day.day]}</span><span className="mt-1 block text-base font-semibold text-[#222]">{day.title[locale]}</span><span className="mt-1 block text-xs text-muted">{day.from[locale]} <span aria-hidden="true">→</span> {day.to[locale]}</span></span>
            <ChevronDown className={`h-5 w-5 shrink-0 text-[#006D41] transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </summary>
          <div className="border-t border-line px-4 pb-4 pt-3 sm:pl-[76px]">
            <p className="max-w-3xl text-sm leading-6 text-[#444]">{day.text[locale]}</p>
            {day.highlights.length ? <ul className="mt-3 flex flex-wrap gap-2">{day.highlights.map((highlight, index) => <li key={`${day.day}-${index}`} className="rounded-full bg-[#EAF6D6] px-3 py-1 text-xs font-medium text-[#244B23]">{highlight[locale]}</li>)}</ul> : null}
            {day.overnight ? <p className="mt-3 flex items-center gap-2 text-sm text-[#444]"><BedDouble className="h-4 w-4 text-[#006D41]" /><span><b>{labels.overnight}:</b> {day.overnight[locale]}</span></p> : null}
            {day.meals ? <p className="mt-2 flex items-center gap-2 text-sm text-[#444]"><Utensils className="h-4 w-4 text-[#006D41]" /><span><b>{labels.meals}:</b> {day.meals[locale]}</span></p> : null}
          </div>
        </details>
      </li>;
    })}</ol>
  </div>;
}
