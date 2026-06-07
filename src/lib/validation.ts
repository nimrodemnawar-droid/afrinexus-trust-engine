import { z } from "zod";

export const earlyAccessSchema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email address").max(255),
  company: z.string().trim().min(1, "Company is required").max(160),
  role: z.string().trim().min(1, "Role is required").max(120),
  country: z.string().trim().min(1, "Country is required").max(80),
  context: z
    .string()
    .trim()
    .min(10, "Please share at least a sentence of context")
    .max(4000, "Please keep this under 4000 characters"),
});

export type EarlyAccessInput = z.infer<typeof earlyAccessSchema>;

export const contactSchema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email address").max(255),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z
    .string()
    .trim()
    .min(10, "Please share at least a sentence")
    .max(4000, "Please keep this under 4000 characters"),
});

export type ContactInput = z.infer<typeof contactSchema>;
