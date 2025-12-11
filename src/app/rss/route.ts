import { baseUrl } from "@/app/sitemap";
import { getBlogPosts } from "@/app/blog/utils";
import { parse } from "node-html-parser";

function escapeCdata(content: string) {
  // Prevent breaking out of the CDATA block while keeping the content intact
  return content.replaceAll("]]>", "]]]]><![CDATA[>");
}

async function fetchPageContent(slug: string) {
  const res = await fetch(`${baseUrl}/blog/${slug}`, {
    // Cache the fetched page for 1 day
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!res.ok) {
    return "";
  }

  return res.text();
}

function extractBodyContent(pageHtml: string) {
  const root = parse(pageHtml);
  const article = root.querySelector("article");
  const prose = root.querySelector(".prose");

  const content = article ?? prose;

  // Fallback to whole body if nothing is found, but prefer the inner HTML of the main content
  if (content) {
    return content.innerHTML;
  }

  const body = root.querySelector("body");
  return body ? body.innerHTML : "";
}

function makeAbsolute(
  value: string | string[] | null | undefined,
  base: string,
): string | null {
  if (!value) return value ?? null;
  if (Array.isArray(value)) {
    return value.map((v) => makeAbsolute(v, base) ?? "").join(",");
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
  const base = `${baseUrl}/blog/${slug}`;

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
        const abs = makeAbsolute(url, base);
        return descriptor ? `${abs} ${descriptor}` : `${abs}`;
      })
      .join(", ");
    node.setAttribute("srcset", updated);
  });

  return root.innerHTML;
}

function escapeBareAmpersands(html: string) {
  return html.replace(
    /&(?!(?:amp;|lt;|gt;|quot;|apos;|#[0-9]+;|#x[0-9a-fA-F]+;))/g,
    "&amp;",
  );
}

export async function GET(request: Request) {
  const allBlogs = await getBlogPosts();
  const selfUrl = new URL(request.url).toString();

  const itemsXml = await Promise.all(
    allBlogs
      .sort((a, b) => {
        if (
          new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
        ) {
          return -1;
        }
        return 1;
      })
      .map(async (post) => {
        const pageHtml = await fetchPageContent(post.slug);
        const bodyContent = extractBodyContent(pageHtml);
        const absoluteBody = absolutifyContent(bodyContent, post.slug);
        const safeBody = escapeBareAmpersands(absoluteBody);

        return `<item>
          <title>${post.metadata.title}</title>
          <link>${baseUrl}/blog/${post.slug}</link>
          <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
          ${
            post.metadata.summary
              ? `<description>${post.metadata.summary}</description>`
              : ""
          }
          <pubDate>${new Date(post.metadata.publishedAt).toUTCString()}</pubDate>
          <content:encoded><![CDATA[${escapeCdata(safeBody)}]]></content:encoded>
        </item>`;
      }),
  );

  const itemsXmlString = itemsXml.join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>24letters</title>
        <link>${baseUrl}</link>
        <description>RSS feed for the posts on 24letters</description>
        <atom:link href="${selfUrl}" rel="self" type="application/rss+xml" />
        ${itemsXmlString}
    </channel>
  </rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "text/xml",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
