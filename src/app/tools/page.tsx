import Container from "@/primitives/Container";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

export const metadata = {
  title: "Tools",
  description: "Handy little tools I built to solve real problems.",
};

const tools = [
  {
    name: "4Daagse Tijden",
    url: "https://4daagse-tijden.24letters.com/",
    summary:
      "Shows spectators of the Nijmegen 4Days Marches the approximate time someone walking the marches will pass their location.",
    why: "I built it after finding it hard to calculate these times by hand while planning my day.",
    image: "/tools/4daagse.png",
    imageWidth: 1018,
    imageHeight: 732,
  },
  {
    name: "Omniconverter",
    url: "https://omniconverter.dev/",
    summary:
      "Textbox that can convert anything text-based. It might not include every text conversion possible yet, but I'm adding new ones constantly.",
    why: "The key insight is that the UI should just be a textbox. Computers are smart. They should figure out how you want to convert your input.",
    image: "/tools/omniconverter.png",
    imageWidth: 782,
    imageHeight: 533,
  },
];

export default function ToolsPage() {
  return (
    <Container as="section" className="py-12" padMobile>
      <header className="mb-10 space-y-3">
        <h1 className="text-brand text-sm font-semibold tracking-[0.2em] uppercase">
          Tools
        </h1>
        <p className="font-heading text-4xl leading-tight md:text-5xl">
          Useful things I&apos;ve built
        </p>
        <p className="max-w-3xl text-lg text-neutral-700 dark:text-neutral-200">
          The ideas for these came from my own needs. If they solve a problem
          for you too, I would love to hear from you!
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        {tools.map((tool) => (
          <article
            key={tool.name}
            className="border-border/70 group rounded-2xl border bg-white/80 p-6 shadow-sm transition hover:shadow-md dark:bg-neutral-900/80"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h2 className="font-heading text-2xl leading-snug md:text-3xl">
                  {tool.name}
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {new URL(tool.url).host}
                </p>
              </div>
              <Link
                href={tool.url}
                target="_blank"
                rel="noreferrer"
                className="bg-brand hover:bg-brand/90 group-hover:animate-wiggle flex items-center gap-4 rounded-full px-6 py-2 font-semibold text-white"
                aria-label={`Visit ${tool.name}`}
              >
                Visit <ExternalLink className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-4 space-y-3 text-base leading-7 text-neutral-800 dark:text-neutral-100">
              <p>{tool.summary}</p>
              <p className="text-neutral-700 dark:text-neutral-300">
                <span className="font-semibold text-neutral-900 dark:text-white">
                  Why I built it:
                </span>{" "}
                {tool.why}
              </p>
            </div>

            {tool.image && (
              <figure className="border-border/60 mt-5 overflow-hidden rounded-xl border bg-neutral-50 dark:bg-neutral-950">
                <Image
                  src={tool.image}
                  alt={`${tool.name} screenshot`}
                  width={tool.imageWidth}
                  height={tool.imageHeight}
                  className="w-full object-cover"
                  priority
                />
              </figure>
            )}
          </article>
        ))}
      </div>
    </Container>
  );
}
