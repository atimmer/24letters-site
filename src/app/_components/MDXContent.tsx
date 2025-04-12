"use client";

import { MDXProvider } from "@mdx-js/react";
import { ReactNode, ComponentPropsWithoutRef } from "react";

const components = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1 className="mb-4 text-4xl font-bold" {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="mb-3 text-3xl font-bold" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mb-2 text-2xl font-bold" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="mb-4" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mb-4 list-disc pl-6" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="mb-4 list-decimal pl-6" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="mb-1" {...props} />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code className="rounded-sm bg-gray-100 px-1 py-0.5" {...props} />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre className="mb-4 overflow-x-auto rounded-sm bg-gray-100 p-4" {...props} />
  ),
};

export default function MDXContent({ children }: { children: ReactNode }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}
