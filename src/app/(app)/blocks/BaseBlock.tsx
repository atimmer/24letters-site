import { cn } from "@/functions/styling";
import { ReactNode } from "react";

type BaseBlockProps = {
  className?: string;
  children: ReactNode;
};

export default function BaseBlock({
  className = "",
  children,
}: BaseBlockProps) {
  return (
    <section
      className={cn(
        "px-6 py-6 md:text-lg md:leading-8 lg:py-10",
        className,
      )}
    >
      {children}
    </section>
  );
}
