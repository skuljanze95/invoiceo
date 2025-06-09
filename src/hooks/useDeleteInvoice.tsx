"use client";

import { usePathname, useRouter } from "next/navigation";

import { DialogDeleteConfirmation } from "@/components/shared/dialog-delete-confirmation";
import { toast } from "@/components/ui/use-toast";
import { deleteInvoice, revalidateInvoices } from "@/lib/actions/invoice";
import { type SelectInvoiceType } from "@/lib/db/schema/invoice";

import { useHelpers } from "./useHelpers";

export function useDeleteInvoice(
  invoice: Pick<SelectInvoiceType, "id" | "invoiceId" | "clientName">,
) {
  const path = usePathname();
  const { loading, open, setLoading, setOpen } = useHelpers();
  const router = useRouter();

  const handleDeleteInvoice = async () => {
    setLoading(true);

    const { data, error } = await deleteInvoice(invoice.id);

    if (error) {
      setLoading(false);
      return toast({ description: error.message });
    }

    toast({ description: data.message });
    setOpen(false);

    if (path.includes("invoices")) {
      void revalidateInvoices("/invoices");
      router.push("/invoices");
    } else {
      void revalidateInvoices("/");
      router.push("/");
    }
  };

  return {
    DeleteDialog: () => (
      <DialogDeleteConfirmation
        handleConfirm={handleDeleteInvoice}
        item={`invoice "${invoice.invoiceId ?? "New Draft"}"${!!invoice.clientName ? ` for ${invoice.clientName}` : ""}`}
        loading={loading}
        open={open}
        setIsLoading={setLoading}
        setOpen={setOpen}
      />
    ),
    setDeleteDialogOpen: setOpen,
  };
}
