import { Suspense } from "react";

import { type Metadata } from "next";

import { AddClientForm } from "@/components/clients/add-client-form";
import { columns } from "@/components/clients/columns";
import { DataTable } from "@/components/shared/data-table";
import { ErrorComponent } from "@/components/shared/error-component";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllClients } from "@/lib/actions/client";

export const metadata: Metadata = {
  description: "Manage your clients.",
  title: "Invoiceo - Clients",
};

export default function Page() {
  return (
    <div className="w-full space-y-4 ">
      <div className="flex flex-col gap-2">
        <Card className="relative">
          <div className="absolute right-6 top-6 flex gap-2">
            <AddClientForm />
          </div>

          <CardHeader className="flex">
            <CardTitle>Clients</CardTitle>
            <CardDescription>Manage your clients.</CardDescription>
          </CardHeader>

          <CardContent>
            <Suspense
              fallback={
                <DataTable columns={columns} data={[]} loading={true} />
              }
            >
              <Table />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

async function Table() {
  const { data: clients, error } = await getAllClients();

  if (error) return <ErrorComponent message={error.message} />;

  const baseUrl = `/clients`;

  return (
    <DataTable columns={columns} data={clients} redirectBaseUrl={baseUrl} />
  );
}
