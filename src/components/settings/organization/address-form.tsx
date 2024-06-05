"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";
import { updateOrganization } from "@/lib/actions/organization";
import {
  type OrganizationPartialSchemaType,
  organizationPartialFormSchema,
} from "@/lib/form-schema/organization-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";

interface Props extends OrganizationPartialSchemaType {
  id: string;
}

export function AddressForm({
  city,
  country,
  id,
  state,
  streetAddress,
  zipCode,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: OrganizationPartialSchemaType = {
    city,
    country,
    state,
    streetAddress,
    zipCode,
  };

  const form = useForm<OrganizationPartialSchemaType>({
    defaultValues,
    resolver: zodResolver(organizationPartialFormSchema),
  });

  const onSubmit = async (values: OrganizationPartialSchemaType) => {
    setIsLoading(true);

    const { data, error } = await updateOrganization({ ...values, id });

    if (error) {
      setIsLoading(false);
      return toast({
        description: error.message,
        title: "An error occurred",
      });
    }

    toast({
      title: data.message,
    });

    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Address</CardTitle>
        <CardDescription className="text-secondary-foreground">
          Please enter your organization address, this will be displayed on
          invoices.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            id="address-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Street address"
                      {...field}
                      className="max-w-96"
                      disabled={isLoading}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
              control={form.control}
              name="streetAddress"
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="City"
                      {...field}
                      className="max-w-96"
                      disabled={isLoading}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
              control={form.control}
              name="city"
            />
            <div className="flex max-w-96 flex-col gap-4 md:flex-row ">
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="State"
                        {...field}
                        className="max-w-96"
                        disabled={isLoading}
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
                        className="max-w-96"
                        disabled={isLoading}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="zipCode"
              />
            </div>
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Country"
                      {...field}
                      className="max-w-96"
                      disabled={isLoading}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
              control={form.control}
              name="country"
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex h-14 items-center justify-end border-t px-6 py-0">
        <Button
          className="h-8"
          disabled={isLoading}
          form="address-form"
          size="sm"
          type="submit"
        >
          {isLoading && <Spinner />}
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
