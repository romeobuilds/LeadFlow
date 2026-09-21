import { z } from "zod";
import { LEAD_PRIORITIES, LEAD_STAGES } from "@/lib/types";

// Empty strings from form inputs become null for optional columns.
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : null));

export const leadSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z
    .string()
    .trim()
    .max(160)
    .optional()
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: "Enter a valid email",
    }),
  phone: optionalText(40),
  company: optionalText(120),
  value: z.coerce.number().min(0, "Value can't be negative").default(0),
  stage: z.enum(LEAD_STAGES).default("new"),
  source: optionalText(80),
  priority: z.enum(LEAD_PRIORITIES).default("medium"),
  expectedClose: z
    .string()
    .optional()
    .transform((v) => (v ? v : null)),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** Form-managed values (pre-transform): optionals are `undefined`, not `null`. */
export type LeadFormValues = z.input<typeof leadSchema>;
