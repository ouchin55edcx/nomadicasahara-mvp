"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Trek,
  TrekFormData,
  createTrek,
  updateTrek,
  uploadTrekImage,
  GalleryImage,
  ItineraryStep,
} from "@/app/actions/treks";
import { Category } from "@/app/actions/categories";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  UploadCloud,
  ImagePlus,
  X,
  Clock,
  Users,
  MapPin,
  Languages,
  Ticket,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Maximize2,
  Star,
  Zap,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import MapboxItineraryMap from "@/components/MapboxItineraryMap";

type TrekWizardProps = {
  categories: Category[];
  initialData?: Trek;
  trekId?: string;
  listHref?: string;
  successHref?: string;
};

const STEPS = [
  { n: 1, label: "Trek Identity", icon: "🏔", hint: "Title, category & badges" },
  { n: 2, label: "Description", icon: "✍️", hint: "Story, highlights & what's included" },
  { n: 3, label: "Photos", icon: "📸", hint: "Cover image and gallery" },
  { n: 4, label: "Logistics", icon: "📋", hint: "Duration, group size & languages" },
  { n: 5, label: "Pricing", icon: "💰", hint: "Price, discounts & booking policy" },
  { n: 6, label: "Itinerary", icon: "🗺", hint: "Stops & live map" },
  { n: 7, label: "Review & Publish", icon: "✅", hint: "Preview and go live" },
];

const LANGUAGES = [
  "English",
  "French",
  "Arabic",
  "Spanish",
  "German",
  "Chinese",
  "Russian",
  "Czech",
  "Japanese",
];

type OfferOption = { id: string; title: string };

function OfferScopePicker({
  offers,
  selected,
  onChange,
}: {
  offers: OfferOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
}) {
  const allSelected = selected.includes("*");
  const summary = allSelected
    ? "Shared by all offers"
    : selected.length
      ? `Included in ${selected.length} offer${selected.length === 1 ? "" : "s"}`
      : "Not included in offers";

  return (
    <details className="group relative ml-8 mt-1 w-fit text-xs">
      <summary className="cursor-pointer list-none rounded-full border border-gray-200 px-3 py-1.5 font-semibold text-gray-500 transition-colors hover:border-[#67B500] hover:text-[#3E852A]">
        {summary} <span className="ml-1 text-[10px]">▾</span>
      </summary>
      <div className="absolute left-0 top-full z-20 mt-1 min-w-52 rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
        <label className="flex cursor-pointer items-center gap-2 border-b border-gray-100 pb-2 font-semibold text-gray-700">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(event) => onChange(event.target.checked ? ["*"] : [])}
            className="accent-[#67B500]"
          />
          Shared by all offers
        </label>
        {offers.map((offer) => (
          <label key={offer.id} className="mt-2 flex cursor-pointer items-center gap-2 text-gray-600">
            <input
              type="checkbox"
              checked={selected.includes(offer.id)}
              onChange={(event) => {
                const current = allSelected ? [] : selected;
                onChange(event.target.checked
                  ? [...current, offer.id]
                  : current.filter((id) => id !== offer.id));
              }}
              className="accent-[#67B500]"
            />
            {offer.title || "Untitled offer"}
          </label>
        ))}
      </div>
    </details>
  );
}

