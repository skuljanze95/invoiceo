"use client";

import { useState } from "react";

import { useHelpers } from "@/hooks/useHelpers";
import { type ColumnDef, type Row } from "@tanstack/react-table";
import { Check, Copy, MoreHorizontal } from "lucide-react";

import { DialogDeleteConfirmation } from "@/components/shared/dialog-delete-confirmation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteClient } from "@/lib/actions/client";
import { type ClientFormType } from "@/lib/form-schema/client-form";

import { toast } from "../ui/use-toast";
import { UpdateClientForm } from "./update-client-form";

export const columns: ColumnDef<ClientFormType>[] = [
  {
    accessorFn: ({ clientDescription, name }) => name + clientDescription,
    accessorKey: "client",
    cell: ({ row }) => {
      const client = row.original.name;
      const description = row.original.clientDescription;

      return (
        <div className="flex flex-col ">
          <p>{client}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      );
    },
    header: "Client",
  },
  {
    accessorKey: "billingEmail",
    cell: ({ row }) => <BillingEmail row={row} />,
    header: "Billing email",
  },
  {
    accessorFn: ({ contactEmail, contactFirstName, contactLastName }) =>
      contactEmail + contactFirstName + contactLastName,
    accessorKey: "contact",
    cell: ({ row }) => {
      const name =
        row.original.contactFirstName + " " + row.original.contactLastName;
      const email = row.original.contactEmail;

      return (
        <div className="flex flex-col ">
          <p>{name}</p>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
      );
    },
    header: "Contact",
  },
  {
    cell: ({ row }) => <Actions row={row} />,
    id: "actions",
  },
];

function Actions({ row }: { row: Row<ClientFormType> }) {
  const { loading, open, setLoading, setOpen } = useHelpers();
  const { open: openAlert, setOpen: setOpenAlert } = useHelpers();

  const handleDeleteClient = async (id: string) => {
    setLoading(true);
    const { data, error } = await deleteClient(id);

    if (error) {
      setLoading(false);
      return toast({
        description: error.message,
        title: "An error occurred",
      });
    }

    toast({
      title: data.message,
    });

    setOpen(false);
    setLoading(false);
  };

  return (
    <>
      <UpdateClientForm open={open} service={row.original} setOpen={setOpen} />
      <DialogDeleteConfirmation
        handleConfirm={() => handleDeleteClient(row.original.id)}
        item="client"
        loading={loading}
        open={openAlert}
        setIsLoading={setLoading}
        setOpen={setOpenAlert}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="ml-auto flex h-8 w-8 flex-1  p-0" variant="ghost">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <div onClick={() => setOpen(true)}>Edit</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <div onClick={() => setOpenAlert(true)}>Delete</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

function BillingEmail({ row }: { row: Row<ClientFormType> }) {
  const [copied, setCopied] = useState(false);

  const billingEmail = row.original.billingEmail;

  return (
    <div className="group flex cursor-default items-center gap-2">
      <p>{billingEmail}</p>
      {copied ? (
        <div className="flex h-6 w-6 items-center justify-center rounded bg-background">
          <Check className="h-3 w-3 " />
        </div>
      ) : (
        <Button
          onClick={async () => {
            void navigator.clipboard.writeText(billingEmail);
            setCopied(true);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setCopied(false);
          }}
          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
          size="icon"
          variant="outline"
        >
          <Copy className="h-3 w-3" />
          <span className="sr-only">Copy Billing email</span>
        </Button>
      )}
    </div>
  );
}
