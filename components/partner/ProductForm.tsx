"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  GripVertical,
  ImageIcon,
  Plus,
  Save,
  Send,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  CANCELLATION_POLICIES,
  CATEGORIES,
  CITIES,
  LANGUAGES,
  WEEK_DAYS,
} from "@/content/partner-mock";
import {
  productStep1Schema,
  productStep2Schema,
  productStep3Schema,
  productStep4Schema,
  productStep5Schema,
  productStep6Schema,
} from "@/lib/validations/partner";

/* ------------------------------- State ------------------------------ */

type Photo = { id: string; url: string; name: string };
type ItineraryRow = { id: string; time: string; title: string; description: string };
type FaqRow = { id: string; question: string; answer: string };

type FormState = {
  // 1
  title: string;
  city: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  // 2
  duration: string;
  languages: string[];
  groupSize: string;
  pickup: string;
  includes: string[];
  excludes: string[];
  itinerary: ItineraryRow[];
  // 3
  photos: Photo[];
  coverId: string;
  // 4
  priceAdult: string;
  priceChild: string;
  currency: "EUR";
  capacity: string;
  daysOfWeek: string[];
  cutoffTime: string;
  cancellationPolicy: string;
  // 5
  slug: string;
  metaDescription: string;
  faq: FaqRow[];
  // 6
  terms: boolean;
};

const uid = () => Math.random().toString(36).slice(2, 9);

const initialState: FormState = {
  title: "",
  city: "",
  category: "",
  shortDescription: "",
  longDescription: "",
  duration: "",
  languages: [],
  groupSize: "12",
  pickup: "",
  includes: [],
  excludes: [],
  itinerary: [
    { id: uid(), time: "09:00", title: "", description: "" },
    { id: uid(), time: "11:00", title: "", description: "" },
  ],
  photos: [],
  coverId: "",
  priceAdult: "",
  priceChild: "",
  currency: "EUR",
  capacity: "12",
  daysOfWeek: ["Lun", "Mar", "Mié", "Jue", "Vie"],
  cutoffTime: "18:00",
  cancellationPolicy: "",
  slug: "",
  metaDescription: "",
  faq: [{ id: uid(), question: "", answer: "" }],
  terms: false,
};

const STEPS = [
  "Información básica",
  "Detalles",
  "Fotos",
  "Precios y disponibilidad",
  "SEO y FAQ",
  "Revisión",
] as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* ------------------------------ Component --------------------------- */

