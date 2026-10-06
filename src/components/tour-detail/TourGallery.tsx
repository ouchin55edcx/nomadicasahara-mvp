"use client";

import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import {Camera, ChevronLeft, ChevronRight, X} from "lucide-react";

export default function TourGallery({images, title, labels}: {images: string[]; title: string; labels: {all: string; close: string; previous: string; next: string; counters: string[]}}) {
  const [active, setActive] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const source = images.length ? images : [];
  const counter = (index: number) => labels.counters[index] ?? "";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (active >= 0 && dialog?.open) dialog.querySelector<HTMLButtonElement>("[data-close]")?.focus();
  }, [active]);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();
  const move = (offset: number) => setActive((index) => (index + offset + source.length) % source.length);
  const onMobileScroll = () => {
    const node = mobileRef.current;
    if (!node) return;
    const width = node.clientWidth;
    if (width) setActive(Math.round(node.scrollLeft / width));
  };

  const Photo = ({src, index, className}: {src: string; index: number; className: string}) => (
    <button type="button" onClick={() => { setActive(index); open(); }} aria-label={`${title} — ${counter(index)}`} className={`relative block overflow-hidden bg-[#EAF6D6] ${className}`}>
      <Image src={src} alt={`${title} — ${counter(index)}`} fill sizes="(max-width: 768px) 90vw, 50vw" priority={index === 0} className="object-cover transition-transform duration-300 hover:scale-[1.02]" />
    </button>
  );

  return <>
    <section aria-label={title} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#EAF6D6] via-[#D8EDB8] to-[#006D41] p-1">
      {source.length ? <>
        <div ref={mobileRef} onScroll={onMobileScroll} className="flex snap-x snap-mandatory overflow-x-auto rounded-xl md:hidden">
          {source.map((src, index) => <Photo key={src} src={src} index={index} className="aspect-[4/3] w-full shrink-0 snap-center" />)}
        </div>
        <div className="hidden grid-cols-4 grid-rows-2 gap-1 rounded-xl md:grid">
          <Photo src={source[0]} index={0} className="col-span-2 row-span-2 min-h-[400px] rounded-l-xl" />
          {Array.from({length: 4}, (_, i) => source[i + 1] ? <Photo key={source[i + 1]} src={source[i + 1]} index={i + 1} className={`min-h-[198px] ${i === 1 ? "rounded-tr-xl" : ""} ${i === 3 ? "rounded-br-xl" : ""}`} /> : <div key={`empty-${i}`} className="bg-gradient-to-br from-[#F4F8EE] to-[#A8CE7C]" />)}
        </div>
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <span className="rounded-full bg-black/70 px-3 py-2 text-xs font-semibold text-white md:hidden">{counter(active)}</span>
          <button type="button" onClick={open} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-[#006D41] shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006D41]"><Camera className="h-4 w-4" />{labels.all}</button>
        </div>
      </> : <div className="relative grid min-h-[280px] grid-cols-4 grid-rows-2 gap-1 overflow-hidden rounded-xl md:min-h-[410px]">
        <div className="col-span-2 row-span-2 rounded-l-xl bg-gradient-to-br from-[#006D41] to-[#173D2F]" />
        <div className="bg-gradient-to-br from-[#EAF6D6] to-[#67B500]" /><div className="rounded-tr-xl bg-gradient-to-br from-[#8BA45E] to-[#006D41]" />
        <div className="bg-gradient-to-br from-[#DDEFB9] to-[#929547]" /><div className="rounded-br-xl bg-gradient-to-br from-[#929547] to-[#006D41]" />
        <span className="pointer-events-none absolute inset-0 grid place-items-center text-2xl font-semibold text-white drop-shadow-lg">{title}</span>
      </div>}
    </section>
    {source.length ? <dialog ref={dialogRef} aria-label={labels.all} onClick={(event) => { if (event.target === dialogRef.current) close(); }} onKeyDown={(event) => { if (event.key === "ArrowRight") move(1); if (event.key === "ArrowLeft") move(-1); }} className="m-auto h-[min(90dvh,850px)] w-[min(96vw,1200px)] max-w-none border-0 bg-[#111] p-0 text-white backdrop:bg-black/90">
      <div className="relative flex h-full flex-col">
        <div className="absolute right-3 top-3 z-10 flex items-center gap-3 rounded-full bg-black/55 px-2 py-1"><span className="text-xs">{counter(active)}</span><button data-close type="button" onClick={close} aria-label={labels.close} className="grid h-10 w-10 place-items-center rounded-full bg-white text-black"><X className="h-5 w-5" /></button></div>
        <div className="relative min-h-0 flex-1"><Image src={source[active]} alt={`${title} — ${counter(active)}`} fill sizes="96vw" className="object-contain" /></div>
        {source.length > 1 ? <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between"><button type="button" onClick={() => move(-1)} aria-label={labels.previous} className="grid h-11 w-11 place-items-center rounded-full bg-white text-black"><ChevronLeft /></button><button type="button" onClick={() => move(1)} aria-label={labels.next} className="grid h-11 w-11 place-items-center rounded-full bg-white text-black"><ChevronRight /></button></div> : null}
      </div>
    </dialog> : null}
  </>;
}
