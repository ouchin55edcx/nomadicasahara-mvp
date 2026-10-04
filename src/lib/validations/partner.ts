import { z } from "zod";

/* ------------------------------- Login ----------------------------- */

export const loginStep1Schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Introduce tu correo electrónico")
    .email("Introduce un correo electrónico válido"),
  password: z.string().min(1, "Introduce tu contraseña"),
});

export const loginStep2Schema = z.object({
  code: z
    .string()
    .regex(/^\d{6}$/, "El código debe tener6 dígitos"),
});

export type LoginStep1Values = z.infer<typeof loginStep1Schema>;
export type LoginStep2Values = z.infer<typeof loginStep2Schema>;

/* ----------------------------- Reservas --------------------------- */

export const bookingStatusSchema = z.enum([
  "Pendiente",
  "Confirmada",
  "Completada",
  "Cancelada",
  "Cancelación solicitada",
]);

export const bookingSortSchema = z.enum(["actividad", "reserva"]).default("actividad");

export const bookingFiltersSchema = z.object({
  q: z.string().optional(),
  status: bookingStatusSchema.optional(),
  productId: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  sort: bookingSortSchema,
});

export const internalNoteSchema = z.object({
  note: z
    .string()
    .trim()
    .min(5, "La nota debe tener al menos5 caracteres")
    .max(500, "Máximo500 caracteres"),
});

export const emailSchema = z.object({
  subject: z
    .string()
    .trim()
    .min(3, "El asunto debe tener al menos3 caracteres")
    .max(120, "Máximo120 caracteres"),
  message: z
    .string()
    .trim()
    .min(10, "El mensaje debe tener al menos10 caracteres")
    .max(2000, "Máximo2000 caracteres"),
});

export const cancellationRequestSchema = z.object({
  reason: z.string().trim().min(1, "Selecciona un motivo"),
  comment: z
    .string()
    .trim()
    .max(500, "Máximo500 caracteres")
    .optional(),
});

/* --------------------------- Crear producto ----------------------- */

const nonEmpty = (label: string) =>
  z.string().trim().min(2, `${label} es obligatorio`);

export const productStep1Schema = z.object({
  title: z
    .string()
    .trim()
    .min(10, "El título debe tener al menos10 caracteres")
    .max(120, "Máximo120 caracteres"),
  city: z.string().min(1, "Selecciona una ciudad"),
  category: z.string().min(1, "Selecciona una categoría"),
  shortDescription: z
    .string()
    .trim()
    .min(30, "La descripción corta debe tener al menos30 caracteres")
    .max(200, "Máximo200 caracteres"),
  longDescription: z
    .string()
    .trim()
    .min(50, "La descripción larga debe tener al menos50 caracteres"),
});

export const productStep2Schema = z.object({
  duration: nonEmpty("La duración"),
  languages: z.array(z.string()).min(1, "Selecciona al menos un idioma"),
  groupSize: z.coerce.number().int().min(1, "Tamaño mínimo1").max(100, "Máximo100 personas"),
  pickup: nonEmpty("El punto de recogida"),
  includes: z.array(z.string()).min(1, "Añade al menos un servicio incluido"),
  excludes: z.array(z.string()).min(1, "Añade al menos un servicio no incluido"),
  itinerary: z
    .array(
      z.object({
        time: z.string().min(1, "Hora obligatoria"),
        title: nonEmpty("El título del tramo"),
        description: z.string().trim().min(5, "Describe el tramo"),
      }),
    )
    .min(2, "El itinerario necesita al menos2 tramos"),
});

export const productStep3Schema = z.object({
  photos: z
    .array(z.object({ id: z.string(), url: z.string(), name: z.string() }))
    .min(1, "Sube al menos una foto"),
  coverId: z.string().min(1, "Selecciona una foto de portada"),
});

export const productStep4Schema = z.object({
  priceAdult: z.coerce.number().min(1, "Precio adulto no válido"),
  priceChild: z.coerce.number().min(0, "Precio niño no válido"),
  currency: z.literal("EUR"),
  capacity: z.coerce.number().int().min(1, "Capacidad mínima1"),
  daysOfWeek: z.array(z.string()).min(1, "Selecciona al menos un día"),
  cutoffTime: z.string().min(1, "Indica el límite de reserva"),
  cancellationPolicy: nonEmpty("La política de cancelación"),
});

export const productStep5Schema = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug no válido (solo minúsculas, números y guiones)"),
  metaDescription: z
    .string()
    .trim()
    .min(50, "La meta descripción debe tener al menos50 caracteres")
    .max(160, "Máximo160 caracteres"),
  faq: z
    .array(
      z.object({
        question: nonEmpty("La pregunta"),
        answer: z.string().trim().min(5, "Responde la pregunta"),
      }),
    )
    .min(1, "Añade al menos una pregunta frecuente"),
});

export const productStep6Schema = z.object({
  terms: z.literal(true, {
    errorMap: () => ({ message: "Debes confirmar que los datos son correctos" }),
  }),
});

/** All steps merged — used by "Publicar". */
export const productSchema = z.object({}).merge(productStep1Schema).merge(productStep2Schema).merge(productStep3Schema).merge(productStep4Schema).merge(productStep5Schema);

export type ProductFormValues = z.infer<typeof productSchema>;
