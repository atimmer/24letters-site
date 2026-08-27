import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { BlogPostList } from "@/components/posts";
import {
  BLOG_REVALIDATE_SECONDS,
  PUBLICATION_AT_URI,
  type FetchRecords,
  listPublicationDocuments,
} from "./leaflet";
import { getLeafletPosts, sortBlogPosts, type BlogPost } from "./utils";

vi.mock("react", async (importOriginal) => {
  const react = await importOriginal<typeof import("react")>();

  return {
    ...react,
    ViewTransition: ({ children }: { children: ReactNode }) => children,
  };
});

function documentRecord({
  publishedAt = "2026-08-27T11:57:14.284Z",
  recordKey,
  site = PUBLICATION_AT_URI,
  title,
}: {
  publishedAt?: string | null;
  recordKey: string;
  site?: string;
  title: string;
}) {
  return {
    uri: `at://did:plc:ucgyl53umtlpjplm5vugutbi/site.standard.document/${recordKey}`,
    cid: `fixture-${recordKey}`,
    value: {
      $type: "site.standard.document",
      path: `/${recordKey}`,
      site,
      title,
      description: "Fixture summary",
      ...(publishedAt ? { publishedAt } : {}),
      content: {
        $type: "pub.leaflet.content",
        pages: [
          {
            $type: "pub.leaflet.pages.linearDocument",
            id: "fixture-page",
            blocks: [
              {
                $type: "pub.leaflet.pages.linearDocument#block",
                block: {
                  $type: "pub.leaflet.blocks.text",
                  plaintext: "Fixture body",
                },
              },
            ],
          },
        ],
      },
    },
  };
}

describe("Leaflet publication loading", () => {
  it("follows cursor pagination and filters records by publication", async () => {
    const requestedUrls: URL[] = [];
    const requestedRevalidations: number[] = [];
    const fetchRecords: FetchRecords = async (input, init) => {
      const url = new URL(input.toString());
      requestedUrls.push(url);
      requestedRevalidations.push(init?.next?.revalidate ?? 0);

      if (!url.searchParams.has("cursor")) {
        return Response.json({
          cursor: "next-page",
          records: [
            documentRecord({ recordKey: "included", title: "Included" }),
            documentRecord({
              recordKey: "other-site",
              site: "at://did:example/site.standard.publication/elsewhere",
              title: "Excluded",
            }),
          ],
        });
      }

      return Response.json({
        records: [
          documentRecord({ recordKey: "second-page", title: "Second Page" }),
        ],
      });
    };

    const records = await listPublicationDocuments(fetchRecords);

    expect(records.map(({ recordKey }) => recordKey)).toEqual([
      "included",
      "second-page",
    ]);
    expect(requestedUrls).toHaveLength(2);
    expect(requestedUrls[1].searchParams.get("cursor")).toBe("next-page");
    expect(requestedUrls[0].searchParams.get("limit")).toBe("100");
    expect(requestedRevalidations).toEqual([
      BLOG_REVALIDATE_SECONDS,
      BLOG_REVALIDATE_SECONDS,
    ]);
  });

  it("returns an empty publication without assigning slugs", async () => {
    let assignments = 0;
    const posts = await getLeafletPosts(
      async () => Response.json({ records: [] }),
      async () => {
        assignments += 1;
        return "should-not-exist";
      },
    );

    expect(posts).toEqual([]);
    expect(assignments).toBe(0);
    expect(renderToStaticMarkup(<BlogPostList posts={posts} />)).toBe(
      "<div></div>",
    );
  });

  it("normalizes Leaflet records and renders title, date, and frozen link", async () => {
    const posts = await getLeafletPosts(
      async () =>
        Response.json({
          records: [
            documentRecord({
              recordKey: "durable-rkey",
              title: "Live Fixture",
            }),
          ],
        }),
      async (recordKey, title) => {
        expect(recordKey).toBe("durable-rkey");
        expect(title).toBe("Live Fixture");
        return "live-fixture";
      },
    );
    const html = renderToStaticMarkup(<BlogPostList posts={posts} />);

    expect(posts[0]).toMatchObject({
      source: "leaflet",
      recordKey: "durable-rkey",
      slug: "live-fixture",
      metadata: { title: "Live Fixture" },
    });
    expect(html).toContain('href="/blog/live-fixture"');
    expect(html).toContain("Live Fixture");
    expect(html).toContain("August 27, 2026");
  });

  it("sorts merged sources deterministically by date then slug", () => {
    const posts: BlogPost[] = [
      {
        source: "leaflet",
        recordKey: "undated",
        slug: "undated",
        content: {},
        metadata: { title: "Undated" },
      },
      {
        source: "mdx",
        slug: "z-on-tie",
        content: "",
        metadata: { title: "Z", publishedAt: "2026-01-01" },
      },
      {
        source: "leaflet",
        recordKey: "newest",
        slug: "newest",
        content: {},
        metadata: { title: "Newest", publishedAt: "2026-02-01" },
      },
      {
        source: "mdx",
        slug: "a-on-tie",
        content: "",
        metadata: { title: "A", publishedAt: "2026-01-01" },
      },
    ];

    expect(sortBlogPosts(posts).map(({ slug }) => slug)).toEqual([
      "newest",
      "a-on-tie",
      "z-on-tie",
      "undated",
    ]);
  });
});
