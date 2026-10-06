import {z} from "zod";

const today = () => new Date().toISOString().slice(0, 10);

export const bookingRequestSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "dateRequired").refine((value) => value >= today(), "dateRequired"),
  travelers: z.coerce.number().int().min(1, "travelersRequired").max(20, "travelersRequired"),
  pickup: z.string().trim().max(240, "serverError").optional().default(""),
  notes: z.string().trim().max(1000, "serverError").optional().default(""),
  name: z.string().trim().min(2, "nameRequired").max(120, "nameRequired"),
  email: z.string().trim().email("emailInvalid").max(254, "emailInvalid"),
  countryCode: z.string().regex(/^\+\d{1,4}$/, "phoneRequired"),
  phone: z.string().trim().min(5, "phoneRequired").max(30, "phoneRequired"),
  consent: z.literal(true, {errorMap: () => ({message: "consentRequired"})}),
});

export type BookingRequest = z.infer<typeof bookingRequestSchema>;
