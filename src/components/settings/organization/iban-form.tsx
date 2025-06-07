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
  organizationPartialFormSchema,
  type OrganizationPartialSchemaType,
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

export function IbanForm({ bankIban, id }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: OrganizationPartialSchemaType = {
    bankIban,
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
        <CardTitle className="text-lg">IBAN number</CardTitle>
        <CardDescription className="text-secondary-foreground">
          Please enter your bank IBAN number if applicable.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form id="vat-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      className="max-w-96"
                      disabled={isLoading}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
              control={form.control}
              name="bankIban"
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex h-14 items-center justify-end border-t px-6 py-0">
        <Button
          className="h-8"
          disabled={isLoading}
          form="vat-form"
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
