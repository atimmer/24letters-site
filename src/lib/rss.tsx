import { CustomMDX } from "@/components/mdx";
import { LeafletContent } from "@/app/blog/leaflet-renderer";
import type { BlogPost } from "@/app/blog/utils";
import { SITE_ORIGIN } from "@/lib/site";
import { parse } from "node-html-parser";
import { renderToReadableStream, renderToStaticMarkup } from "react-dom/server";

export const RSS_REVALIDATE_SECONDS = 300;
export const RSS_CACHE_CONTROL =
  `public, s-maxage=${RSS_REVALIDATE_SECONDS}, stale-while-revalidate=${RSS_REVALIDATE_SECONDS}`;

function escapeCdata(content: string) {
  return content.replaceAll("]]>", "]]]]><![CDATA[>");
}

function escapeXml(content: string): string {
  return content
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

async function renderPostContent(post: BlogPost): Promise<string> {
  if (post.source === "leaflet") {
    return renderToStaticMarkup(
      await LeafletContent({ content: post.content }),
    );
  }

  const stream = await renderToReadableStream(
    await CustomMDX({ source: post.content }),
  );
  await stream.allReady;
  return new Response(stream).text();
}

function makeAbsolute(
  value: string | string[] | null | undefined,
  base: string,
): string | null {
  if (!value) return value ?? null;
  if (Array.isArray(value)) {
    return value.map((item) => makeAbsolute(item, base) ?? "").join(",");
  }
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("//")
  ) {
    return value;
  }

  try {
    return new URL(value, base).toString();
  } catch {
    return value;
  }
}

function absolutifyContent(html: string, slug: string) {
  const root = parse(html);
  const base = `${SITE_ORIGIN}/blog/${slug}`;

  root.querySelectorAll("[href]").forEach((node) => {
    node.setAttribute(
      "href",
      makeAbsolute(node.getAttribute("href"), base) || "",
    );
  });

  root.querySelectorAll("[src]").forEach((node) => {
    node.setAttribute(
      "src",
      makeAbsolute(node.getAttribute("src"), base) || "",
    );
  });

  root.querySelectorAll("[srcset]").forEach((node) => {
    const srcset = node.getAttribute("srcset");
    if (!srcset) return;
    const updated = srcset
      .split(",")
      .map((entry) => {
        const [url, descriptor] = entry.trim().split(/\s+/, 2);
        const absolute = makeAbsolute(url, base);
        return descriptor ? `${absolute} ${descriptor}` : `${absolute}`;
      })
      .join(", ");
    node.setAttribute("srcset", updated);
  });

  return root.innerHTML;
}

export async function buildRssFeed(allBlogs: BlogPost[]): Promise<string> {
  const selfUrl = `${SITE_ORIGIN}/rss`;
  const itemsXml = await Promise.all(
    allBlogs.map(async (post) => {
      const bodyContent = await renderPostContent(post);
      const safeBody = absolutifyContent(bodyContent, post.slug);
      const postUrl = `${SITE_ORIGIN}/blog/${encodeURIComponent(post.slug)}`;

      return `<item>
          <title>${escapeXml(post.metadata.title)}</title>
          <link>${escapeXml(postUrl)}</link>
          <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
          ${
            post.metadata.summary
              ? `<description>${escapeXml(post.metadata.summary)}</description>`
              : ""
          }
          ${
            post.metadata.publishedAt
              ? `<pubDate>${new Date(post.metadata.publishedAt).toUTCString()}</pubDate>`
              : ""
          }
          <content:encoded><![CDATA[${escapeCdata(safeBody)}]]></content:encoded>
        </item>`;
    }),
  );

  return `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>24letters</title>
        <link>${escapeXml(SITE_ORIGIN)}</link>
        <description>RSS feed for the posts on 24letters</description>
        <atom:link href="${escapeXml(selfUrl)}" rel="self" type="application/rss+xml" />
        ${itemsXml.join("\n")}
    </channel>
  </rss>`;
}
