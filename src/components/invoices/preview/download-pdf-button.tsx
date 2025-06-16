"use client";
import React from "react";

import { type InsertOrganizationType } from "@/lib/db/schema/organization";
import { type InvoiceFormType } from "@/lib/form-schema/invoice-form";

// Import via relative node_modules path to avoid "Element type
// is invalid" error in the terminal when importing directly from
// @react-pdf/renderer in a Next.js app
//
// ```
// Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined
// ```
//
// - https://github.com/diegomura/react-pdf/issues/2890#issuecomment-2443831013
import { PDFDownloadLink } from "../../../../node_modules/@react-pdf/renderer/lib/react-pdf.browser";
import { PdfDocument } from "./pdf-preview";

interface Props {
  invoice: InvoiceFormType;
  children: React.ReactNode;
  organization?: InsertOrganizationType;
}

export function DownloadPdfButton({ children, invoice, organization }: Props) {
  return (
    <PDFDownloadLink
      className="-mt-4"
      document={<PdfDocument invoice={invoice} organization={organization} />}
      fileName={invoice.invoiceId ?? "invoice"}
    >
      {children}
    </PDFDownloadLink>
  );
}
