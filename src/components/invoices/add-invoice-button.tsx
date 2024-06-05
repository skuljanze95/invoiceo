"use client";

import { useState } from "react";

import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { addInvoice, revalidateInvoices } from "@/lib/actions/invoice";
import { cn } from "@/lib/utils";

import { Spinner } from "../ui/spinner";
import { toast } from "../ui/use-toast";

interface Props {
  className?: string;
  shrink?: boolean;
  clientId?: string;
}

export function AddInvoiceButton({ className, clientId, shrink }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleOnClick = async () => {
    setLoading(true);

    const { data, error } = await addInvoice({ clientId });

    if (error) {
      setLoading(false);
      return toast({
        description: error.message,
        title: "An error occurred",
      });
    }

    const path = `/invoices/${data?.id}`;

    void revalidateInvoices("/");

    router.push(path);
  };

  return (
    <Button
      className={cn("flex gap-1", className)}
      onClick={() => handleOnClick()}
      size="sm"
    >
      {loading ? <Spinner /> : <PlusCircle className="h-3.5 w-3.5" />}
      <span className={cn(shrink && "hidden sm:block")}>Add Invoice</span>
    </Button>
  );
}
