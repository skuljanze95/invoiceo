"use client";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";

interface Props {
  message: string;
}
export function ErrorComponent({ message }: Props) {
  const router = useRouter();
  return (
    <div className="flex w-full flex-col items-center gap-4 p-4">
      <div className="flex flex-col items-center ">
        <p className="text-primary">Ups!... Something went wrong :(</p>
        <p className="text-sm text-muted-foreground">&quot;{message}&quot;</p>
      </div>

      <div className="flex gap-4">
        <Button onClick={() => router.push("/")} size="sm" variant="outline">
          Home
        </Button>
        <Button onClick={() => router.refresh()} size="sm">
          Try again
        </Button>
      </div>
    </div>
  );
}
