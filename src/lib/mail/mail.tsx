"use server";

import { env } from "@/env";
import { renderToBuffer } from "@react-pdf/renderer";
import { Resend } from "resend";

import { PdfDocument } from "@/lib/pdf-document";

import { type InsertOrganizationType } from "../db/schema/organization";
import { type InvoiceFormType } from "../form-schema/invoice-form";
import SendInvoiceWithPdf from "./templates/send-invoice";

const resend = new Resend(env.RESEND_API_KEY);

interface Props {
  invoice: InvoiceFormType;
  organization?: InsertOrganizationType;
}

export async function sendInvoiceWithPdf({ invoice, organization }: Props) {
  const billingEmail = invoice.client?.billingEmail;

  if (!billingEmail) {
    return {
      data: null,
      error: { message: "Failed to send invoice, no billing email" },
    };
  }

  try {
    const pdf = await renderToBuffer(
      <PdfDocument invoice={invoice} organization={organization} />,
    );

    await resend.emails.send({
      attachments: [{ content: pdf, filename: "invoice.pdf" }],
      from: "Invoiceo <noreply@karlhorky.com>",
      react: <SendInvoiceWithPdf />,
      subject: "Invoice for " + invoice.invoiceId,
      // to: billingEmail,
      to: "karl.horky@gmail.com",
    });

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
