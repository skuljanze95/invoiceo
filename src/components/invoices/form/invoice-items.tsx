import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import Big from "big.js";
import { X } from "lucide-react";
import Papa from "papaparse";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
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

  const { append, fields, remove, replace } = useFieldArray({
    control: control,
    name: "items",
  });

  const [showBulkInput, setShowBulkInput] = useState(false);
  const [bulkCSV, setBulkCSV] = useState("");
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [deduplicate, setDeduplicate] = useState(false);

  function parseAndAppendBulkItems(csv: string) {
    setBulkError(null);
    if (!csv.trim()) {
      setBulkError("CSV input is empty.");
      return;
    }

    const result = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
    });

    if (result.errors.length > 0 && result.errors[0]) {
      setBulkError(result.errors[0].message);
      return;
    }

    const rows = result.data as Record<string, string>[];
    let items: {
      title: string;
      unitPrice: number;
      quantity: number;
      tax: number;
    }[] = [];

    const parseRow = (row: Record<string, string>) => {
      const title = row.Description?.trim();
      const unitPrice = parseFloat(row["Unit Price"] ?? "");
      const quantity = parseFloat(row.Quantity ?? "");
      const tax = parseFloat(row.Tax ?? "");
      if (!title || isNaN(unitPrice) || isNaN(quantity) || isNaN(tax)) {
        setBulkError(`Invalid row: ${JSON.stringify(row)}`);
        return null;
      }
      return { quantity, tax, title, unitPrice };
    };

    if (deduplicate) {
      // Deduplicate by description, summing quantities
      const itemsMap = new Map<
        string,
        { title: string; unitPrice: number; quantity: number; tax: number }
      >();

      for (const row of rows) {
        const parsed = parseRow(row);

        if (!parsed) return;

        const { quantity, tax, title, unitPrice } = parsed;

        if (itemsMap.has(title)) {
          const prev = itemsMap.get(title)!;
          // Use Big.js only for summing
          const newQuantity = new Big(prev.quantity).plus(quantity);
          itemsMap.set(title, {
            ...prev,
            quantity: Number(newQuantity.toString()),
          });
        } else {
          itemsMap.set(title, { quantity, tax, title, unitPrice });
        }
      }

      items = Array.from(itemsMap.values());
    } else {
      for (const row of rows) {
        const parsed = parseRow(row);
        if (!parsed) return;
        items.push(parsed);
      }
    }
    if (!items.length) {
      setBulkError("No valid items found in CSV.");
      return;
    }
    replace(items);
    setShowBulkInput(false);
    setBulkCSV("");
    setBulkError(null);
    void handleSubmit();
  }

  const getItemTotal = (index: number) => {
    if (!invoice.items?.length) return formatCurrency(0);
    const item = invoice.items[index];
    // Only use Big.js if quantity, unitPrice, or tax are floats
    if (
      !Number.isInteger(item?.quantity) ||
      !Number.isInteger(item?.unitPrice) ||
      !Number.isInteger(item?.tax)
    ) {
      const quantity = new Big(item?.quantity ?? 0);
      const unitPrice = new Big(item?.unitPrice ?? 0);
      const tax = new Big(item?.tax ?? 0);
      const itemTotal = quantity
        .times(unitPrice)
        .times(Big(1).plus(tax.div(100)));
      return formatCurrency(Number(itemTotal.toFixed(2)));
    } else {
      const quantity = item?.quantity ?? 0;
      const unitPrice = item?.unitPrice ?? 0;
      const tax = item?.tax ?? 0;
      const itemTotal = quantity * unitPrice * (1 + tax / 100);
      return formatCurrency(itemTotal);
    }
  };

  const getTotal = () => {
    if (!invoice.items?.length) return formatCurrency(0);

    // Use Big.js only if any item has a float value
    const hasFloat = invoice.items.some(
      (item) =>
        !Number.isInteger(item.quantity) ||
        !Number.isInteger(item.unitPrice) ||
        !Number.isInteger(item.tax),
    );

    if (hasFloat) {
      const total = invoice.items.reduce((acc: Big, item) => {
        const quantity = new Big(item.quantity ?? 0);
        const unitPrice = new Big(item.unitPrice ?? 0);
        const tax = new Big(item.tax ?? 0);
        const itemTotal = quantity
          .times(unitPrice)
          .times(Big(1).plus(tax.div(100)));
        return acc.plus(itemTotal);
      }, new Big(0));

      return formatCurrency(Number(total.toFixed(2)));
    } else {
      const total = invoice.items.reduce((acc: number, item) => {
        const itemTotal =
          (item.quantity ?? 0) *
          (item.unitPrice ?? 0) *
          (1 + (item.tax ?? 0) / 100);
        return acc + itemTotal;
      }, 0);

      return formatCurrency(total);
    }
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Invoice items</CardTitle>
        <Button
          onClick={() => {
            setShowBulkInput((v) => !v);
            setBulkError(null);
            setBulkCSV("");
          }}
          className="ml-auto"
          size="sm"
          type="button"
          variant="ghost"
        >
          {!showBulkInput ? "Bulk CSV entry" : "Manual entry"}
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {!showBulkInput ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="whitespace-nowrap">
                    Unit Price
                  </TableHead>
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
                                step="any"
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
                                step="any"
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
                                step="any"
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
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  append({
                    quantity: 0,
                    tax: 0,
                    title: "",
                    unitPrice: 0,
                  });
                }}
                className="my-2"
                type="button"
                variant="outline"
              >
                Add item
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <Textarea
              placeholder={
                'Description,Unit Price,Quantity,Tax\n"Landing page, design & build",1000,1,5\n"SEO optimization for blog",500,1,0'
              }
              className="min-h-24 w-full font-mono"
              cols={70}
              onChange={(e) => setBulkCSV(e.target.value)}
              value={bulkCSV}
            />

            <div className="flex items-center gap-2">
              <Checkbox
                checked={deduplicate}
                id="deduplicate-checkbox"
                onCheckedChange={(checked) => setDeduplicate(!!checked)}
              />
              <label
                className="cursor-pointer select-none text-sm"
                htmlFor="deduplicate-checkbox"
              >
                Combine items with identical descriptions
              </label>
            </div>

            <Button
              onClick={() => parseAndAppendBulkItems(bulkCSV)}
              type="button"
              variant="default"
            >
              Add items
            </Button>

            {bulkError && <p className="text-sm text-red-500">{bulkError}</p>}
          </div>
        )}

        {errors.items?.message && (
          <p className="text-sm text-red-500">{errors.items?.message}</p>
        )}
      </CardContent>
    </Card>
  );
}
