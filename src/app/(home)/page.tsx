import { Suspense } from "react";

import { currentUser } from "@clerk/nextjs/server";

import { AddInvoiceButton } from "@/components/invoices/add-invoice-button";
import { columns } from "@/components/invoices/columns";
import { DataTable } from "@/components/shared/data-table";
import { ErrorComponent } from "@/components/shared/error-component";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getAllInvoices,
  getThisMonthDetails,
  getThisWeekDetails,
} from "@/lib/actions/invoice";
import { formatCurrency } from "@/lib/utils";

export default async function Home() {
  const user = await currentUser();

  return (
    <div className="grid flex-1 items-start gap-4  sm:py-0 md:gap-4 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-4 lg:col-span-3">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card className="sm:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>Hello {user?.fullName}</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Overview of your invoices.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <AddInvoiceButton />
            </CardFooter>
          </Card>
          <Details />
        </div>

        <Card
          className=" overflow-x-scroll "
          style={{ scrollbarWidth: "none" }}
        >
          <CardHeader className="px-7">
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Recent invoices.</CardDescription>
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
  const { data: invoices, error } = await getAllInvoices({ limit: 10 });

  if (error) return <ErrorComponent message={error.message} />;

  const baseUrl = "/invoices";

  return (
    <DataTable
      columns={columns}
      data={invoices}
      redirectBaseUrl={baseUrl}
      showSearch={false}
    />
  );
}

async function Details() {
  const { data: month, error: monthError } = await getThisMonthDetails({});
  const { data: week, error: weekError } = await getThisWeekDetails({});

  if (monthError) return <ErrorComponent message={monthError.message} />;
  if (weekError) return <ErrorComponent message={weekError.message} />;

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>This Week</CardDescription>
          <CardTitle className="text-4xl">
            {formatCurrency(week.amount)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            {week.numberOfInvoices} new invoices
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>This Month</CardDescription>
          <CardTitle className="text-4xl">
            {formatCurrency(month.amount)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            {month.numberOfInvoices} new invoices
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </>
  );
}
