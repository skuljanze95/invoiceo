"use client";

import { Fragment } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

export default function Breadcrumbs() {
  const path = usePathname().split("/").filter(Boolean);

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {path.length === 0 && <BreadcrumbPage>Dashboard</BreadcrumbPage>}
        {path.length > 0 && (
          <>
            <BreadcrumbLink asChild>
              <Link href={"/"}>Dashboard</Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator />
          </>
        )}

        {path.map((item, index) => {
          if (index === path.length - 1) {
            return (
              <BreadcrumbPage className="capitalize" key={index}>
                {item}
              </BreadcrumbPage>
            );
          }
          return (
            <Fragment key={index}>
              <BreadcrumbLink asChild>
                <Link className="capitalize" href={"/" + item} key={index}>
                  {item}
                </Link>
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
