import React from "react";

import { Button } from "../ui/button";
import { MarkInvoiceAsPaid } from "./mark-as-paid-invoice-button";
import { RemoveInvoice } from "./remove-invoice-button";

interface Props {
  id: string;
  issuedAt: Date | null;
  paidAt: Date | null;
  disabled: boolean;
}

export default function InvoiceActions({
  disabled,
  id,
  issuedAt,
  paidAt,
}: Props) {
  return (
    <>
      <Button size="sm" variant="outline">
        <RemoveInvoice id={id} />
      </Button>
      {!issuedAt ? (
        <Button
          disabled={disabled}
          form="send-invoice-form"
          size="sm"
          type="submit"
        >
          Send Invoice
        </Button>
      ) : (
        <MarkInvoiceAsPaid id={id} paidAt={paidAt} />
      )}
    </>
  );
}
