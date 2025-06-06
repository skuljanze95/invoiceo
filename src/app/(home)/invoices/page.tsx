import { Suspense } from "react";

import { File } from "lucide-react";
import { type Metadata } from "next";

import { AddInvoiceButton } from "@/components/invoices/add-invoice-button";
import { columns } from "@/components/invoices/columns";
import { FilterDropdown } from "@/components/invoices/filter-dropdown";
import { DataTable } from "@/components/shared/data-table";
import { ErrorComponent } from "@/components/shared/error-component";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllInvoices, type InvoiceFilterType } from "@/lib/actions/invoice";

export const metadata: Metadata = {
  description: "Manage your invoices.",
  title: "Invoiceo - Invoices",
};

export default async function Page({
  searchParams: { filter },
}: {
  searchParams: {
    filter: InvoiceFilterType;
  };
}) {
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-2">
        <Card className="relative">
          <div className="absolute right-6 top-6 flex gap-2">
            <Button className="h-7 gap-1" size="sm" variant="outline">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>

            <AddInvoiceButton className="h-7" shrink />
          </div>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Manage your invoices.</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <DataTable
                  columns={columns}
                  data={[]}
                  loading={true}
                  slot={<FilterDropdown baseUrl="" filter={filter} />}
                />
              }
            >
              <Table filter={filter} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

async function Table({ filter }: { filter?: InvoiceFilterType }) {
  const { data, error } = await getAllInvoices({ filter: filter, limit: 10 });

  if (error) return <ErrorComponent message={error.message} />;

  const baseUrl = `/invoices`;

  return (
    <DataTable
      columns={columns}
      data={data}
      redirectBaseUrl={baseUrl}
      slot={<FilterDropdown baseUrl={baseUrl} filter={filter} />}
    />
  );
}
