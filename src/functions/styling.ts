import { clsx } from "clsx/lite";
import { twMerge } from "tailwind-merge";

export function cn(...forms: (string | false)[]) {
  return twMerge(clsx(...forms));
}
