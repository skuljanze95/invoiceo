import type { ComponentProps } from "react";

import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = ComponentProps<typeof Loader2Icon>;

export const Spinner = ({ className, ...props }: Props) => {
  return (
    <Loader2Icon className={cn("h-4 w-4 animate-spin", className)} {...props} />
  );
};
