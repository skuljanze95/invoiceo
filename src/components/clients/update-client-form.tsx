"use client";

import { useForm } from "react-hook-form";

import { useHelpers } from "@/hooks/useHelpers";
import { zodResolver } from "@hookform/resolvers/zod";

import { updateClient } from "@/lib/actions/client";
import {
  type ClientFormType,
  clientFormSchema,
} from "@/lib/form-schema/client-form";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/use-toast";

interface Props {
  service: ClientFormType;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function UpdateClientForm({ open, service, setOpen }: Props) {
  const { loading, setLoading } = useHelpers();

  const form = useForm<ClientFormType>({
    defaultValues: { ...service },
    resolver: zodResolver(clientFormSchema),
  });

  const onSubmit = async (values: ClientFormType) => {
    setLoading(true);

    const { data, error } = await updateClient(values);

    if (error) {
      setLoading(false);
      return toast({
        description: error.message,
        title: "An error occurred",
      });
    }

    toast({
      title: data.message,
    });

    setOpen(false);
    setLoading(false);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className="max-h-[90%] w-[500px] max-w-[90%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update client</DialogTitle>
          <DialogDescription>Edit information below.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex-1 space-y-4 pt-4"
            id="add-client-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-9 border-b pb-4">
              <div className="col-span-3">
                <FormLabel>Client</FormLabel>
              </div>
              <div className="col-span-6 space-y-4 ">
                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Name"
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  control={form.control}
                  name="name"
                />
                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Description"
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                  control={form.control}
                  name="clientDescription"
                />
              </div>
            </div>

            <div className="grid grid-cols-9  border-b pb-4   ">
              <div className="col-span-3">
                <FormLabel>Email address</FormLabel>
                <p className="text-xs text-muted-foreground">
                  Invoices will be sent to this email address.
                </p>
              </div>
              <div className="col-span-6 space-y-4 ">
                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Email"
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  control={form.control}
                  name="billingEmail"
                />
              </div>
            </div>

            <div className="grid grid-cols-9  border-b pb-4 ">
              <div className="col-span-3">
                <FormLabel>Contact</FormLabel>
                <p className="text-xs text-muted-foreground">
                  Contact information{" "}
                </p>
              </div>
              <div className="col-span-6 space-y-4 ">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="First name"
                            {...field}
                            disabled={loading}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                    control={form.control}
                    name="contactFirstName"
                  />
                  <FormField
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Last name"
                            {...field}
                            disabled={loading}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                    control={form.control}
                    name="contactLastName"
                  />
                </div>
                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Email"
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                  control={form.control}
                  name="contactEmail"
                />
              </div>
            </div>

            <div className="grid grid-cols-9  border-b pb-4   ">
              <div className="col-span-3">
                <FormLabel>Street address</FormLabel>
              </div>
              <div className="col-span-6 space-y-4 ">
                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Street address"
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  control={form.control}
                  name="streetAddress"
                />
              </div>
            </div>

            <div className="grid grid-cols-9  border-b pb-4   ">
              <div className="col-span-3">
                <FormLabel>City</FormLabel>
              </div>
              <div className="col-span-6 space-y-4 ">
                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="City"
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  control={form.control}
                  name="city"
                />
              </div>
            </div>

            <div className="grid grid-cols-9  border-b pb-4   ">
              <div className="col-span-3">
                <FormLabel>State / Zip code</FormLabel>
              </div>
              <div className="col-span-6 space-y-4 ">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="State"
                            {...field}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                    control={form.control}
                    name="state"
                  />
                  <FormField
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Zip code"
                            {...field}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                    control={form.control}
                    name="zipCode"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-9  border-b pb-4   ">
              <div className="col-span-3">
                <FormLabel>Country</FormLabel>
              </div>
              <div className="col-span-6 space-y-4 ">
                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Country"
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  control={form.control}
                  name="country"
                />
              </div>
            </div>
            <div className="grid grid-cols-9   pb-4 ">
              <div className="col-span-3">
                <FormLabel>VAT Number</FormLabel>
              </div>
              <div className="col-span-6 space-y-4 ">
                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="VAT  Number"
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  control={form.control}
                  name="vatNumber"
                />
              </div>
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button disabled={loading} form="add-client-form" type="submit">
            {loading && <Spinner />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
