import { z } from "zod";

export const invoiceSchema = z.object({
  name: z.string().min(1, "Student name is required"),
  email: z.string().optional(),
  phone: z.string().optional(),
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;