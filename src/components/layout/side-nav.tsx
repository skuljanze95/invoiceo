"use client";
import React from "react";

import { File, Home, Settings, Users2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export function SideNav() {
  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 py-4">
          <Link
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            href="/"
          >
            <svg
              className="h-5 w-5 transition-transform group-hover:scale-[1.1] md:h-4 md:w-4"
              fill="none"
              height="342"
              viewBox="0 0 94 342"
              width="94"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M94 0.0373535L93.9626 0H94V0.0373535ZM94 52.213L0 146.213V342H94V52.213ZM0 93.9626V0H93.9626L0 93.9626Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>

            <span className="sr-only">Invoiceo</span>
          </Link>

          <NavItem
            Icon={() => <Home className="h-5 w-5" />}
            href="/"
            title="Dashboard"
          />
          <NavItem
            Icon={() => <File className="h-5 w-5" />}
            href="/invoices"
            title="Invoices"
          />
          <NavItem
            Icon={() => <Users2 className="h-5 w-5" />}
            href="/clients"
            title="Clients"
          />
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
          <NavItem
            Icon={() => <Settings className="h-5 w-5" />}
            href="/settings"
            title="Settings"
          />
        </nav>
      </aside>
    </TooltipProvider>
  );
}

interface Props {
  Icon: React.FC;
  title: string;
  href: string;
}

function NavItem({ Icon, href, title }: Props) {
  const path = usePathname();
  let isActive = false;

  if (href === "/settings" && path.includes(href)) {
    isActive = true;
  } else if (href === "/invoices" && path.includes(href)) {
    isActive = true;
  } else if (href === "/clients" && path.includes(href)) {
    isActive = true;
  } else {
    isActive = path === href;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          className={cn(
            !isActive && "text-muted-foreground",
            isActive && "bg-foreground/10",
            "flex h-9 w-9 items-center  justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8",
          )}
          href={href}
        >
          <Icon />
          <span className="sr-only">{title}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{title}</TooltipContent>
    </Tooltip>
  );
}
