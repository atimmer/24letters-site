import { ReactNode } from "react";
import { cn } from "@/functions/styling";

import React, { ElementType } from "react";

type ContainerProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  padMobile?: boolean;
};

export default function Container({
  children,
  as: Component = "div",
  className = "",
  padMobile = false,
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "max-w-screen-xl lg:mx-auto",
        padMobile && "px-6 xl:px-0",
        className,
      )}
    >
      {children}
    </Component>
  );
}
