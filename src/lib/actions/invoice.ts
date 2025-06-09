"use server";
import { auth } from "@clerk/nextjs/server";
import { startOfMonth, startOfWeek } from "date-fns";
import { and, desc, eq, gt, isNotNull, isNull, lt } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db/db";

import { type InsertInvoiceType, invoices } from "../db/schema/invoice";
import {
  type InvoiceFormType,
  type InvoiceItemsType,
} from "../form-schema/invoice-form";
import { sendInvoiceWithPdf } from "../mail/mail";
import { getClientById } from "./client";
import { getOrganization } from "./organization";

export type InvoiceFilterType = "draft" | "overdue" | "paid" | "pending";

const getInvoiceFilterQuery = (filter: InvoiceFilterType) => {
  switch (filter) {
    case "draft":
      return and(isNull(invoices.issuedAt));
    case "overdue":
      return and(isNull(invoices.paidAt), lt(invoices.dueDate, new Date()));
    case "paid":
      return isNotNull(invoices.paidAt);
    case "pending":
      return and(
        isNull(invoices.paidAt),
        isNotNull(invoices.issuedAt),
        gt(invoices.dueDate, new Date()),
      );
    default:
      return;
  }
};

function handleAuth() {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  return userId;
}

export async function getAllInvoices({
  filter,
  limit,
}: {
  filter?: InvoiceFilterType;
  limit?: number;
}) {
  const userId = handleAuth();

  try {
    const data = await db.query.invoices.findMany({
      limit: limit ?? 0,
      orderBy: desc(invoices.createdAt),
      where: and(
        filter && getInvoiceFilterQuery(filter),
        eq(invoices.userId, userId),
      ),
    });

    return { data, error: null };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: { message: "Failed to get invoices" },
    };
  }
}

export async function getAllInvoicesForClient({
  clientId,
  filter,
  limit,
}: {
  filter?: InvoiceFilterType;
  clientId: string;
  limit?: number;
}) {
  const userId = handleAuth();

  try {
    const data = await db.query.invoices.findMany({
      limit: limit ?? 0,
      orderBy: desc(invoices.createdAt),
      where: and(
        filter && getInvoiceFilterQuery(filter),
        eq(invoices.userId, userId),
        eq(invoices.clientId, clientId),
      ),
    });

    return { data, error: null };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: { message: "Failed to get invoices" },
    };
  }
}

export async function getInvoiceById(id: string) {
  const userId = handleAuth();

  try {
    const data = await db.query.invoices.findFirst({
      where: and(eq(invoices.id, id), eq(invoices.userId, userId)),
      with: { client: true },
    });

    if (!data) {
      return {
        data: null,
        error: { message: "Invoice not found" },
      };
    }

    const items: InvoiceItemsType = data.items
      ? (JSON.parse(data.items) as InvoiceItemsType)
      : [];

    const invoice: InvoiceFormType = {
      client: data.client,
      clientId: data.clientId ?? "",
      dueDate: data.dueDate,
      id: data.id,
      invoiceDetails: data.invoiceDetails,
      invoiceId: data.invoiceId ?? "",
      issuedAt: data.issuedAt,
      items,
      paidAt: data.paidAt,
      reference: data.reference ?? "",
      subtotal: data.subtotal ?? 0,
      tax: data.tax ?? 0,
      termsAndConditions: data.termsAndConditions,
      total: data.total ?? 0,
      userId: data.userId,
    };

    return {
      data: invoice,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: { message: `Failed to get invoice by id: ${id}` },
    };
  }
}

export async function addInvoice({ clientId }: { clientId?: string }) {
  const userId = handleAuth();

  try {
    const { data: client } = await getClientById(clientId ?? "");

    if (!client && clientId) {
      return {
        data: null,
        error: { message: "Failed to add invoice for this client" },
      };
    }

    const data = await db
      .insert(invoices)
      .values({
        billingEmail: client?.billingEmail,
        clientId: client?.id,
        clientName: client?.name,
        createdAt: new Date(),
        id: crypto.randomUUID(),
        userId,
      })
      .returning({ id: invoices.id });

    return { data: data[0], error: null };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: { message: "Failed to add invoice" },
    };
  }
}

