import { ReactNode } from "react";
import { cn } from "@/functions/styling";

import React, { ElementType } from "react";

type ContainerProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
};

export default function Container({
  children,
  as: Component = "div",
  className = "",
}: ContainerProps) {
  return (
    <Component className={cn("max-w-7xl lg:mx-auto", className)}>
      {children}
    </Component>
  );
}
