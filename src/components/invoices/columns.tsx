"use client";

import { type ColumnDef, type Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { markInvoiceAsPaid, revalidateInvoices } from "@/lib/actions/invoice";
import { type SelectInvoiceType } from "@/lib/db/schema/invoice";
import { formatCurrency } from "@/lib/utils";

import { toast } from "../ui/use-toast";
import { InvoiceStatus } from "./invoice-status";
import { RemoveInvoice } from "./remove-invoice-button";

export const columns: ColumnDef<SelectInvoiceType>[] = [
  {
    accessorFn: ({ invoiceId }) => invoiceId,
    accessorKey: "invoice",
    cell: ({
      row: {
        original: { invoiceId },
      },
    }) => <p>{invoiceId ?? "New Draft"}</p>,
    header: "Invoice",
  },
  {
    accessorFn: ({ billingEmail, clientName }) =>
      clientName ?? "" + billingEmail ?? "",
    accessorKey: "client",
    cell: ({
      row: {
        original: { billingEmail, clientName },
      },
    }) => (
      <div>
        <p>{clientName}</p>
        <p className="text-sm text-muted-foreground">{billingEmail}</p>
      </div>
    ),
    header: "Client",
  },
  {
    accessorFn: ({ issuedAt }) => issuedAt?.toDateString(),
    accessorKey: "issuedAt",
    cell: ({
      row: {
        original: { issuedAt },
      },
    }) => <p className="min-w-max">{issuedAt?.toDateString()}</p>,
    header: "Sent at",
  },
  {
    accessorFn: ({ dueDate }) => dueDate?.toDateString(),
    accessorKey: "dueDate",
    cell: ({
      row: {
        original: { dueDate },
      },
    }) => <p className="min-w-max">{dueDate?.toDateString() ?? ""}</p>,
    header: "Due date",
  },
  {
    accessorFn: ({ total }) => total,
    accessorKey: "total",
    cell: ({
      row: {
        original: { total },
      },
    }) => <p>{total ? formatCurrency(total) : formatCurrency(0)}</p>,
    header: "Total",
  },
  {
    accessorKey: "status",
    cell: ({
      row: {
        original: { dueDate, issuedAt, paidAt },
      },
    }) => (
      <InvoiceStatus dueDate={dueDate} issuedAt={issuedAt} paidAt={paidAt} />
    ),
    header: "Status",
  },

  {
    cell: ({ row }) => <Actions row={row} />,
    id: "actions",
  },
];

function Actions({ row }: { row: Row<SelectInvoiceType> }) {
  const path = usePathname();

  const markAsPaid = async (id: string) => {
    const { data, error } = await markInvoiceAsPaid(id);

    if (error) {
      return toast({
        description: error.message,
      });
    }

    toast({
      description: data.message,
    });

    void revalidateInvoices(path);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="ml-auto flex h-8 w-8 flex-1 p-0" variant="ghost">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={!!row.original.paidAt || !row.original.issuedAt}
            onClick={() => markAsPaid(row.original.id)}
          >
            <div>Mark as paid</div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RemoveInvoice id={row.original.id} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
