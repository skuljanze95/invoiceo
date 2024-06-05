import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const clients = sqliteTable("client", {
  billingEmail: text("billing_email").notNull(),
  city: text("city").notNull().notNull(),
  clientDescription: text("client_description").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactFirstName: text("contact_first_name").notNull(),
  contactLastName: text("contact_last_name").notNull(),
  country: text("country").notNull(),
  id: text("id").notNull().primaryKey(),
  name: text("client").notNull(),
  state: text("state").notNull(),
  streetAddress: text("street_address").notNull(),
  userId: text("user_id").notNull(),
  vatNumber: text("vat_number").notNull(),
  zipCode: text("zip_code").notNull(),
});

export type InsertClientType = typeof clients.$inferInsert;
