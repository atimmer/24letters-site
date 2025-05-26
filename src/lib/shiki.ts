import { Highlighter, createHighlighter } from "shiki";

let highlighter: Highlighter | null = null;

export async function getShikiHighlighter() {
  if (highlighter) return highlighter;

  highlighter = await createHighlighter({
    themes: ["github-dark"],
    langs: [
      "javascript",
      "typescript",
      "jsx",
      "tsx",
      "html",
      "css",
      "json",
      "bash",
      "markdown",
      "mdx",
      "php",
      "yaml",
      "diff",
      "shell",
      "dockerfile",
    ],
  });

  return highlighter;
}

export async function highlight(code: string, lang: string) {
  const highlighter = await getShikiHighlighter();
  if (!highlighter) throw new Error("Highlighter not initialized");
  // Trim trailing newlines from the code
  const trimmedCode = code.replace(/\n+$/, "");
  return highlighter.codeToHtml(trimmedCode, { lang, theme: "github-dark" });
}
