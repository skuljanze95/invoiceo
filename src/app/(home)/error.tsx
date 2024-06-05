"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
      <div className="flex flex-col items-center ">
        <p className="text-primary">Ups!... Something went wrong :(</p>
        <p className="text-sm text-muted-foreground">
          &quot;{error.message}&quot;
        </p>
      </div>

      <div className="flex gap-4">
        <Button onClick={() => router.push("/")} size="sm" variant="outline">
          Home
        </Button>
        <Button onClick={() => reset()} size="sm">
          Try again
        </Button>
      </div>
    </div>
  );
}
