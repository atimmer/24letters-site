import Link from "next/link";
import Container from "@/primitives/Container";

export const metadata = {
  title: "Dev Workspace",
  description: "Development-only tools and content playgrounds.",
};

const tools = [
  {
    title: "Uploader",
    summary: "Upload images into /public/images for posts and pages.",
    href: "/dev/uploader",
    meta: "Uses the existing upload form.",
  },
  {
    title: "Blog post playground",
    summary: "Full blog-post layout with headings, quotes, images, and code.",
    href: "/dev/blog-post",
    meta: "Same MDX rendering as production posts.",
  },
  {
    title: "Page playground",
    summary: "Page-style content to test typography and layout components.",
    href: "/dev/page-playground",
    meta: "Built with the same MDX components.",
  },
];

export default function DevWorkspaceIndex() {
  return (
    <Container as="section" className="py-12" padMobile>
      <header className="mb-10 space-y-3">
        <p className="text-brand text-xs font-semibold tracking-widest uppercase">
          Dev index
        </p>
        <h1 className="font-heading text-4xl leading-tight md:text-5xl">
          Pick a workspace tool
        </h1>
        <p className="max-w-2xl text-lg text-neutral-700 dark:text-neutral-200">
          These pages mirror production components so you can iterate on design
          without touching live content.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {tools.map((tool) => (
          <Link
            key={tool.title}
            href={tool.href}
            className="border-border/70 group rounded-2xl border bg-white/80 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-neutral-900/80"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-heading text-2xl leading-snug md:text-3xl">
                  {tool.title}
                </h2>
                <span className="text-brand border-brand/30 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                  Dev
                </span>
              </div>
              <p className="text-base leading-7 text-neutral-800 dark:text-neutral-100">
                {tool.summary}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {tool.meta}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
