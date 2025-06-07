"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { sendInvoice, updateInvoice } from "@/lib/actions/invoice";
import { type InsertClientType } from "@/lib/db/schema/client";
import {
  invoiceFormSchema,
  type InvoiceFormType,
} from "@/lib/form-schema/invoice-form";

import { InvoceDetails } from "./invoice-details";
import { InvoiceItems } from "./invoice-items";

interface Props {
  clients: InsertClientType[];
  invoice: InvoiceFormType;
}

export function AddNewForm({ clients, invoice }: Props) {
  const router = useRouter();

  const form = useForm<InvoiceFormType>({
    defaultValues: invoice,
    resolver: zodResolver(invoiceFormSchema),
  });

  const handleSubmit = async () => {
    const formValues = form.getValues();

    const { error } = await updateInvoice({
      invoice: formValues,
    });

    if (error) {
      return toast({
        description: error.message,
        title: "An error occurred",
      });
    }
    router.refresh();
  };

  const onSubmit = async (values: InvoiceFormType) => {
    const { data, error } = await sendInvoice({
      id: values.id,
    });
    if (error) {
      return toast({
        description: error.message,
        title: "An error occurred",
      });
    }
    toast({
      description: data.message,
      title: "Invoice sent",
    });
    router.refresh();
  };

  return (
    <Form {...form}>
      <form
        className="flex-1 space-y-4 pt-4"
        id="update-invoice-form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <InvoceDetails clients={clients} handleSubmit={handleSubmit} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Invoice items</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 ">
            <InvoiceItems handleSubmit={handleSubmit} invoice={invoice} />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
