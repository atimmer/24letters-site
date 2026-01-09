import { ReactNode } from "react";
import { cn } from "@/functions/styling";

import React, { ElementType } from "react";

type ContainerProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
};

export default function BaseBlockHeading({
  children,
  as: Component = "h2",
  className = "",
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "font-heading text-4xl leading-tight tracking-tight md:text-6xl",
        className,
      )}
    >
      {children}
    </Component>
  );
}
