"use client";
import React from "react";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";

export function BackButton() {
  const router = useRouter();
  return (
    <Button
      className="h-7 w-7"
      onClick={() => router.back()}
      size="icon"
      variant="outline"
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Back</span>
    </Button>
  );
}
