import { ReactNode } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Toaster } from "sonner";
import Container from "@/primitives/Container";

const devLinks = [
  { href: "/dev", label: "Index" },
  { href: "/dev/uploader", label: "Uploader" },
  { href: "/dev/blog-post", label: "Blog post" },
  { href: "/dev/page-playground", label: "Page playground" },
];

type DevLayoutProps = {
  children: ReactNode;
};

export default function DevLayout({ children }: DevLayoutProps) {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <>
      <div className="border-border/60 bg-muted/30 border-b">
        <Container
          className="flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between"
          padMobile
        >
          <div className="space-y-2">
            <p className="text-brand text-xs font-semibold tracking-widest uppercase">
              Dev workspace
            </p>
            <p className="font-heading text-2xl leading-tight">
              Design workshop and tools
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Development-only. Use this area to shape content styles and UI.
            </p>
          </div>
          <nav className="flex flex-wrap gap-2">
            {devLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-border/70 hover:border-brand/60 hover:text-brand rounded-full border bg-white/70 px-4 py-2 text-sm font-semibold text-neutral-700 transition dark:bg-neutral-900/80 dark:text-neutral-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </Container>
      </div>
      {children}
      <Toaster />
    </>
  );
}
