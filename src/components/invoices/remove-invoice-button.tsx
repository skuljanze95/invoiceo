"use client";

import { useHelpers } from "@/hooks/useHelpers";
import { usePathname, useRouter } from "next/navigation";

import { removeInvoice, revalidateInvoices } from "@/lib/actions/invoice";

import { DialogConfirmation } from "../shared/alert-dialog";
import { toast } from "../ui/use-toast";

export function RemoveInvoice({ id }: { id: string }) {
  const router = useRouter();
  const path = usePathname();

  const { loading, open, setLoading, setOpen } = useHelpers();

  const handleOnClick = async () => {
    setLoading(true);

    const { data, error } = await removeInvoice(id);

    if (error) {
      return toast({
        description: error.message,
      });
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

  return (
    <>
      <DialogConfirmation
        handleConfirm={handleOnClick}
        item="invoice"
        loading={loading}
        open={open}
        setIsLoading={setLoading}
        setOpen={setOpen}
      />

      <span
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        Remove
      </span>
    </>
  );
}
