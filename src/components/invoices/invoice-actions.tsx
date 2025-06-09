"use client";

import React from "react";

import { useDeleteInvoice } from "@/hooks/useDeleteInvoice";

import { Button } from "../ui/button";
import { MarkInvoiceAsPaid } from "./mark-as-paid-invoice-button";

interface Props {
  clientName: string | undefined;
  disabled: boolean;
  id: string;
  invoiceId: string | undefined;
  issuedAt: Date | null;
  paidAt: Date | null;
}

export default function InvoiceActions({
  clientName,
  disabled,
  id,
  invoiceId,
  issuedAt,
  paidAt,
}: Props) {
  const { DeleteDialog, setDeleteDialogOpen } = useDeleteInvoice({
    clientName: clientName ?? null,
    id,
    invoiceId: invoiceId ?? null,
  });

  return (
    <>
      <DeleteDialog />
      <Button
        onClick={() => setDeleteDialogOpen(true)}
        size="sm"
        variant="outline"
      >
        Delete
      </Button>
      {!issuedAt ? (
        <Button
          disabled={disabled}
          form="update-invoice-form"
          size="sm"
          type="submit"
        >
          Issue Invoice
        </Button>
      ) : (
        <MarkInvoiceAsPaid id={id} paidAt={paidAt} />
      )}
    </>
  );
}
