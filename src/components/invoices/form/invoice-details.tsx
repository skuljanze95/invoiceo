import { useFormContext } from "react-hook-form";

import { useHelpers } from "@/hooks/useHelpers";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { addDays, format } from "date-fns";
import { CalendarIcon, CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { type InsertClientType } from "@/lib/db/schema/client";
import { type InvoiceFormType } from "@/lib/form-schema/invoice-form";
import { cn } from "@/lib/utils";

interface Props {
  clients: InsertClientType[];
  handleSubmit: () => void;
}

export function InvoceDetails({ clients, handleSubmit }: Props) {
  const { control } = useFormContext<InvoiceFormType>();

  const { open, setOpen } = useHelpers();
  const { open: openDueDate, setOpen: setOpenDueDate } = useHelpers();

  return (
    <>
      <FormField
        render={({ field }) => {
          return (
            <FormItem className="flex flex-col gap-1">
              <FormLabel>Client</FormLabel>
              <FormControl>
                <Popover onOpenChange={setOpen} open={open}>
                  <PopoverTrigger asChild>
                    <Button
                      aria-expanded={open}
                      className="justify-between"
                      role="combobox"
                      variant="outline"
                    >
                      {field.value?.name ?? "Select a client"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        className="h-9"
                        placeholder="Search for clients..."
                      />
                      <CommandEmpty>No clients</CommandEmpty>
                      <CommandGroup>
                        {clients?.map((client) => (
                          <CommandItem
                            onSelect={async () => {
                              setOpen(false);
                              field.onChange(client);
                              void handleSubmit();
                            }}
                            key={client.id}
                            value={client.id}
                          >
                            {client.name}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                field.value?.id === client.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
        control={control}
        name="client"
      />
      <FormField
        render={({ field }) => (
          <FormItem>
            <FormLabel>Invoice ID</FormLabel>
            <FormControl>
              <Input
                {...field}
                onBlur={handleSubmit}
                value={field.value === "New Draft" ? "" : field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
        control={control}
        name="invoiceId"
      />
      <FormField
        render={({ field }) => (
          <FormItem>
            <FormLabel>Reference</FormLabel>
            <FormControl>
              <Input
                {...field}
                onBlur={handleSubmit}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
        control={control}
        name="reference"
      />
      <FormField
        render={({ field }) => (
          <FormItem>
            <FormLabel>Details</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                onBlur={handleSubmit}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
        control={control}
        name="invoiceDetails"
      />
      <FormField
        render={({ field }) => (
          <FormItem>
            <FormLabel>Terms and conditions</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                onBlur={handleSubmit}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
        control={control}
        name="termsAndConditions"
      />
      <FormField
        render={({ field }) => (
          <FormItem className="flex flex-col gap-1">
            <FormLabel>Due date</FormLabel>
            <FormControl>
              <Popover onOpenChange={setOpenDueDate} open={openDueDate}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      className={cn(!field.value && "text-muted-foreground")}
                      variant={"outline"}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="flex w-auto flex-col space-y-2 p-2"
                >
                  <Select
                    onValueChange={async (value) => {
                      field.onChange(addDays(new Date(), parseInt(value)));

                      setOpenDueDate(false);
                      void handleSubmit();
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="0">Today</SelectItem>
                      <SelectItem value="7">in 7 days</SelectItem>
                      <SelectItem value="30">In 30 days</SelectItem>
                      <SelectItem value="60">In 60 days</SelectItem>
                    </SelectContent>
                  </Select>
                  <Calendar
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    onSelect={async (value) => {
                      field.onChange(value);
                      setOpenDueDate(false);
                      void handleSubmit();
                    }}
                    mode="single"
                    selected={field.value ?? undefined}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
        control={control}
        name="dueDate"
      />
    </>
  );
}
