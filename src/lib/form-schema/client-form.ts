import { z } from "zod";

export const clientFormSchema = z.object(
  {
    billingEmail: z.string().email(),
    city: z
      .string()
      .min(1, {
        message: "City is required",
      })
      .max(50),
    clientDescription: z.string().max(50),
    contactEmail: z.string().email(),
    contactFirstName: z
      .string()
      .min(1, { message: "First name is required" })
      .max(50),
    contactLastName: z
      .string()
      .min(1, { message: "Last name is required" })
      .max(50),
    country: z
      .string()
      .min(1, {
        message: "Country is required",
      })
      .max(50),
    id: z.string(),
    name: z
      .string()
      .min(1, {
        message: "Name is required",
      })
      .max(50),
    state: z
      .string()
      .min(1, {
        message: "State is required",
      })
      .max(50),
    streetAddress: z
      .string()
      .min(1, {
        message: "Street address is required",
      })
      .max(50),
    userId: z.string(),
    vatNumber: z.string().max(50),
    zipCode: z
      .string()
      .min(1, {
        message: "Zip code is required",
      })
      .max(50),
  },
  { invalid_type_error: "Client is required" },
);

export type ClientFormType = z.infer<typeof clientFormSchema>;

export const DEFAULT_CLIENT_FORM_VALUES = {
  billingEmail: "",
  city: "",
  client: "",
  clientDescription: "",
  contactEmail: "",
  contactFirstName: "",
  contactLastName: "",
  country: "",
  id: "",
  name: "",
  state: "",
  streetAddress: "",
  userId: "",
  vatNumber: "",
  zipCode: "",
};
