"use client";

import { useEffect, useState } from "react";

import { PDFViewer } from "@react-pdf/renderer";

import { type InsertOrganizationType } from "@/lib/db/schema/organization";
import { type InvoiceFormType } from "@/lib/form-schema/invoice-form";
import { PdfDocument } from "@/lib/pdf-document";

interface Props {
  invoice: InvoiceFormType;
  organization?: InsertOrganizationType;
}

export function PdfPreview({ invoice, organization }: Props) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient ? (
        <PDFViewer showToolbar={false} style={{ aspectRatio: "1.414 / 2" }}>
          <PdfDocument invoice={invoice} organization={organization} />
        </PDFViewer>
      ) : null}
    </>
  );
}
