import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-DE", {
    currency: "EUR",
    style: "currency",
  }).format(amount);
}

/** Format: 9 Jun 2023 */
export function formatDate(date: Date | string) {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
