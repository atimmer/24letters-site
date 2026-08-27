import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getLeafletPosts, type BlogPost } from "../utils";
import { PUBLICATION_AT_URI } from "../leaflet";

const mocks = vi.hoisted(() => ({
  getCachedBlogPosts: vi.fn<() => Promise<BlogPost[]>>(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("../utils", async (importOriginal) => {
  const original = await importOriginal<typeof import("../utils")>();
  return { ...original, getCachedBlogPosts: mocks.getCachedBlogPosts };
});

vi.mock("next/navigation", () => ({ notFound: mocks.notFound }));

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // The test observes the final image URL and intrinsic dimensions.
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt ?? ""} {...props} />
  ),
}));

vi.mock("react", async (importOriginal) => {
  const react = await importOriginal<typeof import("react")>();
  return {
    ...react,
    ViewTransition: ({ children }: { children: ReactNode }) => children,
  };
});

import Blog, { generateMetadata, revalidate } from "./page";

const recordKey = "fixture-rkey";
const blobCid = "bafkreifixtureblob";

function leafletPost(title = "Fixture title"): BlogPost {
  return {
    source: "leaflet",
    recordKey,
    slug: "frozen-fixture-slug",
    metadata: {
      title,
      publishedAt: "2026-08-27T11:57:14.284Z",
      summary: "A visible fixture description.",
      image:
        "https://shiitake.us-east.host.bsky.network/xrpc/com.atproto.sync.getBlob?did=did%3Aplc%3Aucgyl53umtlpjplm5vugutbi&cid=cover",
    },
    content: {
      $type: "pub.leaflet.content",
      pages: [
        {
          $type: "pub.leaflet.pages.linearDocument",
          blocks: [
            {
              $type: "pub.leaflet.pages.linearDocument#block",
              block: {
                $type: "pub.leaflet.blocks.text",
                plaintext: "Bold link",
                facets: [
                  {
                    index: { byteStart: 0, byteEnd: 9 },
                    features: [
                      { $type: "pub.leaflet.richtext.facet#bold" },
                      {
                        $type: "pub.leaflet.richtext.facet#link",
                        uri: "https://example.com/article",
                      },
                    ],
                  },
                ],
              },
            },
            {
              $type: "pub.leaflet.pages.linearDocument#block",
              block: { $type: "pub.leaflet.blocks.poll" },
            },
            {
              $type: "pub.leaflet.pages.linearDocument#block",
              block: {
                $type: "pub.leaflet.blocks.text",
                plaintext: "Content after fallback",
              },
            },
            {
              $type: "pub.leaflet.pages.linearDocument#block",
              block: {
                $type: "pub.leaflet.blocks.image",
                image: {
                  $type: "blob",
                  ref: { $link: blobCid },
                  mimeType: "image/webp",
                  size: 1234,
                },
                aspectRatio: { width: 1444, height: 944 },
                alt: "Automation pyramid",
              },
            },
          ],
        },
      ],
    },
  };
}

describe("Leaflet canonical post route", () => {
  beforeEach(() => {
    mocks.getCachedBlogPosts.mockReset();
    mocks.notFound.mockClear();
    mocks.getCachedBlogPosts.mockResolvedValue([leafletPost()]);
  });

  it("uses five-minute ISR and renders rich text, blobs, descriptions, and fallbacks", async () => {
    const html = renderToStaticMarkup(
      await Blog({ params: Promise.resolve({ slug: "frozen-fixture-slug" }) }),
    );

    expect(revalidate).toBe(300);
    expect(html).toContain("A visible fixture description.");
    expect(html).toContain("<strong>Bold link</strong>");
    expect(html).toContain('href="https://example.com/article"');
    expect(html).toContain("Unsupported Leaflet block:");
    expect(html).toContain("pub.leaflet.blocks.poll");
    expect(html).toContain("Content after fallback");
    expect(html).toContain(blobCid);
    expect(html).toContain(
      "shiitake.us-east.host.bsky.network/xrpc/com.atproto.sync.getBlob",
    );
    expect(html).toContain("did=did%3Aplc%3Aucgyl53umtlpjplm5vugutbi");
    expect(html).toContain('alt="Automation pyramid"');
    expect(html).toContain('width="1444"');
    expect(html).toContain('height="944"');
  });

  it("publishes absolute canonical, Open Graph, and structured-data URLs", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "frozen-fixture-slug" }),
    });
    const html = renderToStaticMarkup(
      await Blog({ params: Promise.resolve({ slug: "frozen-fixture-slug" }) }),
    );
    const canonical = "https://24letters.com/blog/frozen-fixture-slug";

    expect(metadata.alternates?.canonical).toBe(canonical);
    expect(metadata.openGraph?.url).toBe(canonical);
    expect(html).toContain(`\"url\":\"${canonical}\"`);
    expect(metadata.description).toBe("A visible fixture description.");
  });

  it("keeps a frozen slug after the source document is retitled", async () => {
    mocks.getCachedBlogPosts.mockResolvedValue([
      leafletPost("Retitled document"),
    ]);

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "frozen-fixture-slug" }),
    });

    expect(metadata.title).toBe("Retitled document");
    expect(metadata.alternates?.canonical).toBe(
      "https://24letters.com/blog/frozen-fixture-slug",
    );
  });

  it("returns not found for an unresolved slug", async () => {
    mocks.getCachedBlogPosts.mockResolvedValue([]);

    await expect(
      Blog({ params: Promise.resolve({ slug: "missing" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(
      generateMetadata({ params: Promise.resolve({ slug: "missing" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("cannot resolve a document from another publication", async () => {
    const posts = await getLeafletPosts(
      async () =>
        Response.json({
          records: [
            {
              uri: "at://did:plc:ucgyl53umtlpjplm5vugutbi/site.standard.document/outside",
              cid: "fixture-outside",
              value: {
                $type: "site.standard.document",
                title: "Outside publication",
                publishedAt: "2026-08-27T11:57:14.284Z",
                site: `${PUBLICATION_AT_URI}-elsewhere`,
              },
            },
          ],
        }),
      async () => "outside-publication",
    );
    mocks.getCachedBlogPosts.mockResolvedValue(posts);

    await expect(
      Blog({ params: Promise.resolve({ slug: "outside-publication" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
