export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_URL ?? "https://24letters.com";

export const metadataBase = new URL(SITE_ORIGIN);

export function canonicalBlogUrl(slug: string): string {
  return `${SITE_ORIGIN}/blog/${encodeURIComponent(slug)}`;
}