function DynamicList({
  label,
  subtitle,
  icon,
  color,
  placeholder,
  items,
  onChange,
  offerOptions,
  offerAssignments = [],
  onOfferAssignmentsChange,
  max = 10,
}: {
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  placeholder: string;
  items: string[];
  onChange: (items: string[]) => void;
  offerOptions?: OfferOption[];
  offerAssignments?: string[][];
  onOfferAssignmentsChange?: (assignments: string[][]) => void;
  max?: number;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="shrink-0">{icon}</span>
        <div>
          <p className="text-sm font-bold text-gray-800">{label}</p>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>

      {items.map((item, i) => (
        <div key={i} className="mb-3">
          <div className="flex items-center gap-2">
          <span className={`shrink-0 text-lg`}>{icon}</span>
          <input
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
            placeholder={placeholder}
            className="flex-1 border-b border-gray-200 bg-transparent py-2 text-sm font-medium text-black outline-none placeholder:text-gray-700 focus:border-[#67B500]"
          />
          {items.length > 1 && (
            <button
              onClick={() => {
                onChange(items.filter((_, idx) => idx !== i));
                onOfferAssignmentsChange?.(offerAssignments.filter((_, idx) => idx !== i));
              }}
              className="text-gray-300 transition-colors hover:text-red-400"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          </div>
          {offerOptions?.length ? (
            <OfferScopePicker
              offers={offerOptions}
              selected={offerAssignments[i] ?? ["*"]}
              onChange={(selection) => {
                const next = items.map((_, index) => offerAssignments[index] ?? ["*"]);
                next[i] = selection;
                onOfferAssignmentsChange?.(next);
              }}
            />
          ) : null}
        </div>
      ))}

      {items.length < max && (
        <button
          onClick={() => {
            onChange([...items, ""]);
            if (offerOptions?.length) {
              onOfferAssignmentsChange?.([...items.map((_, i) => offerAssignments[i] ?? ["*"]), ["*"]]);
            }
          }}
          className="mt-1 flex items-center gap-1 text-xs font-semibold text-gray-900 hover:underline"
        >
          <Plus className="h-3 w-3" /> Add item
        </button>
      )}
    </div>
  );
}

export default function TrekWizard({
  categories,
  initialData,
  trekId,
  listHref = "/partner/treks",
  successHref = "/partner/treks",
}: TrekWizardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(1);
  const [offerSetupStage, setOfferSetupStage] = useState<"choose" | "define" | "ready">(
    initialData ? "ready" : "choose",
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [pickingStepId, setPickingStepId] = useState<number | null>(null);

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [formData, setFormData] = useState<TrekFormData>({
    offer_type: initialData?.offer_type ?? "without_offers",
    offers: initialData?.offers ?? [
      {id: "economic", title: "Economic Selection", price_adult: 0, price_child: 0},
      {id: "recommended", title: "Recommended Selection", price_adult: 0, price_child: 0},
    ],
    offer_assignments: initialData?.offer_assignments ?? {},
    title: "",
    category_id: "",
    cover_image: "",
    gallery_images: [],
    total_photo_count: 0,
    price_per_adult: 0,
    previous_price: null,
    price_note: null,
    about: "",
    highlights: [""],
    included: [""],
    not_included: [""],
    services: [""],
    meta_description: null,
    duration: "7h",
    time_of_day: "Morning",
    max_group_size: 15,
    min_age: 1,
    max_age: 99,
    start_time: "",
    mobile_ticket: true,
    avg_booking_lead_days: 11,
    live_guide_languages: [],
    audio_guide_languages: [],
    written_guide_languages: [],
    start_location: "",
    pickup_available: true,
    itinerary_steps: [],
    map_image_url: null,
    free_cancellation_hours: 24,
    reserve_now_pay_later: true,
    badge: null,
    award: null,
    is_active: false,
    rating: 5,
    review_count: 0,
    review_breakdown: [],
    popular_mentions: [],
  });

  useEffect(() => {
    if (initialData) {
      const { id, slug, created_at, updated_at, category_name, ...rest } = initialData;
      setFormData(rest as TrekFormData);
    }
  }, [initialData]);

  function update<K extends keyof TrekFormData>(key: K, val: TrekFormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: val }));
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    setUploadError(null);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "covers");
    const result = await uploadTrekImage(fd);
    setUploadingCover(false);
    if ("error" in result) {
      setUploadError(result.error);
    } else {
      update("cover_image", result.url);
    }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingGallery(index);
    setUploadError(null);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "gallery");
    const result = await uploadTrekImage(fd);
    setUploadingGallery(null);
    if ("error" in result) {
      setUploadError(result.error);
    } else {
      const gallery = [...formData.gallery_images];
      gallery[index] = { src: result.url, alt: gallery[index]?.alt || "" };
      update("gallery_images", gallery);
      update("total_photo_count", gallery.length);
    }
  }

  async function handleStepPhotoUpload(e: React.ChangeEvent<HTMLInputElement>, stepId: number) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "itinerary");
    const result = await uploadTrekImage(fd);
    if ("error" in result) {
      setUploadError(result.error);
    } else {
      update(
        "itinerary_steps",
        formData.itinerary_steps.map((s) => (s.id === stepId ? { ...s, image: result.url } : s)),
      );
    }
  }

  async function handleSubmit() {
    setSaving(true);
    setSaveError(null);

    startTransition(async () => {
      const result = trekId ? await updateTrek(trekId, formData) : await createTrek(formData);

      setSaving(false);

      if ("error" in result) {
        setSaveError(result.error);
        return;
      }

      router.push(
        `${successHref}?${trekId ? "updated" : "created"}=${("slug" in result ? result.slug : "") || trekId}`,
      );
    });
  }

  const isStepValid = (s: number) => {
    if (s === 1) return formData.title.length > 0 && !!formData.category_id;
    if (s === 2) return formData.about.length > 50;
    if (s === 3) return !!formData.cover_image;
    if (s === 4)
      return (
        !!formData.duration && formData.live_guide_languages.length > 0 && !!formData.start_location
      );
    if (s === 5) return formData.offer_type === "offers"
      ? formData.offers.length === 2 && formData.offers.every((offer: any) => offer.price_adult > 0 && offer.price_child > 0)
      : formData.price_per_adult > 0;
    if (s === 6) return true; // itinerary optional
    if (s === 7) return true;
    return false;
  };

  const nextStep = () => {
    if (isStepValid(step) && step < 7) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const offers = (formData.offers ?? []) as (OfferOption & {price_adult: number; price_child: number})[];
  const hasOffers = formData.offer_type === "offers";
  const setOfferAssignment = (key: string, assignments: string[][]) => {
    update("offer_assignments", {...(formData.offer_assignments ?? {}), [key]: assignments});
  };

  if (offerSetupStage !== "ready") {
    return (
      <div className="min-h-screen bg-white px-4 py-8 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <Link href={listHref} className="text-sm font-semibold text-gray-500 hover:text-[#67B500]">← Back to treks</Link>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-gray-900">New trek · Offer setup</p>
          {offerSetupStage === "choose" ? (
            <>
              <h1 className="mt-2 text-3xl font-black text-gray-900">How will this trek be sold?</h1>
              <p className="mt-2 text-gray-500">Choose whether travelers book one price or compare two packages.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  {type: "without_offers", title: "Without offers", description: "One price and the current trek setup."},
                  {type: "offers", title: "With offers", description: "Two packages with different prices and inclusions."},
                ].map((choice) => (
                  <button
                    key={choice.type}
                    type="button"
                    onClick={() => {
                      update("offer_type", choice.type);
                      setOfferSetupStage(choice.type === "offers" ? "define" : "ready");
                    }}
                    className="rounded-2xl border border-gray-200 bg-white p-6 text-left transition hover:border-[#67B500] hover:bg-[#67B500]/5"
                  >
                    <span className="text-lg font-bold text-gray-900">{choice.title}</span>
                    <span className="mt-2 block text-sm leading-6 text-gray-500">{choice.description}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <h1 className="mt-2 text-3xl font-black text-gray-900">Name your two offers</h1>
              <p className="mt-2 text-gray-500">These titles will identify each package throughout pricing, itinerary, inclusions and services.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {offers.map((offer, index) => (
                  <label key={offer.id} className="rounded-2xl border border-gray-200 p-5">
                    <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Offer {index + 1}</span>
                    <input
                      value={offer.title}
                      onChange={(event) => update("offers", offers.map((item) => item.id === offer.id ? {...item, title: event.target.value} : item))}
                      maxLength={40}
                      placeholder={index === 0 ? "e.g. Economic" : "e.g. Recommended"}
                      className="mt-2 w-full border-b border-gray-200 py-2 text-base font-semibold text-gray-900 outline-none focus:border-[#67B500]"
                    />
                  </label>
                ))}
              </div>
              <div className="mt-8 flex items-center justify-between">
                <button type="button" onClick={() => setOfferSetupStage("choose")} className="rounded-full px-5 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-100">Back</button>
                <button
                  type="button"
                  disabled={offers.length !== 2 || offers.some((offer) => !offer.title.trim())}
                  onClick={() => setOfferSetupStage("ready")}
                  className="rounded-full bg-[#67B500] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#559600] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue to trek details <ChevronRight className="ml-1 inline h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden lg:flex-row">
      {/* LEFT SIDEBAR — desktop only */}
      <aside className="partner-step-sidebar-scroll sticky top-0 hidden h-screen w-[280px] shrink-0 flex-col overflow-y-auto border border-gray-200 bg-white px-8 py-10 lg:flex xl:w-[300px]">
        <div className="mb-10">
          <Link
            href={listHref}
            className="mb-8 flex items-center gap-2 text-xs font-bold text-gray-500 transition-colors hover:text-[#67B500]"
          >
            ← Back to treks
          </Link>
          <p className="mb-1 text-xs font-bold tracking-widest text-gray-400 uppercase">
            {trekId ? "Edit trek" : "New trek"}
          </p>
          <h2 className="text-xl leading-tight font-black text-gray-900">
            {formData.title || "Untitled trek"}
          </h2>
          {formData.category_id && (
            <span className="mt-2 inline-block text-xs font-bold text-gray-900">
              {categories.find((c) => c.id === formData.category_id)?.name}
            </span>
          )}
        </div>

        <nav className="relative flex flex-col gap-0">
          {/* Vertical connecting line */}
          <div className="absolute top-5 bottom-5 left-[19px] w-px bg-gray-200" />
          {/* Green fill line showing progress */}
          <div
            className="absolute top-5 left-[19px] w-px bg-[#67B500] transition-all duration-700"
            style={{ height: `${Math.min(((step - 1) / (STEPS.length - 1)) * 100, 100)}%` }}
          />

          {STEPS.map((s) => {
            const isCompleted = step > s.n;
            const isActive = step === s.n;
            return (
              <button
                key={s.n}
                onClick={() => {
                  if (s.n <= step || isStepValid(step)) setStep(s.n);
                }}
                className="group relative flex items-start gap-4 py-4 text-left transition-all duration-200 hover:pl-1"
              >
                {/* Circle */}
                <div
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isCompleted
                      ? "border-[#67B500] bg-[#67B500]"
                      : isActive
                        ? "border-[#67B500] bg-[#67B500] ring-4 ring-[#67B500]/20"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  ) : (
                    <span
                      className={`text-sm font-black ${isActive ? "text-white" : "text-gray-400"}`}
                    >
                      {s.n}
                    </span>
                  )}
                </div>

                {/* Label */}
                <div className="min-w-0 pt-1.5">
                  <p
                    className={`text-sm leading-tight font-black transition-colors ${isActive ? "text-gray-900" : isCompleted ? "text-gray-600" : "text-gray-400"}`}
                  >
                    {s.label}
                  </p>
                  <p
                    className={`mt-0.5 hidden text-[11px] leading-tight transition-colors xl:block ${isActive ? "text-gray-600" : "text-gray-400"}`}
                  >
                    {s.hint}
                  </p>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-1/2 right-0 h-8 w-1 -translate-y-1/2 rounded-full bg-[#67B500]" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-10">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#67B500] py-3 text-sm font-bold text-white transition-all hover:bg-[#559600]"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "💾"}
            Save as draft
          </button>
          <p className="mt-3 text-center text-[10px] font-medium text-gray-400">
            All progress is saved locally
          </p>
        </div>
      </aside>

      {/* MOBILE TOP BAR — mobile only */}
      <div className="sticky top-0 z-40 border-b border-gray-100 bg-white px-4 py-3 shadow-sm lg:hidden">
        <div className="mb-2 flex items-center justify-between">
          <Link
            href={listHref}
            className="text-xs font-bold text-gray-400 hover:text-[#67B500]"
          >
            ← Back
          </Link>
          <span className="text-xs font-black text-gray-900">
            Step {step} of {STEPS.length} — {STEPS[step - 1].label}
          </span>
          <span className="text-xs font-bold text-gray-400">
            {Math.round((step / STEPS.length) * 100)}%
          </span>
        </div>

        {/* Thin progress bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-[#67B500] transition-all duration-500"
            style={{ width: `${(step / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Step dots */}
        <div className="scrollbar-none mt-2 flex gap-1.5 overflow-x-auto">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className={`flex-shrink-0 rounded-full transition-all duration-300 ${
                step > s.n
                  ? "h-1.5 w-4 bg-[#67B500]"
                  : step === s.n
                    ? "h-1.5 w-6 bg-[#67B500]"
                    : "h-1.5 w-1.5 bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* RIGHT FORM AREA */}
      <main className="min-h-screen min-w-0 flex-1 overflow-x-hidden bg-white p-0">
        <div className="w-full space-y-6">
          {/* Step header */}
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-white text-3xl shadow-sm">
              {STEPS[step - 1].icon}
            </div>
            <div>
              <p className="text-xs font-black tracking-widest text-gray-400 uppercase">
                Step {step} of {STEPS.length}
              </p>
              <h2 className="text-2xl font-black text-gray-900">{STEPS[step - 1].label}</h2>
              <p className="text-sm text-gray-500">{STEPS[step - 1].hint}</p>
            </div>
          </div>

          {/* Step content card */}
          <div className="animate-in fade-in slide-in-from-bottom-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm duration-300 sm:p-8">
            {/* Step 1: Trek Identity */}
            {step === 1 && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-sm font-black tracking-widest text-gray-500 uppercase">
                    Trek Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ourika Valley Full-Day Waterfall Hike"
                    value={formData.title}
                    onChange={(e) => update("title", e.target.value)}
                    className="h-14 w-full rounded-2xl border border-gray-100 bg-gray-50 px-6 text-xl font-bold text-gray-900 transition-all placeholder:text-gray-700 focus:bg-white focus:ring-4 focus:ring-[#67B500]/5 focus:outline-none"
                  />
                  <div className="flex justify-between px-2">
                    <span className="text-xs font-bold text-gray-400 opacity-60">
                      /tour/{formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                    </span>
                    <span
                      className={`text-xs font-bold ${formData.title.length > 80 ? "text-red-500" : "text-gray-400"}`}
                    >
                      {formData.title.length} / 80
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-black tracking-widest text-gray-500 uppercase">
                    Category *
                  </label>
                  <div className="partner-category-scroll flex gap-3 overflow-x-auto pb-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => update("category_id", cat.id)}
                        className={`flex min-w-[140px] flex-col items-center gap-3 rounded-2xl p-4 transition-all ${
                          formData.category_id === cat.id
                            ? "bg-[#67B500] text-white shadow-xl shadow-[#67B500]/20"
                            : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <div className="h-10 w-10 overflow-hidden rounded-xl bg-white/20">
                          {cat.photo && (
                            <img src={cat.photo} alt="" className="h-full w-full object-cover" />
                          )}
                        </div>
                        <span className="text-xs font-black">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-black tracking-widest text-gray-500 uppercase">
                    Badges & Awards
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["None", "Traveler favorite", "Best Seller", "Special Offer"].map((b) => (
                      <button
                        key={b}
                        onClick={() => update("badge", b === "None" ? null : b)}
                        className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                          formData.badge === b || (formData.badge === null && b === "None")
                            ? "bg-[#67B500] text-white shadow-md"
                            : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-2 text-sm font-black tracking-widest text-gray-500 uppercase">
                    Traveler's Choice Year (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2025"
                    value={formData.award || ""}
                    onChange={(e) => update("award", e.target.value)}
                    className="h-12 w-full max-w-xs rounded-2xl border border-gray-100 bg-gray-50 px-6 text-base font-bold text-gray-900 transition-all placeholder:text-gray-700 focus:bg-white focus:ring-4 focus:ring-[#67B500]/5 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Description */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-sm font-black tracking-widest text-gray-500 uppercase">
                    What travelers will experience *
                  </label>
                  <textarea
                    rows={6}
                    value={formData.about}
                    onChange={(e) => update("about", e.target.value)}
                    placeholder="Describe the hidden waterfalls, the mountain views, and the authentic Berber hospitality..."
                    className="w-full rounded-3xl border border-gray-100 bg-gray-50 p-6 font-medium text-black transition-all placeholder:text-gray-700 focus:bg-white focus:ring-4 focus:ring-[#67B500]/5 focus:outline-none"
                  />
                  <div className="flex justify-end px-2">
                    <span
                      className={`text-xs font-bold ${formData.about.length < 50 ? "text-amber-500" : "text-gray-800"}`}
                    >
                      {formData.about.length} / min 50 characters
                    </span>
                  </div>
                </div>

                <DynamicList
                  label="Highlights"
                  subtitle="The 3–5 best moments travelers skim before booking."
                  icon={<Star className="h-4 w-4 text-amber-400" />}
                  color="amber"
                  placeholder="e.g. Traditional Berber breakfast with mint tea"
                  items={formData.highlights}
                  onChange={(val) => update("highlights", val)}
                />

                {/* Included & Services Section */}
                <div className="space-y-10 rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <div>
                    <h3 className="text-lg font-black text-gray-900">Included & Services</h3>
                    <p className="text-sm font-medium text-gray-500">
                      Be clear about what travelers get — this directly impacts bookings.
                    </p>
                  </div>

                  <div className="space-y-10">
                    <div>
                      <DynamicList
                        label="What's included"
                        subtitle="Everything covered in the price — travelers love this."
                        icon="✅"
                        color="emerald"
                        placeholder="e.g. Professional local guide"
                        items={formData.included}
                        onChange={(val) => update("included", val)}
                        offerOptions={hasOffers ? offers : undefined}
                        offerAssignments={formData.offer_assignments?.included ?? []}
                        onOfferAssignmentsChange={(val) => setOfferAssignment("included", val)}
                      />
                      <div className="mt-3 flex flex-wrap gap-2">
                        {[
                          "Professional guide",
                          "Transport by 4x4",
                          "Berber lunch",
                          "Camel ride",
                          "Hotel pickup",
                          "Bottled water",
                        ].map((sug) => (
                          <button
                            key={sug}
                            onClick={() => {
                              const filtered = formData.included.filter(Boolean);
                              if (!filtered.includes(sug)) {
                                update("included", [...filtered, sug]);
                              }
                            }}
                            className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-bold text-gray-500 transition-all hover:border-[#67B500] hover:text-[#67B500]"
                          >
                            + {sug}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <DynamicList
                        label="Not included"
                        subtitle="Be transparent — it builds trust with travelers."
                        icon="❌"
                        color="red"
                        placeholder="e.g. Personal expenses"
                        items={formData.not_included}
                        onChange={(val) => update("not_included", val)}
                        offerOptions={hasOffers ? offers : undefined}
                        offerAssignments={formData.offer_assignments?.not_included ?? []}
                        onOfferAssignmentsChange={(val) => setOfferAssignment("not_included", val)}
                      />
                      <div className="mt-3 flex flex-wrap gap-2">
                        {[
                          "Tips / gratuities",
                          "Personal expenses",
                          "Travel insurance",
                          "Alcoholic beverages",
                          "Entrance fees",
                        ].map((sug) => (
                          <button
                            key={sug}
                            onClick={() => {
                              const filtered = formData.not_included.filter(Boolean);
                              if (!filtered.includes(sug)) {
                                update("not_included", [...filtered, sug]);
                              }
                            }}
                            className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-bold text-gray-500 transition-all hover:border-[#67B500] hover:text-[#67B500]"
                          >
                            + {sug}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <DynamicList
                        label="Services"
                        subtitle="Extra conveniences you offer."
                        icon={<Zap className="h-4 w-4 text-gray-900" />}
                        color="emerald"
                        placeholder="e.g. Small group guaranteed (max 15)"
                        items={formData.services}
                        onChange={(val) => update("services", val)}
                        offerOptions={hasOffers ? offers : undefined}
                        offerAssignments={formData.offer_assignments?.services ?? []}
                        onOfferAssignmentsChange={(val) => setOfferAssignment("services", val)}
                      />
                      <div className="mt-3 flex flex-wrap gap-2">
                        {[
                          "Small group guaranteed",
                          "Hotel pickup available",
                          "Skip-the-line access",
                          "Multilingual guide",
                        ].map((sug) => (
                          <button
                            key={sug}
                            onClick={() => {
                              const filtered = formData.services.filter(Boolean);
                              if (!filtered.includes(sug)) {
                                update("services", [...filtered, sug]);
                              }
                            }}
                            className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-bold text-gray-500 transition-all hover:border-[#67B500] hover:text-[#67B500]"
                          >
                            + {sug}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Photos */}
            {step === 3 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-sm font-black tracking-widest text-gray-500 uppercase">
                    Cover Image *
                  </label>
                  <label
                    className={`relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed transition-all ${
                      formData.cover_image
                        ? "border-[#67B500]"
                        : "border-gray-300 hover:border-[#67B500] hover:bg-[#f7fdf9]"
                    }`}
                  >
                    {/* Uploading spinner */}
                    {uploadingCover && (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/85">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-900" />
                        <p className="text-sm font-semibold text-gray-900">
                          Uploading to Cloudflare...
                        </p>
                      </div>
                    )}

                    {/* Preview */}
                    {formData.cover_image && !uploadingCover && (
                      <>
                        <img
                          src={formData.cover_image}
                          className="h-full w-full object-cover"
                          alt="Cover preview"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all hover:bg-black/40 hover:opacity-100">
                          <span className="rounded-full bg-black/50 px-4 py-2 text-sm font-semibold text-white">
                            Change photo
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            update("cover_image", "");
                          }}
                          className="absolute top-6 right-6 z-10 rounded-full bg-white p-2 shadow-xl transition-colors hover:bg-red-50"
                        >
                          <X className="h-5 w-5 text-gray-500" />
                        </button>
                      </>
                    )}

                    {/* Empty state */}
                    {!formData.cover_image && !uploadingCover && (
                      <div className="flex flex-col items-center gap-3 p-10 text-center">
                        <UploadCloud className="h-10 w-10 text-gray-300" />
                        <div>
                          <p className="font-semibold text-gray-600">Drop your cover photo here</p>
                          <p className="mt-1 text-xs text-gray-400">
                            JPG, PNG or WebP · Max 10 MB · Landscape recommended (1200×800px)
                          </p>
                        </div>
                        <span className="pointer-events-none rounded-full bg-[#67B500] px-5 py-2 text-sm font-semibold text-white">
                          Browse file
                        </span>
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleCoverUpload}
                    />
                  </label>

                  {uploadError && (
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-red-500">
                      <AlertCircle className="h-4 w-4 shrink-0" /> {uploadError}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-black tracking-widest text-gray-500 uppercase">
                      Gallery photos
                    </label>
                    <span className="text-xs font-black text-gray-400">
                      {formData.gallery_images.length} / 6
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="group relative aspect-square overflow-hidden rounded-[2rem] border-2 border-dashed border-gray-100 bg-gray-50 transition-all hover:border-[#67B500]/50"
                      >
                        {uploadingGallery === i && (
                          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-900" />
                          </div>
                        )}

                        {formData.gallery_images[i] ? (
                          <>
                            <img
                              src={formData.gallery_images[i].src}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                            <button
                              onClick={() => {
                                const newG = [...formData.gallery_images];
                                newG.splice(i, 1);
                                update("gallery_images", newG);
                                update("total_photo_count", newG.length);
                              }}
                              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-500 shadow-md transition-all hover:text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          uploadingGallery !== i && (
                            <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 text-gray-300 hover:text-[#67B500]">
                              <ImagePlus className="h-8 w-8" />
                              <span className="text-[10px] font-black tracking-widest uppercase">
                                Photo {i + 1}
                              </span>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => handleGalleryUpload(e, i)}
                              />
                            </label>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Logistics */}
            {step === 4 && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-sm font-black tracking-widest text-gray-500 uppercase">
                        Duration
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["2h", "4h", "7h", "8h", "Full day", "Custom"].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => update("duration", opt)}
                            className={`rounded-full px-5 py-2.5 text-xs font-black transition-all ${
                              formData.duration === opt
                                ? "bg-[#67B500] text-white shadow-lg"
                                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {formData.duration === "Custom" && (
                        <input
                          type="text"
                          placeholder="e.g. 3 days"
                          className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold text-black placeholder:text-gray-700 focus:bg-white focus:outline-none"
                        />
                      )}
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-black tracking-widest text-gray-500 uppercase">
                        Time of Day
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { val: "Morning", icon: "🌅", desc: "Starts before noon" },
                          { val: "Afternoon", icon: "☀️", desc: "12:00–17:00" },
                          { val: "Evening", icon: "🌆", desc: "After 17:00" },
                          { val: "Flexible", icon: "🔄", desc: "No fixed time" },
                        ].map((item) => (
                          <button
                            key={item.val}
                            onClick={() => update("time_of_day", item.val as any)}
                            className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                              formData.time_of_day === item.val
                                ? "border-[#67B500] bg-emerald-50 ring-1 ring-[#67B500]"
                                : "border-gray-100 bg-white hover:border-gray-200"
                            }`}
                          >
                            <span className="mb-2 text-2xl">{item.icon}</span>
                            <span className="text-sm font-black text-gray-900">{item.val}</span>
                            <span className="text-[10px] font-medium text-gray-400">
                              {item.desc}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-black tracking-widest text-gray-500 uppercase">
                          Max group size
                        </label>
                        <span className="text-2xl font-black text-gray-900">
                          {formData.max_group_size}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={formData.max_group_size}
                        onChange={(e) => update("max_group_size", +e.target.value)}
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-100 accent-[#67B500]"
                      />
                      <p className="text-center text-xs font-bold tracking-widest text-gray-400 uppercase">
                        Max {formData.max_group_size} people per group
                      </p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-sm font-black tracking-widest text-gray-500 uppercase">
                        Start Location *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-300" />
                        <input
                          type="text"
                          placeholder="e.g. Place Jemaa el-Fnaa, Marrakech"
                          value={formData.start_location}
                          onChange={(e) => update("start_location", e.target.value)}
                          className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-3.5 pr-4 pl-11 text-sm font-bold text-black transition-all placeholder:text-gray-700 focus:bg-white focus:ring-4 focus:ring-[#67B500]/5 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-black tracking-widest text-gray-500 uppercase">
                        Guide Languages (at least 1) *
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {LANGUAGES.map((lang) => {
                          const isSelected = formData.live_guide_languages.includes(lang);
                          return (
                            <button
                              key={lang}
                              onClick={() => {
                                const current = [...formData.live_guide_languages];
                                if (isSelected) {
                                  update(
                                    "live_guide_languages",
                                    current.filter((l) => l !== lang),
                                  );
                                } else {
                                  update("live_guide_languages", [...current, lang]);
                                }
                              }}
                              className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                                isSelected
                                  ? "bg-[#67B500] text-white shadow-md"
                                  : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {lang}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-4 rounded-[2rem] border border-black/5 bg-gray-50/50 p-6">
                      <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase">
                        Policies & Toggles
                      </h3>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-gray-900">
                              <ShieldCheck className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-bold text-gray-900">
                              Free Cancellation
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={formData.free_cancellation_hours}
                              onChange={(e) => update("free_cancellation_hours", +e.target.value)}
                              className="w-12 rounded-lg border border-gray-100 bg-white py-1 text-center text-xs font-black text-gray-900"
                            />
                            <span className="text-xs font-bold text-gray-400">h</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-gray-900">
                              <Ticket className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-bold text-gray-900">Mobile Ticket</span>
                          </div>
                          <button
                            onClick={() => update("mobile_ticket", !formData.mobile_ticket)}
                            className={`relative h-6 w-11 rounded-full transition-colors ${formData.mobile_ticket ? "bg-[#67B500]" : "bg-gray-200"}`}
                          >
                            <div
                              className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${formData.mobile_ticket ? "left-6" : "left-1"}`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-gray-900">
                              <Clock className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-bold text-gray-900">
                              Reserve now, pay later
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              update("reserve_now_pay_later", !formData.reserve_now_pay_later)
                            }
                            className={`relative h-6 w-11 rounded-full transition-colors ${formData.reserve_now_pay_later ? "bg-[#67B500]" : "bg-gray-200"}`}
                          >
                            <div
                              className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${formData.reserve_now_pay_later ? "left-6" : "left-1"}`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Pricing */}
            {step === 5 && (
              <div className="space-y-8">
                {hasOffers ? (
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {offers.map((offer) => (
                      <section key={offer.id} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5">
                        <h3 className="font-bold text-gray-900">{offer.title}</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {(["adult", "child"] as const).map((person) => (
                            <label key={person} className="space-y-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                              {person} price
                              <span className="relative block">
                                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-lg font-bold text-gray-900">€</span>
                                <input
                                  type="number"
                                  min="1"
                                  value={offer[`price_${person}`] || ""}
                                  onChange={(event) => {
                                    const amount = Number(event.target.value);
                                    const nextOffers = offers.map((item) => item.id === offer.id ? {...item, [`price_${person}`]: amount} : item);
                                    update("offers", nextOffers);
                                    const adultPrices = nextOffers.map((item) => item.price_adult).filter((price) => price > 0);
                                    update("price_per_adult", adultPrices.length ? Math.min(...adultPrices) : 0);
                                  }}
                                  className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pr-3 pl-10 text-lg font-bold text-gray-900 outline-none focus:border-[#67B500] focus:bg-white"
                                />
                              </span>
                            </label>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                ) : null}

                {!hasOffers ? <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="text-sm font-black tracking-widest text-gray-500 uppercase">
                      Price per adult *
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-6 text-2xl font-black text-gray-900">$</span>
                      <input
                        type="number"
                        value={formData.price_per_adult || ""}
                        onChange={(e) => update("price_per_adult", +e.target.value)}
                        className="h-14 w-full rounded-2xl border border-gray-100 bg-gray-50 pr-6 pl-12 text-2xl font-black text-gray-900 transition-all focus:bg-white focus:ring-4 focus:ring-[#67B500]/5 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-black tracking-widest text-gray-500 uppercase">
                      Previous price (optional)
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-6 text-2xl font-black text-gray-300">$</span>
                      <input
                        type="number"
                        value={formData.previous_price || ""}
                        onChange={(e) =>
                          update("previous_price", e.target.value ? +e.target.value : null)
                        }
                        className="h-14 w-full rounded-2xl border border-gray-100 bg-gray-50 pr-6 pl-12 text-2xl font-black text-gray-400 transition-all focus:bg-white focus:ring-4 focus:ring-[#67B500]/5 focus:outline-none"
                      />
                    </div>
                    {formData.previous_price &&
                      formData.previous_price > formData.price_per_adult && (
                        <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black tracking-tighter text-gray-800 uppercase">
                          Save ${(formData.previous_price - formData.price_per_adult).toFixed(2)} (
                          {Math.round(
                            (1 - formData.price_per_adult / formData.previous_price) * 100,
                          )}
                          % off)
                        </div>
                      )}
                  </div>
                </div> : null}

                <div className="space-y-3">
                  <label className="text-sm font-black tracking-widest text-gray-500 uppercase">
                    Price note (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. price varies by group size"
                    value={formData.price_note || ""}
                    onChange={(e) => update("price_note", e.target.value)}
                    className="h-12 w-full rounded-2xl border border-gray-100 bg-gray-50 px-6 text-base font-medium text-gray-900 transition-all placeholder:text-gray-700 focus:bg-white focus:ring-4 focus:ring-[#67B500]/5 focus:outline-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-black tracking-widest text-gray-500 uppercase">
                    Typically booked X days in advance
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 7"
                    value={formData.avg_booking_lead_days || ""}
                    onChange={(e) =>
                      update("avg_booking_lead_days", e.target.value ? +e.target.value : null)
                    }
                    className="h-12 w-full rounded-2xl border border-gray-100 bg-gray-50 px-6 text-base font-medium text-gray-900 transition-all placeholder:text-gray-700 focus:bg-white focus:ring-4 focus:ring-[#67B500]/5 focus:outline-none"
                  />
                  <p className="text-xs text-gray-500">
                    This appears as 'Book ahead' in the booking card
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-black tracking-widest text-gray-500 uppercase">
                    SEO description override (optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Auto-generated from title if left empty. Max 155 chars."
                    value={formData.meta_description || ""}
                    onChange={(e) => update("meta_description", e.target.value)}
                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 p-4 font-medium text-gray-900 transition-all placeholder:text-gray-700 focus:bg-white focus:ring-4 focus:ring-[#67B500]/5 focus:outline-none"
                  />
                  <div className="flex justify-end px-2">
                    <span
                      className={`text-xs font-bold ${(formData.meta_description?.length || 0) > 155 ? "text-red-500" : "text-gray-400"}`}
                    >
                      {formData.meta_description?.length || 0} / 155
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Itinerary */}
            {step === 6 && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  <div className="space-y-4">
                    {formData.itinerary_steps.map((stepItem, idx) => (
                      <div
                        key={stepItem.id}
                        className="relative rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-[#67B500]/30"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#67B500] text-xs font-black text-white">
                              {idx + 1}
                            </div>
                            <input
                              type="text"
                              value={stepItem.title}
                              onChange={(e) => {
                                const newS = [...formData.itinerary_steps];
                                newS[idx].title = e.target.value;
                                update("itinerary_steps", newS);
                              }}
                              placeholder="Stop Title"
                              className="bg-transparent font-bold text-gray-900 placeholder:text-gray-700 focus:outline-none"
                            />
                          </div>
                          <button
                            onClick={() => {
                              const newS = [...formData.itinerary_steps];
                              newS.splice(idx, 1);
                              update("itinerary_steps", newS);
                            }}
                            className="text-gray-300 transition-colors hover:text-red-500"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>

                        {hasOffers ? (
                          <OfferScopePicker
                            offers={offers}
                            selected={stepItem.offer_ids ?? ["*"]}
                            onChange={(offer_ids) => update("itinerary_steps", formData.itinerary_steps.map((item) => item.id === stepItem.id ? {...item, offer_ids} : item))}
                          />
                        ) : null}

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                              Duration
                            </label>
                            <input
                              type="text"
                              value={stepItem.duration}
                              onChange={(e) => {
                                const newS = [...formData.itinerary_steps];
                                newS[idx].duration = e.target.value;
                                update("itinerary_steps", newS);
                              }}
                              placeholder="e.g. 2 hours"
                              className="w-full rounded-xl border border-gray-50 bg-gray-50 px-3 py-2 text-xs font-bold text-black placeholder:text-gray-700 focus:bg-white focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                              Location Pin
                            </label>
                            <button
                              onClick={() => setPickingStepId(stepItem.id)}
                              className={`flex w-full items-center justify-center gap-2 rounded-xl py-2 text-[10px] font-black uppercase transition-all ${
                                stepItem.coordinates
                                  ? "border border-emerald-100 bg-emerald-50 text-gray-800"
                                  : "border border-gray-100 bg-gray-50 text-gray-900"
                              }`}
                            >
                              <MapPin className="h-3 w-3" />
                              {stepItem.coordinates ? "Pinned" : "Pick on Map"}
                            </button>
                          </div>
                        </div>

                        <label className="group mt-4 flex cursor-pointer items-center gap-2">
                          <ImageIcon className="h-4 w-4 shrink-0 text-gray-400" />
                          {stepItem.image ? (
                            <img
                              src={stepItem.image}
                              className="h-10 w-16 rounded-lg border border-gray-200 object-cover"
                            />
                          ) : (
                            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors group-hover:bg-gray-200">
                              Add step photo
                            </span>
                          )}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => handleStepPhotoUpload(e, stepItem.id)}
                          />
                        </label>
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        const newId =
                          formData.itinerary_steps.length > 0
                            ? Math.max(...formData.itinerary_steps.map((s) => s.id)) + 1
                            : 1;
                        update("itinerary_steps", [
                          ...formData.itinerary_steps,
                          { id: newId, title: "", duration: "", offer_ids: ["*"] },
                        ]);
                      }}
                      className="flex h-20 w-full items-center justify-center gap-3 rounded-[2rem] border-2 border-dashed border-gray-100 text-sm font-black text-gray-300 transition-all hover:border-[#67B500]/50 hover:text-[#67B500]"
                    >
                      <Plus className="h-5 w-5" />
                      Add stop
                    </button>
                  </div>

                  <div className="sticky top-40 h-[600px] w-full">
                    <MapboxItineraryMap
                      steps={formData.itinerary_steps}
                      pickingStepId={pickingStepId}
                      onPinPlaced={(id, coords) => {
                        const newS = formData.itinerary_steps.map((s) =>
                          s.id === id ? { ...s, coordinates: coords } : s,
                        );
                        update("itinerary_steps", newS);
                        setPickingStepId(null);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Review */}
            {step === 7 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 space-y-10 duration-500">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                    ✅
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Review before publishing</h2>
                    <p className="font-medium text-gray-500">
                      Everything look good? Save this trek to the platform.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                  <div className="space-y-6">
                    <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-2xl ring-1 shadow-black/5 ring-black/5">
                      <div className="relative aspect-video w-full">
                        {formData.cover_image && (
                          <img
                            src={formData.cover_image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 p-8 text-white">
                          <span className="text-[10px] font-black tracking-widest text-gray-900 uppercase">
                            {categories.find((c) => c.id === formData.category_id)?.name ||
                              "Category"}
                          </span>
                          <h3 className="text-2xl font-black">
                            {formData.title || "Your Trek Title"}
                          </h3>
                        </div>
                      </div>
                      <div className="p-8">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 font-bold text-gray-900">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">{formData.duration}</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-bold text-gray-900">
                              <Users className="h-4 w-4" />
                              <span className="text-sm">Max {formData.max_group_size}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="block text-[10px] font-black tracking-widest text-gray-400 uppercase">
                              Starting at
                            </span>
                            <span className="text-3xl font-black text-gray-900">
                              ${formData.price_per_adult}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-black/5 bg-gray-50/50 p-8">
                      <h4 className="mb-6 text-xs font-black tracking-widest text-gray-400 uppercase">
                        Launch Checklist
                      </h4>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {[
                          ...(hasOffers ? [{ label: "Two offer packages and prices", ok: offers.length === 2 && offers.every((offer) => !!offer.title.trim() && offer.price_adult > 0 && offer.price_child > 0) }] : []),
                          { label: "Title set", ok: !!formData.title },
                          { label: "Category selected", ok: !!formData.category_id },
                          { label: "Description ready", ok: formData.about.length >= 50 },
                          { label: "Cover photo added", ok: !!formData.cover_image },
                          { label: "Price defined", ok: formData.price_per_adult > 0 },
                          { label: "Languages set", ok: formData.live_guide_languages.length > 0 },
                          { label: "Start location OK", ok: !!formData.start_location },
                          {
                            label: "Itinerary (optional)",
                            ok: formData.itinerary_steps.length > 0,
                            optional: true,
                          },
                        ].map((check) => (
                          <div key={check.label} className="flex items-center gap-3">
                            {check.ok ? (
                              <CheckCircle2 className="h-5 w-5 text-gray-800" />
                            ) : (
                              <AlertCircle
                                className={`h-5 w-5 ${check.optional ? "text-amber-400" : "text-red-400"}`}
                              />
                            )}
                            <span
                              className={`text-sm font-bold ${check.ok ? "text-gray-900" : "text-gray-400"}`}
                            >
                              {check.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center space-y-8">
                    <div className="space-y-4 rounded-3xl border border-black/5 p-8">
                      <h4 className="text-lg font-black text-gray-900">Visibility Status</h4>
                      <div className="flex gap-4">
                        <button
                          onClick={() => update("is_active", false)}
                          className={`flex-1 rounded-2xl border p-4 text-left transition-all ${
                            !formData.is_active
                              ? "border-[#67B500] bg-gray-50 ring-2 ring-[#67B500]"
                              : "border-gray-100 bg-white hover:border-gray-200"
                          }`}
                        >
                          <span className="block text-sm font-black text-gray-900">Draft</span>
                          <span className="text-[10px] font-medium text-gray-400 italic">
                            Not visible on site
                          </span>
                        </button>
                        <button
                          onClick={() => update("is_active", true)}
                          className={`flex-1 rounded-2xl border p-4 text-left transition-all ${
                            formData.is_active
                              ? "border-[#67B500] bg-emerald-50 ring-2 ring-[#67B500]"
                              : "border-gray-100 bg-white hover:border-gray-200"
                          }`}
                        >
                          <span className="block text-sm font-black text-gray-900">Live</span>
                          <span className="text-[10px] font-medium text-gray-400 italic">
                            Published to public
                          </span>
                        </button>
                      </div>
                    </div>

                    {saveError && (
                      <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600">
                        <AlertCircle className="h-5 w-5" />
                        {saveError}
                      </div>
                    )}

                    <button
                      onClick={handleSubmit}
                      disabled={saving}
                      className="flex h-16 w-full items-center justify-center gap-3 rounded-full bg-[#67B500] text-xl font-black text-white shadow-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70"
                    >
                      {saving ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : trekId ? (
                        "💾 Save Changes"
                      ) : formData.is_active ? (
                        "🚀 Publish Trek"
                      ) : (
                        "💾 Save Draft"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2 pb-8">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-black transition-all ${
                step === 1
                  ? "pointer-events-none opacity-0"
                  : "text-gray-400 hover:bg-white hover:text-[#67B500]"
              }`}
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>

            {step < 7 ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid(step)}
                className={`flex items-center gap-3 rounded-full px-8 py-3.5 text-sm font-black shadow-lg transition-all active:scale-95 ${
                  isStepValid(step)
                    ? "bg-[#67B500] text-white shadow-[#67B500]/20 hover:bg-[#0f3d24]"
                    : "cursor-not-allowed bg-gray-100 text-gray-300 shadow-none"
                }`}
              >
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex items-center gap-3 rounded-full bg-[#67B500] px-8 py-3.5 text-sm font-black text-white shadow-lg shadow-[#67B500]/20 transition-all hover:bg-[#0f3d24] active:scale-95 disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : trekId ? (
                  "💾 Save Changes"
                ) : formData.is_active ? (
                  "🚀 Publish Trek"
                ) : (
                  "💾 Save Draft"
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
