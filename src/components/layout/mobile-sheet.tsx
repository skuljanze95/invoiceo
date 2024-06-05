"use client";
import React from "react";

import { useHelpers } from "@/hooks/useHelpers";
import { Home, PanelLeft, Settings, ShoppingCart, Users2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

export function MobileSheet() {
  const { open, setOpen } = useHelpers();
  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button className="sm:hidden" size="icon" variant="outline">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-xs" side="left">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            href="/"
            onClick={() => setOpen(false)}
          >
            <svg
              className="h-5 w-5 md:h-4 md:w-4"
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
            onClick={() => setOpen(false)}
            title="Dasboard"
          />

          <NavItem
            Icon={() => <ShoppingCart className="h-5 w-5" />}
            href="/invoices"
            onClick={() => setOpen(false)}
            title="Invoices"
          />
          <NavItem
            Icon={() => <Users2 className="h-5 w-5" />}
            href="/clients"
            onClick={() => setOpen(false)}
            title="Clients"
          />
          <NavItem
            Icon={() => <Settings className="h-5 w-5" />}
            href="/settings"
            onClick={() => setOpen(false)}
            title="Settings"
          />
        </nav>
      </SheetContent>
    </Sheet>
  );
}

interface Props {
  Icon: React.FC;
  title: string;
  href: string;
  onClick?: () => void;
}

function NavItem({ Icon, href, onClick, title }: Props) {
  const path = usePathname();
  let isActive = false;

  if (href === "/settings" && path.includes(href)) {
    isActive = true;
  } else {
    isActive = path === href;
  }

  return (
    <Link
      className={cn(
        !isActive && "text-muted-foreground",
        "flex items-center gap-4 px-2.5  hover:text-foreground",
      )}
      href={href}
      onClick={onClick}
    >
      <Icon />
      {title}
    </Link>
  );
}
