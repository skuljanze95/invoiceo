"use client";
import React, { useEffect, useState } from "react";

import { PDFDownloadLink } from "@react-pdf/renderer";

import { type InsertOrganizationType } from "@/lib/db/schema/organization";
import { type InvoiceFormType } from "@/lib/form-schema/invoice-form";

import { PdfDocument } from "./pdf-preview";

interface Props {
  invoice: InvoiceFormType;
  children: React.ReactNode;
  organization?: InsertOrganizationType;
}

export function DownloadPdfButton({ children, invoice, organization }: Props) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient ? (
        <PDFDownloadLink
          document={
            <PdfDocument invoice={invoice} organization={organization} />
          }
          className="-mt-4"
          fileName={invoice.invoiceId ?? "invoice"}
        >
          {() => children}
        </PDFDownloadLink>
      ) : null}
    </>
  );
}
