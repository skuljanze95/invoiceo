"use server";

import { env } from "@/env";
import { renderToBuffer } from "@react-pdf/renderer";
import { Resend } from "resend";

import { PdfDocument } from "@/lib/pdf-document";

import { type InsertOrganizationType } from "../db/schema/organization";
import { type InvoiceFormType } from "../form-schema/invoice-form";
import { formatDate } from "../utils";
import SendInvoiceWithPdf from "./templates/send-invoice";

const resend = new Resend(env.RESEND_API_KEY);

interface Props {
  invoice: InvoiceFormType;
  organization: InsertOrganizationType;
}

export async function sendInvoiceWithPdf({ invoice, organization }: Props) {
  const clientContactFirstName = invoice.client?.contactFirstName;
  const clientBillingEmail = invoice.client?.billingEmail;
  const organizationName = organization.name;

  if (!clientContactFirstName) {
    return {
      data: null,
      error: { message: "Failed to send invoice: no client name" },
    };
  }

  if (!clientBillingEmail) {
    return {
      data: null,
      error: { message: "Failed to send invoice: no billing email" },
    };
  }

  if (!organizationName) {
    return {
      data: null,
      error: { message: "Failed to send invoice: no organization name" },
    };
  }

  try {
    const pdf = await renderToBuffer(
      <PdfDocument invoice={invoice} organization={organization} />,
    );

    const response = await resend.emails.send({
      attachments: [{ content: pdf, filename: "invoice.pdf" }],
      from: "Invoiceo <mail@invoiceo.io>",
      react: (
        <SendInvoiceWithPdf
          clientContactFirstName={clientContactFirstName}
          dueDate={invoice.dueDate && formatDate(invoice.dueDate)}
          invoiceId={invoice.invoiceId}
          organizationName={organizationName}
        />
      ),
      subject: `Invoice ID ${invoice.invoiceId}`,
      to: clientBillingEmail,
    });

    if (response.error) {
      return {
        data: null,
        error: { message: `Failed to send invoice: ${response.error.message}` },
      };
    }

    return {
      data: { message: "Invoice sent" },
      error: null,
    };
  } catch (err) {
    console.error(err);
    return {
      data: null,
      error: { message: "Failed to send invoice" },
    };
  }
}
