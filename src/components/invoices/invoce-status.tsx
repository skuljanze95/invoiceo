import { type SelectInvoiceType } from "@/lib/db/schema/invoice";

import { Badge } from "../ui/badge";

export function InvoiceStatus({
  dueDate,
  issuedAt,
  paidAt,
}: Partial<SelectInvoiceType>) {
  if (!issuedAt) {
    return (
      <Badge className="rounded-sm" variant="outline">
        Draft
      </Badge>
    );
  }
  if (paidAt) {
    return (
      <Badge className="rounded-sm" variant="outline">
        Paid
      </Badge>
    );
  }
  if (dueDate! < new Date()) {
    return (
      <Badge className="rounded-sm" variant="outline">
        Overdue
      </Badge>
    );
  }
  return (
    <Badge className="rounded-sm" variant="outline">
      Pending
    </Badge>
  );
}
