import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { clients } from "./client";

export const invoices = sqliteTable("invoice", {
  billingEmail: text("billing_email"),
  clientId: text("client_id"),
  clientName: text("client_name"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  dueDate: integer("due_date", { mode: "timestamp_ms" }),
  id: text("id").notNull().primaryKey(),
  invoiceDetails: text("invoice_details"),
  invoiceId: text("invoice_id"),
  issuedAt: integer("issued_at", { mode: "timestamp_ms" }),
  items: text("items"),
  paidAt: integer("paid_at", { mode: "timestamp_ms" }),
  reference: text("reference"),
  subtotal: integer("subtotal"),
  tax: integer("tax"),
  termsAndConditions: text("terms_and_conditions"),
  total: integer("total"),
  userId: text("user_id").notNull(),
});

export const invoicesRelations = relations(invoices, ({ one }) => ({
  client: one(clients, {
    fields: [invoices.clientId],
    references: [clients.id],
    relationName: "client",
  }),
}));

export type InsertInvoiceType = typeof invoices.$inferInsert;
export type SelectInvoiceType = typeof invoices.$inferSelect;
