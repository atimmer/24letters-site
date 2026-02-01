import Container from "@/primitives/Container";
import { CustomMDX } from "@/components/mdx";
import { formatDate } from "@/app/(app)/blog/utils";

const blogPostContent = [
  "## The question I started with",
  "A good blog post can mix narrative with detail. This one is a deliberate stress",
  "case: **bold**, _italic_, and a link to the [Tools page](/tools) all in one",
  "paragraph so you can judge rhythm and contrast.",
  "",
  '> "Clarity is a design choice. It is never an accident."',
  "",
  "### A short checklist",
  "- Lead with the insight, not the background.",
  "- Use images to carry weight, not decoration.",
  "- Keep each section answerable on its own.",
  "",
  "### An image with context",
  "![Exact Online Quarter Selector](/images/Exact%20Online%20Quarter%20Selector.png)",
  "",
  "The caption above is just body text. The rounded image treatment comes from the",
  "same MDX component that production posts use.",
  "",
  "### A tiny comparison table",
  "| Decision | Why it matters | Result |",
  "| --- | --- | --- |",
  "| Fewer headings | Less scanning | More focus |",
  "| Shorter paragraphs | Faster reading | Higher retention |",
  "| Real screenshots | Trust signal | Better comprehension |",
  "",
  "### Code worth skimming",
  "",
  "The tiny snippet below should render with the same syntax highlighting as the",
  "blog.",
  "",
  "```ts",
  "type Decision = {",
  "  title: string;",
  '  signal: "trust" | "clarity" | "flow";',
  "};",
  "",
  "const decisions: Decision[] = [",
  '  { title: "Lead with the point", signal: "clarity" },',
  '  { title: "Show real artifacts", signal: "trust" },',
  "];",
  "```",
  "",
  "### Another image for layout",
  "![Sketched paths](/images/Sketched%20paths.png)",
  "",
  "### Closing thought",
  "Good posts invite the reader to skim, stop, and return. The typography should",
  "make that feel effortless.",
].join("\n");

export const metadata = {
  title: "Dev Blog Post",
  description: "Blog post playground for typography and MDX components.",
};

export default function DevBlogPostPage() {
  return (
    <Container as="section" className="py-12" padMobile>
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="title text-2xl font-semibold tracking-tighter">
          The anatomy of a thoughtful post
        </h1>
        <div className="mt-2 mb-8 flex items-center justify-between text-sm">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {formatDate("2026-01-15")}
          </p>
        </div>
        <article className="prose">
          <CustomMDX source={blogPostContent} />
        </article>
      </div>
    </Container>
  );
}
