import Container from "@/primitives/Container";
import { CustomMDX } from "@/components/mdx";

const pageContent = [
  "## Overview",
  "This page is for testing how **page content** behaves outside the blog. It uses",
  "identical MDX components so headings, quotes, and images behave consistently.",
  "",
  '> "Design systems are promises, not files." - someone you respect',
  "",
  "### What should stand out",
  "- Clear section hierarchy.",
  "- Plenty of breathing room.",
  "- Reusable components that still feel human.",
  "",
  "### Supporting imagery",
  "![Exact Online Period Selector](/images/Exact%20Online%20Period%20Selector.png)",
  "",
  "## Principles",
  "",
  "### 1. Make the problem visible",
  "Write plainly. Avoid euphemisms. Put the real constraint in the first sentence.",
  "",
  "### 2. Keep the reader oriented",
  "Use short paragraphs and intentional headings. If a section needs a preface,",
  "add a single sentence and move on.",
  "",
  "### 3. Show the artifact",
  "![Google Calendar Defaults](/images/Google%20Calendar%20Defaults.png)",
  "",
  "### A small quote block",
  '> "If the reader has to re-read a sentence, the interface is already late."',
  "",
  "#### Micro-details",
  'Inline code should look calm and precise, like `const texture = "subtle";` in a note or spec.',
  "",
  "### Final section",
  "This is a long-form layout check. If it feels easy to skim, the typography is",
  "working.",
].join("\n");

export const metadata = {
  title: "Dev Page Playground",
  description: "Page-style content playground for typography and MDX styles.",
};

export default function DevPagePlayground() {
  return (
    <Container as="section" className="py-12" padMobile>
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-8 space-y-2">
          <p className="text-brand text-xs font-semibold tracking-widest uppercase">
            Page playground
          </p>
          <h1 className="font-heading text-4xl leading-tight">
            A long-form page for typography checks
          </h1>
          <p className="text-lg text-neutral-700 dark:text-neutral-200">
            Use this to tune headings, spacing, and image rhythm for non-blog
            content.
          </p>
        </header>
        <article className="prose">
          <CustomMDX source={pageContent} />
        </article>
      </div>
    </Container>
  );
}
