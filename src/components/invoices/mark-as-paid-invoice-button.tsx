"use client";

import { useHelpers } from "@/hooks/useHelpers";
import { useRouter } from "next/navigation";

import { markInvoiceAsPaid } from "@/lib/actions/invoice";

import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/use-toast";

interface Props {
  id: string;
  paidAt: Date | null;
}

export function MarkInvoiceAsPaid({ id, paidAt }: Props) {
  const router = useRouter();

  const { loading, setLoading } = useHelpers();

  const handleOnClick = async () => {
    setLoading(true);

    const { data, error } = await markInvoiceAsPaid(id);

    if (error) {
      setLoading(false);

      return toast({
        description: error.message,
      });
    }

    toast({ description: data.message });

    router.refresh();
    setLoading(false);
  };

  return (
    <Button disabled={!!paidAt} onClick={handleOnClick}>
      {loading && <Spinner />}
      Mark as Paid
    </Button>
  );
}
