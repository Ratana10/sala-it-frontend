import { z } from "zod";

export const invoiceSchema = z.object({
  studentName: z.string().min(1, "Student name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  amount: z.number().min(1, "Amount must be greater than 0"),
  remark: z.string().optional(),
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;