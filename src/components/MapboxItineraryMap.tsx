"use client";

import {MapPin} from "lucide-react";

type ItineraryStep = {
  id: number;
  title: string;
  coordinates?: {lat: number; lng: number};
};

export default function MapboxItineraryMap({
  steps,
  pickingStepId,
  onPinPlaced,
}: {
  steps: ItineraryStep[];
  pickingStepId: number | null;
  onPinPlaced: (id: number, coordinates: {lat: number; lng: number}) => void;
}) {
  return (
    <div className="relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-[2rem] border border-gray-100 bg-[#edf2e7] p-5 shadow-inner">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{backgroundImage:"linear-gradient(35deg, transparent 47%, #d7dfcf 48%, #d7dfcf 49%, transparent 50%), linear-gradient(145deg, transparent 47%, #d7dfcf 48%, #d7dfcf 49%, transparent 50%)",backgroundSize:"74px 74px"}}
      />
      <div className="relative z-10 flex items-center justify-between rounded-xl bg-white/90 px-4 py-3 shadow-sm">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-[#67B500]">Morocco route map</p>
          <p className="mt-1 text-xs text-gray-500">Demo map · Agafay / Marrakech</p>
        </div>
        <span className="rounded-full bg-[#67B500]/10 px-3 py-1 text-[10px] font-bold text-[#67B500]">MOCK</span>
      </div>
      <div className="relative z-10 my-auto grid gap-3">
        {steps.length ? steps.map((step, index) => {
          const isPicking = step.id === pickingStepId;
          return (
            <button
              type="button"
              key={step.id}
              onClick={() => onPinPlaced(step.id, {lat: 31.6295 + index * 0.12, lng: -7.9811 + index * 0.16})}
              className={`flex items-center gap-3 rounded-xl border bg-white/95 px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${isPicking ? "border-[#67B500] ring-2 ring-[#67B500]/20" : "border-white"}`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#67B500] text-xs font-bold text-white">{index + 1}</span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-800">{step.title || `Stop ${index + 1}`}</span>
              <MapPin className={`h-4 w-4 shrink-0 ${step.coordinates ? "text-[#67B500]" : "text-gray-300"}`} />
            </button>
          );
        }) : <p className="rounded-xl bg-white/90 p-4 text-center text-sm text-gray-500">Add itinerary stops to place them on your route.</p>}
      </div>
      <p className="relative z-10 rounded-lg bg-white/85 px-3 py-2 text-center text-xs text-gray-500">
        {pickingStepId === null ? "Choose a stop to preview its map pin." : "Click the selected stop to place a sample map pin."}
      </p>
    </div>
  );
}