export async function updateInvoice({ invoice }: { invoice: InvoiceFormType }) {
  const userId = handleAuth();
  if (invoice.userId !== userId) {
    return {
      data: null,
      error: { message: "Unauthorized: Cannot update this invoice." },
    };
  }
  try {
    const result = invoice.items?.reduce(
      (acc, item) => {
        const itemSubtotal = item.quantity * item.unitPrice;
        const itemTax = itemSubtotal * (item.tax / 100);
        const itemTotal = itemSubtotal + itemTax;

        acc.subtotal += itemSubtotal;
        acc.tax += itemTax;
        acc.total += itemTotal;

        return acc;
      },
      { subtotal: 0, tax: 0, total: 0 },
    );

    const items = JSON.stringify(invoice.items) ?? null;

    const updatedInvoice: Omit<InsertInvoiceType, "createdAt"> = {
      billingEmail: invoice.client?.billingEmail,
      clientId: invoice.client?.id,
      clientName: invoice.client?.name,
      dueDate: invoice.dueDate,
      id: invoice.id,
      invoiceDetails: invoice.invoiceDetails,
      invoiceId: invoice.invoiceId,
      items,
      reference: invoice.reference,
      subtotal: result?.subtotal,
      tax: result?.tax,
      termsAndConditions: invoice.termsAndConditions,
      total: result?.total,
      userId: invoice.userId,
    };

    await db
      .update(invoices)
      .set(updatedInvoice)
      .where(and(eq(invoices.id, invoice.id), eq(invoices.userId, userId)));

    return {
      data: { message: "Invoice updated" },
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: { message: "Failed to update invoice" },
    };
  }
}

export async function sendInvoice({ id }: { id: string }) {
  const userId = handleAuth();

  try {
    const { data: invoice, error: invoiceError } = await getInvoiceById(id);
    const { data: organization, error: organizationError } =
      await getOrganization();

    if (!organization) {
      return {
        data: null,
        error: { message: "Failed to send invoice, no organization" },
      };
    }

    if (invoiceError ?? organizationError) {
      return {
        data: null,
        error: { message: "Failed to issue invoice" },
      };
    }

    await db
      .update(invoices)
      .set({ issuedAt: new Date() })
      .where(and(eq(invoices.id, invoice.id), eq(invoices.userId, userId)));

    const { data, error } = await sendInvoiceWithPdf({ invoice, organization });

    if (error) {
      await db
        .update(invoices)
        .set({ issuedAt: null })
        .where(and(eq(invoices.id, invoice.id), eq(invoices.userId, userId)));

      return {
        data: null,
        error: { message: error.message },
      };
    }

    return {
      data: { message: data.message },
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: { message: "Failed to issue invoice" },
    };
  }
}

export async function markInvoiceAsPaid(id: string) {
  const userId = handleAuth();

  try {
    await db
      .update(invoices)
      .set({ paidAt: new Date() })
      .where(and(eq(invoices.id, id), eq(invoices.userId, userId)));

    return {
      data: { message: "Invoice marked as paid" },
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: { message: "Failed to mark invoice as paid" },
    };
  }
}

export async function deleteInvoice(id: string) {
  const userId = handleAuth();
  try {
    await db
      .delete(invoices)
      .where(and(eq(invoices.id, id), eq(invoices.userId, userId)));

    return {
      data: { message: "Invoice deleted" },
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: { message: "Failed to delete invoice" },
    };
  }
}

export async function getThisWeekDetails({ clientId }: { clientId?: string }) {
  const userId = handleAuth();
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });

  return fetchInvoiceDetails({ clientId, startDate: start, userId });
}

export async function getThisMonthDetails({ clientId }: { clientId?: string }) {
  const userId = handleAuth();
  const start = startOfMonth(new Date());

  return fetchInvoiceDetails({ clientId, startDate: start, userId });
}

async function fetchInvoiceDetails({
  clientId,
  startDate,
  userId,
}: {
  userId: string;
  startDate: Date;
  clientId?: string;
}) {
  try {
    const data = await db.query.invoices.findMany({
      columns: { total: true },
      orderBy: desc(invoices.issuedAt),
      where: and(
        eq(invoices.userId, userId),
        gt(invoices.issuedAt, startDate),
        clientId ? eq(invoices.clientId, clientId) : undefined,
      ),
    });

    const sum = data.reduce((acc, item) => acc + (item.total ?? 0), 0);

    return {
      data: { amount: sum, numberOfInvoices: data.length },
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: { message: "Failed to fetch invoice details." },
    };
  }
}

export async function revalidateInvoices(url: string) {
  revalidatePath(url);
}
