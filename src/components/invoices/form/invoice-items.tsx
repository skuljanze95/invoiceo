import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type InvoiceFormType } from "@/lib/form-schema/invoice-form";
import { formatCurrency } from "@/lib/utils";

interface Props {
  invoice: InvoiceFormType;
  handleSubmit: () => void;
}

export function InvoiceItems({ handleSubmit, invoice }: Props) {
  const {
    control,
    formState: { errors },
  } = useFormContext<InvoiceFormType>();

  const { append, fields, remove } = useFieldArray({
    control: control,
    name: "items",
  });

  const getItemTotal = (index: number) => {
    if (!invoice.items?.length) return formatCurrency(0);

    const item = invoice.items[index];

    const quantity = item?.quantity ?? 0;
    const unitPrice = item?.unitPrice ?? 0;
    const tax = item?.tax ?? 0;

    const itemTotal = quantity * unitPrice * (1 + tax / 100);
    return formatCurrency(itemTotal);
  };

  const getTotal = () => {
    if (!invoice.items?.length) return formatCurrency(0);

    const total = invoice.items.reduce((acc, item) => {
      const itemTotal = item.quantity * item.unitPrice * (1 + item.tax / 100);
      return acc + itemTotal;
    }, 0);

    return formatCurrency(total);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead className="whitespace-nowrap">Unit Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Tax</TableHead>
            <TableHead>Total</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field, index) => (
            <TableRow key={field.id}>
              <TableCell>
                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="w-full min-w-36"
                          {...field}
                          onBlur={handleSubmit}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  control={control}
                  name={`items.${index}.title`}
                />
              </TableCell>
              <TableCell>
                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="w-full min-w-24"
                          type="number"
                          {...field}
                          min="0"
                          onBlur={handleSubmit}
                          value={field.value ?? 0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  control={control}
                  name={`items.${index}.unitPrice`}
                />
              </TableCell>
              <TableCell>
                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="w-full min-w-16"
                          min="0"
                          type="number"
                          {...field}
                          onBlur={handleSubmit}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  control={control}
                  name={`items.${index}.quantity`}
                />
              </TableCell>
              <TableCell>
                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="w-full min-w-16"
                          min="0"
                          type="number"
                          {...field}
                          onBlur={handleSubmit}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  control={control}
                  name={`items.${index}.tax`}
                />
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  <FormControl>
                    <div className="flex h-8 w-full items-center">
                      <p className="text-sm">{getItemTotal(index)}</p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </div>
              </TableCell>
              <TableCell>
                <Button
                  onClick={async () => {
                    remove(index);
                    void handleSubmit();
                  }}
                  className="h-8 p-2"
                  type="button"
                  variant={"link"}
                >
                  <X className="h-4 w-4 text-primary" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell colSpan={2}>{getTotal()}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <Button
        onClick={() => {
          append({
            quantity: 0,
            tax: 0,
            title: "",
            unitPrice: 0,
          });
        }}
        className="m-2"
        type="button"
        variant="outline"
      >
        Add item
      </Button>
      {errors.items?.message && (
        <p className="text-sm text-red-500">{errors.items?.message}</p>
      )}
    </>
  );
}
