import { z } from "zod";

export const organizationFormShema = z.object({
  bankIban: z.string().optional(),
  city: z.string().min(1, "City is required."),
  country: z.string().min(1, "Country is required."),
  id: z.string().optional(),
  name: z.string().min(1, "Organization name is required."),
  state: z.string().min(1, "State is required."),
  streetAddress: z.string().min(1, "Street address is required."),
  userId: z.string(),
  vatNumber: z.string().optional(),
  zipCode: z.string().min(1, "Zip code is required."),
});

export type OrganizationFormSchema = z.infer<typeof organizationFormShema>;

export const organizationPartialFormSchema = organizationFormShema.partial();

export type OrganizationPartialSchemaType = z.infer<
  typeof organizationPartialFormSchema
>;
