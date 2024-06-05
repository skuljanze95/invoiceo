import { ListFilter } from "lucide-react";
import Link from "next/link";

import { type InvoiceFilterType } from "@/lib/actions/invoice";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface Props {
  baseUrl: string;
  filter?: InvoiceFilterType;
}

export function FilterDropdown({ baseUrl, filter }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-7 gap-1" size="sm" variant="outline">
          <ListFilter className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Filter
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={baseUrl}>
          <DropdownMenuCheckboxItem
            checked={!filter}
            className="cursor-pointer"
          >
            All
          </DropdownMenuCheckboxItem>
        </Link>
        <Link href={baseUrl + "?filter=pending"}>
          <DropdownMenuCheckboxItem
            checked={filter === "pending"}
            className="cursor-pointer"
          >
            Pending
          </DropdownMenuCheckboxItem>
        </Link>
        <Link href={baseUrl + "?filter=paid"}>
          <DropdownMenuCheckboxItem
            checked={filter === "paid"}
            className="cursor-pointer"
          >
            Paid
          </DropdownMenuCheckboxItem>
        </Link>
        <Link href={baseUrl + "?filter=overdue"}>
          <DropdownMenuCheckboxItem
            checked={filter === "overdue"}
            className="cursor-pointer"
          >
            Overdue
          </DropdownMenuCheckboxItem>
        </Link>
        <Link href={baseUrl + "?filter=draft"}>
          <DropdownMenuCheckboxItem
            checked={filter === "draft"}
            className="cursor-pointer"
          >
            Draft
          </DropdownMenuCheckboxItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