export default function ProductForm() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [state, setState] = React.useState<FormState>(initialState);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [slugTouched, setSlugTouched] = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);

  const fileRef = React.useRef<HTMLInputElement>(null);

  // Slug automático: slug de la ciudad + título
  React.useEffect(() => {
    if (slugTouched || !state.title || !state.city) return;
    const citySlug = slugify(state.city);
    setState((s) => ({ ...s, slug: `${citySlug}-${slugify(s.title)}` }));
  }, [state.title, state.city, slugTouched]);

  const citySlug = state.city ? slugify(state.city) : "ciudad";
  const previewUrl = `/${citySlug}-tours/${state.slug || "…"}`;

  function patch<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((s) => ({ ...s, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  }

  const stepSchemas = [
    productStep1Schema,
    productStep2Schema,
    productStep3Schema,
    productStep4Schema,
    productStep5Schema,
    productStep6Schema,
  ];

  function validateCurrentStep(): boolean {
    const parsed = stepSchemas[step].safeParse(state);
    if (parsed.success) {
      setErrors({});
      return true;
    }
    const map: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!map[key]) map[key] = issue.message;
    }
    setErrors(map);
    toast.error("Revisa los campos marcados", {
      description: `${Object.keys(map).length} campo(s) con error en «${STEPS[step]}»`,
    });
    return false;
  }

  function goNext() {
    if (!validateCurrentStep()) return;
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  function publish() {
    const parsed = productStep6Schema.safeParse(state);
    if (!parsed.success) {
      setErrors({ terms: parsed.error.issues[0].message });
      return;
    }
    toast.success("Producto publicado", {
      description: previewUrl,
    });
    router.push("/dashboard/products");
  }

  function saveDraft() {
    toast.success("Borrador guardado", {
      description: `«${state.title || "Producto sin título"}» guardado sin validar.`,
    });
    router.push("/dashboard/products");
  }

  /* ------------------------------ Fotos ------------------------------ */

  function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const next: Photo[] = Array.from(files).map((f) => ({
      id: uid(),
      url: URL.createObjectURL(f),
      name: f.name,
    }));
    setState((s) => {
      const photos = [...s.photos, ...next];
      return {
        ...s,
        photos,
        coverId: s.coverId || photos[0]?.id || "",
      };
    });
    setErrors((e) => {
      const copy = { ...e };
      delete copy.photos;
      delete copy.coverId;
      return copy;
    });
  }

  function removePhoto(id: string) {
    setState((s) => {
      const photos = s.photos.filter((p) => p.id !== id);
      const coverId = s.coverId === id ? photos[0]?.id ?? "" : s.coverId;
      return { ...s, photos, coverId };
    });
  }

  /* ---------------------------- Itinerario --------------------------- */

  function updateRow(list: ItineraryRow[], id: string, key: keyof ItineraryRow, value: string) {
    return list.map((r) => (r.id === id ? { ...r, [key]: value } : r));
  }

  function moveRow(list: ItineraryRow[], index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= list.length) return list;
    const copy = [...list];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    return copy;
  }

  /* ------------------------------ Render ----------------------------- */

  return (
    <div className="flex flex-col gap-6">
      {/* Barra de progreso */}
      <div className="rounded-sm border border-[#E5E5E5] bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[#1A1A1A]">
            Paso {step + 1} de {STEPS.length} · {STEPS[step]}
          </p>
          <p className="text-xs text-[#999]">{Math.round(((step + 1) / STEPS.length) * 100)} %</p>
        </div>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
          <div
            className="h-full rounded-full bg-[#66B600] transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            role="progressbar"
            aria-valuenow={step + 1}
            aria-valuemin={1}
            aria-valuemax={STEPS.length}
            aria-label="Progreso del formulario"
          />
        </div>

        <ol className="mt-4 hidden grid-cols-6 gap-2 md:grid">
          {STEPS.map((label, i) => (
            <li key={label} className="flex flex-col gap-1.5">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold",
                  i < step
                    ? "bg-[#66B600] text-white"
                    : i === step
                      ? "bg-[#1A1A1A] text-white"
                      : "bg-[#E5E5E5] text-[#999]",
                )}
              >
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-[11px] leading-tight",
                  i === step ? "font-semibold text-[#1A1A1A]" : "text-[#999]",
                )}
              >
                {label}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Contenido */}
      <div className="rounded-sm border border-[#E5E5E5] bg-white p-5 md:p-6">
        {/* -------- Paso 1 -------- */}
        {step === 0 ? (
          <div className="flex flex-col gap-5">
            <Field label="Título del producto" error={errors.title} required>
              <Input
                value={state.title}
                onChange={(e) => patch("title", e.target.value)}
                placeholder="Ej.: Medina de Marrakech: tour gastronómico al atardecer"
                className="h-12"
              />
            </Field>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Ciudad" error={errors.city} required>
                <Select value={state.city} onValueChange={(v) => patch("city", v)}>
                  <SelectTrigger className="h-12" aria-label="Ciudad">
                    <SelectValue placeholder="Selecciona una ciudad" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Categoría" error={errors.category} required>
                <Select value={state.category} onValueChange={(v) => patch("category", v)}>
                  <SelectTrigger className="h-12" aria-label="Categoría">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field
              label="Descripción corta"
              error={errors.shortDescription}
              required
              hint={`${state.shortDescription.length}/200 caracteres`}
            >
              <Textarea
                rows={2}
                value={state.shortDescription}
                onChange={(e) => patch("shortDescription", e.target.value)}
                placeholder="Resumen que aparecerá en las tarjetas de búsqueda…"
              />
            </Field>

            <Field label="Descripción larga" error={errors.longDescription} required>
              <Textarea
                rows={6}
                value={state.longDescription}
                onChange={(e) => patch("longDescription", e.target.value)}
                placeholder="Cuenta la experiencia con detalle: qué verán, cómo se vive, para quién es…"
              />
            </Field>
          </div>
        ) : null}

        {/* -------- Paso 2 -------- */}
        {step === 1 ? (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Duración" error={errors.duration} required>
                <Input
                  value={state.duration}
                  onChange={(e) => patch("duration", e.target.value)}
                  placeholder="Ej.:3 horas"
                  className="h-12"
                />
              </Field>

              <Field label="Tamaño máximo del grupo" error={errors.groupSize} required>
                <Input
                  type="number"
                  min={1}
                  value={state.groupSize}
                  onChange={(e) => patch("groupSize", e.target.value)}
                  className="h-12"
                />
              </Field>
            </div>

            <Field label="Idiomas" error={errors.languages} required>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => {
                  const active = state.languages.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      aria-pressed={active}
                      onClick={() =>
                        patch(
                          "languages",
                          active
                            ? state.languages.filter((l) => l !== lang)
                            : [...state.languages, lang],
                        )
                      }
                      className={cn(
                        "rounded-sm border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600]",
                        active
                          ? "border-[#66B600] bg-[#EAF6D6] text-[#3D7A00]"
                          : "border-[#E5E5E5] text-[#444] hover:bg-[#F7F7F7]",
                      )}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="Punto de recogida" error={errors.pickup} required>
              <Input
                value={state.pickup}
                onChange={(e) => patch("pickup", e.target.value)}
                placeholder="Ej.: Hotel Riad Yasmine, Medina"
                className="h-12"
              />
            </Field>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <TagList
                label="Incluye"
                required
                error={errors.includes}
                items={state.includes}
                onAdd={(tag) => patch("includes", [...state.includes, tag])}
                onRemove={(tag) =>
                  patch(
                    "includes",
                    state.includes.filter((i) => i !== tag),
                  )
                }
                placeholder="Ej.: Guía local"
              />
              <TagList
                label="No incluye"
                required
                error={errors.excludes}
                items={state.excludes}
                onAdd={(tag) => patch("excludes", [...state.excludes, tag])}
                onRemove={(tag) =>
                  patch(
                    "excludes",
                    state.excludes.filter((i) => i !== tag),
                  )
                }
                placeholder="Ej.: Propinas"
              />
            </div>

            {/* Itinerario */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-[#222]">
                  Itinerario <span className="text-[#D93025]">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  onClick={() =>
                    patch("itinerary", [
                      ...state.itinerary,
                      { id: uid(), time: "", title: "", description: "" },
                    ])
                  }
                >
                  <Plus className="h-3.5 w-3.5" /> Añadir tramo
                </Button>
              </div>

              {errors.itinerary ? (
                <p role="alert" className="text-xs font-medium text-[#D93025]">
                  {errors.itinerary}
                </p>
              ) : null}

              <div className="flex flex-col gap-3">
                {state.itinerary.map((row, i) => (
                  <div
                    key={row.id}
                    className="rounded-sm border border-[#E5E5E5] bg-[#FBFBFB] p-3"
                  >
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 shrink-0 text-[#BBB]" aria-hidden />
                      <span className="text-xs font-semibold text-[#999]">#{i + 1}</span>
                      <div className="ml-auto flex items-center gap-1">
                        <button
                          type="button"
                          aria-label="Subir tramo"
                          disabled={i === 0}
                          onClick={() => patch("itinerary", moveRow(state.itinerary, i, -1))}
                          className="flex h-7 w-7 items-center justify-center rounded-sm text-[#666] hover:bg-white disabled:opacity-30"
                        >
                          <ArrowRight className="h-3.5 w-3.5 -rotate-90" />
                        </button>
                        <button
                          type="button"
                          aria-label="Bajar tramo"
                          disabled={i === state.itinerary.length - 1}
                          onClick={() => patch("itinerary", moveRow(state.itinerary, i, 1))}
                          className="flex h-7 w-7 items-center justify-center rounded-sm text-[#666] hover:bg-white disabled:opacity-30"
                        >
                          <ArrowRight className="h-3.5 w-3.5 rotate-90" />
                        </button>
                        <button
                          type="button"
                          aria-label="Eliminar tramo"
                          disabled={state.itinerary.length <= 2}
                          onClick={() =>
                            patch(
                              "itinerary",
                              state.itinerary.filter((r) => r.id !== row.id),
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-sm text-[#D93025] hover:bg-white disabled:opacity-30"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-[120px_1fr]">
                      <Input
                        type="time"
                        value={row.time}
                        aria-label={`Hora del tramo ${i + 1}`}
                        onChange={(e) =>
                          patch(
                            "itinerary",
                            updateRow(state.itinerary, row.id, "time", e.target.value),
                          )
                        }
                        className="h-10"
                      />
                      <Input
                        value={row.title}
                        aria-label={`Título del tramo ${i + 1}`}
                        placeholder="Título del tramo"
                        onChange={(e) =>
                          patch(
                            "itinerary",
                            updateRow(state.itinerary, row.id, "title", e.target.value),
                          )
                        }
                        className="h-10"
                      />
                    </div>
                    <Textarea
                      rows={2}
                      value={row.description}
                      aria-label={`Descripción del tramo ${i + 1}`}
                      placeholder="Descripción…"
                      onChange={(e) =>
                        patch(
                          "itinerary",
                          updateRow(state.itinerary, row.id, "description", e.target.value),
                        )
                      }
                      className="mt-2"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* -------- Paso 3 -------- */}
        {step === 2 ? (
          <div className="flex flex-col gap-5">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                addFiles(e.dataTransfer.files);
              }}
              className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-sm border-2 border-dashed px-6 py-12 text-center transition-colors",
                dragOver
                  ? "border-[#66B600] bg-[#EAF6D6]"
                  : "border-[#E5E5E5] bg-[#FBFBFB]",
              )}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                <Upload className="h-5 w-5 text-[#999]" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A]">
                  Arrastra y suelta tus fotos aquí
                </p>
                <p className="mt-1 text-xs text-[#666]">
                  JPG o PNG, mínimo1 foto. La portada se elige debajo.
                </p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => addFiles(e.target.files)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileRef.current?.click()}
                className="h-10 gap-2"
              >
                <ImageIcon className="h-4 w-4" /> Seleccionar archivos
              </Button>
            </div>

            {errors.photos ? (
              <p role="alert" className="text-xs font-medium text-[#D93025]">
                {errors.photos}
              </p>
            ) : null}
            {errors.coverId ? (
              <p role="alert" className="text-xs font-medium text-[#D93025]">
                {errors.coverId}
              </p>
            ) : null}

            {state.photos.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {state.photos.map((photo) => {
                  const isCover = state.coverId === photo.id;
                  return (
                    <div
                      key={photo.id}
                      className={cn(
                        "group relative overflow-hidden rounded-sm border-2",
                        isCover ? "border-[#66B600]" : "border-[#E5E5E5]",
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.url}
                        alt={photo.name}
                        className="h-28 w-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-black/60 px-2 py-1.5">
                        <button
                          type="button"
                          onClick={() => patch("coverId", photo.id)}
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-wide",
                            isCover ? "text-[#8CD400]" : "text-white/80 hover:text-white",
                          )}
                        >
                          {isCover ? "Portada" : "Hacer portada"}
                        </button>
                        <button
                          type="button"
                          aria-label={`Eliminar ${photo.name}`}
                          onClick={() => removePhoto(photo.id)}
                          className="text-white/80 transition-colors hover:text-[#FF8A80]"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}

        {/* -------- Paso 4 -------- */}
        {step === 3 ? (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <Field label="Precio por adulto (€)" error={errors.priceAdult} required>
                <Input
                  type="number"
                  min={0}
                  value={state.priceAdult}
                  onChange={(e) => patch("priceAdult", e.target.value)}
                  placeholder="49"
                  className="h-12"
                />
              </Field>
              <Field label="Precio por niño (€)" error={errors.priceChild} required>
                <Input
                  type="number"
                  min={0}
                  value={state.priceChild}
                  onChange={(e) => patch("priceChild", e.target.value)}
                  placeholder="29"
                  className="h-12"
                />
              </Field>
              <Field label="Moneda" required>
                <Input value="EUR" disabled className="h-12 bg-[#F7F7F7]" readOnly />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Capacidad por salida" error={errors.capacity} required>
                <Input
                  type="number"
                  min={1}
                  value={state.capacity}
                  onChange={(e) => patch("capacity", e.target.value)}
                  className="h-12"
                />
              </Field>
              <Field label="Límite de reserva (cutoff)" error={errors.cutoffTime} required>
                <Input
                  type="time"
                  value={state.cutoffTime}
                  onChange={(e) => patch("cutoffTime", e.target.value)}
                  className="h-12"
                />
              </Field>
            </div>

            <Field label="Días de la semana" error={errors.daysOfWeek} required>
              <div className="flex flex-wrap gap-2">
                {WEEK_DAYS.map((day) => {
                  const active = state.daysOfWeek.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      aria-pressed={active}
                      onClick={() =>
                        patch(
                          "daysOfWeek",
                          active
                            ? state.daysOfWeek.filter((d) => d !== day)
                            : [...state.daysOfWeek, day],
                        )
                      }
                      className={cn(
                        "h-10 w-14 rounded-sm border text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600]",
                        active
                          ? "border-[#66B600] bg-[#EAF6D6] text-[#3D7A00]"
                          : "border-[#E5E5E5] text-[#444] hover:bg-[#F7F7F7]",
                      )}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field
              label="Política de cancelación"
              error={errors.cancellationPolicy}
              required
            >
              <Select
                value={state.cancellationPolicy}
                onValueChange={(v) => patch("cancellationPolicy", v)}
              >
                <SelectTrigger className="h-12" aria-label="Política de cancelación">
                  <SelectValue placeholder="Selecciona una política" />
                </SelectTrigger>
                <SelectContent>
                  {CANCELLATION_POLICIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        ) : null}

        {/* -------- Paso 5 -------- */}
        {step === 4 ? (
          <div className="flex flex-col gap-5">
            <Field label="Slug (URL)" error={errors.slug} required hint="Se genera automáticamente">
              <Input
                value={state.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  patch("slug", e.target.value);
                }}
                className="h-12 font-mono text-sm"
              />
            </Field>

            <div className="rounded-sm border border-[#E5E5E5] bg-[#F7F7F7] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#999]">
                Vista previa de la URL
              </p>
              <p className="mt-1 break-all font-mono text-sm text-[#3D7A00]">{previewUrl}</p>
            </div>

            <Field
              label="Meta descripción"
              error={errors.metaDescription}
              required
              hint={`${state.metaDescription.length}/160 caracteres`}
            >
              <Textarea
                rows={3}
                value={state.metaDescription}
                onChange={(e) => patch("metaDescription", e.target.value)}
                placeholder="Descripción para los buscadores…"
              />
            </Field>

            {/* FAQ */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-[#222]">
                  Preguntas frecuentes <span className="text-[#D93025]">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  onClick={() =>
                    patch("faq", [...state.faq, { id: uid(), question: "", answer: "" }])
                  }
                >
                  <Plus className="h-3.5 w-3.5" /> Añadir pregunta
                </Button>
              </div>

              {errors.faq ? (
                <p role="alert" className="text-xs font-medium text-[#D93025]">
                  {errors.faq}
                </p>
              ) : null}

              {state.faq.map((row, i) => (
                <div key={row.id} className="flex flex-col gap-2 rounded-sm border border-[#E5E5E5] p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#999]">FAQ {i + 1}</span>
                    <button
                      type="button"
                      aria-label={`Eliminar pregunta ${i + 1}`}
                      disabled={state.faq.length <= 1}
                      onClick={() =>
                        patch(
                          "faq",
                          state.faq.filter((r) => r.id !== row.id),
                        )
                      }
                      className="ml-auto flex h-7 w-7 items-center justify-center rounded-sm text-[#D93025] hover:bg-[#FDECEC] disabled:opacity-30"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <Input
                    value={row.question}
                    aria-label={`Pregunta ${i + 1}`}
                    placeholder="¿Hay que llevar documentación?"
                    onChange={(e) =>
                      patch(
                        "faq",
                        state.faq.map((r) => (r.id === row.id ? { ...r, question: e.target.value } : r)),
                      )
                    }
                    className="h-10"
                  />
                  <Textarea
                    rows={2}
                    value={row.answer}
                    aria-label={`Respuesta ${i + 1}`}
                    placeholder="Respuesta…"
                    onChange={(e) =>
                      patch(
                        "faq",
                        state.faq.map((r) => (r.id === row.id ? { ...r, answer: e.target.value } : r)),
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* -------- Paso 6 -------- */}
        {step === 5 ? (
          <div className="flex flex-col gap-5">
            <ReviewSection title="Información básica">
              <ReviewRow label="Título" value={state.title || "—"} />
              <ReviewRow label="Ciudad" value={state.city || "—"} />
              <ReviewRow label="Categoría" value={state.category || "—"} />
              <ReviewRow label="Descripción corta" value={state.shortDescription || "—"} />
            </ReviewSection>

            <ReviewSection title="Detalles">
              <ReviewRow label="Duración" value={state.duration || "—"} />
              <ReviewRow label="Idiomas" value={state.languages.join(", ") || "—"} />
              <ReviewRow label="Grupo máximo" value={`${state.groupSize} personas`} />
              <ReviewRow label="Recogida" value={state.pickup || "—"} />
              <ReviewRow label="Incluye" value={state.includes.join(", ") || "—"} />
              <ReviewRow label="No incluye" value={state.excludes.join(", ") || "—"} />
              <ReviewRow
                label="Itinerario"
                value={
                  state.itinerary.map((r) => `${r.time} ${r.title}`).join(" → ") || "—"
                }
              />
            </ReviewSection>

            <ReviewSection title="Fotos">
              <ReviewRow label="Fotos" value={`${state.photos.length} imagen(es)`} />
              <ReviewRow
                label="Portada"
                value={
                  state.photos.find((p) => p.id === state.coverId)?.name ?? "Sin portada"
                }
              />
            </ReviewSection>

            <ReviewSection title="Precios y disponibilidad">
              <ReviewRow label="Adulto" value={`${state.priceAdult} €`} />
              <ReviewRow label="Niño" value={`${state.priceChild} €`} />
              <ReviewRow label="Capacidad" value={`${state.capacity} personas`} />
              <ReviewRow label="Días" value={state.daysOfWeek.join(", ") || "—"} />
              <ReviewRow label="Cutoff" value={state.cutoffTime} />
              <ReviewRow label="Cancelación" value={state.cancellationPolicy || "—"} />
            </ReviewSection>

            <ReviewSection title="SEO y FAQ">
              <div className="rounded-sm border border-[#E5E5E5] bg-[#F7F7F7] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#999]">
                  URL final
                </p>
                <p className="mt-1 break-all font-mono text-sm text-[#3D7A00]">{previewUrl}</p>
              </div>
              <ReviewRow label="Meta descripción" value={state.metaDescription || "—"} />
              <ReviewRow label="FAQ" value={`${state.faq.length} pregunta(s)`} />
            </ReviewSection>

            <label className="flex cursor-pointer items-start gap-3 rounded-sm border border-[#E5E5E5] bg-[#FBFBFB] p-4">
              <input
                type="checkbox"
                checked={state.terms}
                onChange={(e) => patch("terms", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded-sm border-[#E5E5E5] accent-[#66B600] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B600]"
              />
              <span className="text-sm text-[#444]">
                Confirmo que los datos del producto son correctos y que cumplen las condiciones
                de publicación de Nomadica Sahara.
              </span>
            </label>
            {errors.terms ? (
              <p role="alert" className="text-xs font-medium text-[#D93025]">
                {errors.terms}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Navegación */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {step > 0 ? (
            <Button type="button" variant="outline" onClick={goBack} className="h-11 gap-2">
              <ArrowLeft className="h-4 w-4" /> Atrás
            </Button>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            onClick={saveDraft}
            className="h-11 gap-2 text-[#666]"
          >
            <Save className="h-4 w-4" /> Guardar borrador
          </Button>
        </div>

        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={goNext} className="h-11 gap-2">
            Siguiente <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="button" onClick={publish} className="h-11 gap-2">
            <Send className="h-4 w-4" /> Publicar
          </Button>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- Sub-componentes ----------------------- */

function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <Label className="text-xs font-medium text-[#222]">
          {label} {required ? <span className="text-[#D93025]">*</span> : null}
        </Label>
        {hint ? <span className="text-[11px] text-[#999]">{hint}</span> : null}
      </div>
      {children}
      {error ? (
        <p role="alert" className="text-xs font-medium text-[#D93025]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function TagList({
  label,
  items,
  onAdd,
  onRemove,
  placeholder,
  required,
  error,
}: {
  label: string;
  items: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  placeholder: string;
  required?: boolean;
  error?: string;
}) {
  const [draft, setDraft] = React.useState("");

  function submit() {
    const value = draft.trim();
    if (!value || items.includes(value)) return;
    onAdd(value);
    setDraft("");
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium text-[#222]">
        {label} {required ? <span className="text-[#D93025]">*</span> : null}
      </Label>
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={placeholder}
          aria-label={`Añadir a ${label}`}
          className="h-11"
        />
        <Button type="button" variant="outline" onClick={submit} className="h-11 px-3">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Añadir</span>
        </Button>
      </div>

      {items.length > 0 ? (
        <ul className="mt-1 flex flex-wrap gap-1.5">
          {items.map((tag) => (
            <li
              key={tag}
              className="flex items-center gap-1 rounded-sm border border-[#E5E5E5] bg-[#EAF6D6] py-1 pl-2.5 pr-1 text-xs font-medium text-[#3D7A00]"
            >
              {tag}
              <button
                type="button"
                aria-label={`Quitar ${tag}`}
                onClick={() => onRemove(tag)}
                className="flex h-4 w-4 items-center justify-center rounded-sm hover:bg-white/60"
              >
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {error ? (
        <p role="alert" className="text-xs font-medium text-[#D93025]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-sm border border-[#E5E5E5] p-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-[#1A1A1A]">
        <CheckCircle2 className="h-4 w-4 text-[#66B600]" aria-hidden />
        {title}
      </h3>
      <dl className="mt-3 flex flex-col gap-2">{children}</dl>
    </section>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
      <dt className="w-40 shrink-0 text-xs font-medium text-[#999]">{label}</dt>
      <dd className="text-sm text-[#222]">{value}</dd>
    </div>
  );
}
