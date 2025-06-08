import { InfoIcon } from "lucide-react";
import Link from "next/link";

import { BackButton } from "@/components/invoices/back-button";
import { AddNewForm } from "@/components/invoices/form";
import { InvoiceStatus } from "@/components/invoices/invoce-status";
import InvoiceActions from "@/components/invoices/invoice-actions";
import { PdfPreview } from "@/components/invoices/preview/pdf-preview";
import { ErrorComponent } from "@/components/shared/error-component";
import { Button } from "@/components/ui/button";
import { getAllClients } from "@/lib/actions/client";
import { getInvoiceById } from "@/lib/actions/invoice";
import { getOrganization } from "@/lib/actions/organization";
import { cn } from "@/lib/utils";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const { data: invoice, error: invoiceError } = await getInvoiceById(id);
  const { data: organization, error: organizationError } =
    await getOrganization();
  const { data: clients, error: clientsError } = await getAllClients();

  if (clientsError) return <ErrorComponent message={clientsError.message} />;
  if (invoiceError) return <ErrorComponent message={invoiceError.message} />;
  if (organizationError)
    return <ErrorComponent message={organizationError.message} />;

  return (
    <div className="relative m-auto w-full max-w-screen-2xl space-y-4 ">
      {!organization?.name && (
        <div className="flex w-full items-center gap-2 rounded border border-red-500/70 p-2 text-sm">
          <InfoIcon className="h-4 w-4 flex-none" /> Set up your organization
          before issuing an invoice.
          <Link href="/settings">
            <Button size="sm" variant="outline">
              Set up organization
            </Button>
          </Link>
        </div>
      )}
      <div className=" flex items-center gap-4">
        <BackButton />
        {!invoice.invoiceId ? (
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight text-primary/50 sm:grow-0">
            New Draft
          </h1>
        ) : (
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            {invoice.invoiceId}
          </h1>
        )}

        <InvoiceStatus
          dueDate={invoice.dueDate}
          issuedAt={invoice.issuedAt}
          paidAt={invoice.paidAt}
        />
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <InvoiceActions
            disabled={!organization?.name}
            id={id}
            issuedAt={invoice.issuedAt}
            paidAt={invoice.paidAt}
          />
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col gap-4 lg:grid",
          !invoice.issuedAt && "lg:grid-cols-2",
        )}
      >
        {!invoice.issuedAt && (
          <AddNewForm clients={clients} invoice={invoice} />
        )}
        <PdfPreview invoice={invoice} organization={organization} />
        <div className="flex items-center justify-center gap-2 md:hidden">
          <InvoiceActions
            disabled={!organization?.name}
            id={id}
            issuedAt={invoice.issuedAt}
            paidAt={invoice.paidAt}
          />
        </div>
      </div>
    </div>
  );
}
