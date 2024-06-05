import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const organizations = sqliteTable("organization", {
  bankIban: text("bank_iban"),
  city: text("city"),
  country: text("country"),
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  state: text("state"),
  streetAddress: text("street_address"),
  userId: text("user_id").notNull(),
  vatNumber: text("vat_number"),
  zipCode: text("zip_code"),
});

export type InsertOrganizationType = typeof organizations.$inferInsert;
