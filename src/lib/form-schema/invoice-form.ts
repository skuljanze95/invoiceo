import { z } from "zod";

import { clientFormSchema } from "./client-form";

export const invoiceFormSchema = z.object({
  client: clientFormSchema.transform((value) => (value ? value : null)),
  clientId: z.string(),
  dueDate: z
    .date({ invalid_type_error: "Due date is required" })
    .min(new Date(), { message: "Due date is required" })
    .transform((value) => (value ? value : null)),
  id: z.string(),
  invoiceDetails: z.string().nullable(),
  invoiceId: z
    .string({
      invalid_type_error: "Invoice ID is required",
    })
    .min(1, {
      message: "Invoice ID is required",
    }),

  issuedAt: z.date().nullable(),
  items: z
    .object({
      quantity: z.coerce
        .number()
        .positive({ message: "Must be greater than 0" }),
      tax: z.coerce.number(),
      title: z.string().min(1, {
        message: "Required",
      }),
      unitPrice: z.coerce.number().min(1, {
        message: "Required",
      }),
    })
    .array()
    .refine((value) => value.length > 0, {
      message: "At least one item is required",
    }),
  paidAt: z.date().nullable(),
  reference: z
    .string({ invalid_type_error: "Reference is required" })
    .min(1, { message: "Reference is required" }),
  subtotal: z.number().optional(),
  tax: z.number().optional(),
  termsAndConditions: z.string().nullable(),
  total: z.number().optional(),
  userId: z.string(),
});

export type InvoiceFormType = z.infer<typeof invoiceFormSchema>;

export type InvoiceItemsType = z.infer<typeof invoiceFormSchema.shape.items>;
