import { beforeEach, describe, expect, it, vi } from "vitest";
import { getLeafletPosts, type BlogPost } from "@/app/blog/utils";
import { PUBLICATION_AT_URI } from "@/app/blog/leaflet";

const mocks = vi.hoisted(() => ({
  getCachedBlogPosts: vi.fn<() => Promise<BlogPost[]>>(),
}));

vi.mock("@/app/blog/utils", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/app/blog/utils")>();
  return { ...original, getCachedBlogPosts: mocks.getCachedBlogPosts };
});

import sitemap, { revalidate } from "./sitemap";

describe("sitemap", () => {
  beforeEach(() => {
    mocks.getCachedBlogPosts.mockReset();
    mocks.getCachedBlogPosts.mockResolvedValue([
      {
        source: "mdx",
        slug: "legacy-post",
        content: "",
        metadata: {
          title: "Legacy post",
          publishedAt: "2025-01-02",
        },
      },
      {
        source: "leaflet",
        recordKey: "published-rkey",
        slug: "published-leaflet-post",
        content: {},
        metadata: {
          title: "Published Leaflet post",
          publishedAt: "2026-08-20T10:00:00.000Z",
          modifiedAt: "2026-08-27T12:00:00.000Z",
        },
      },
    ]);
  });

  it("keeps existing routes and MDX posts and adds canonical Leaflet URLs", async () => {
    const entries = await sitemap();
    const urls = entries.map(({ url }) => url);

    expect(revalidate).toBe(300);
    expect(urls).toEqual(
      expect.arrayContaining([
        "https://24letters.com",
        "https://24letters.com/blog",
        "https://24letters.com/tools",
        "https://24letters.com/blog/legacy-post",
        "https://24letters.com/blog/published-leaflet-post",
      ]),
    );
    expect(urls).not.toContain("https://24letters.com/blog/published-rkey");
    expect(
      entries.find(({ url }) => url.endsWith("published-leaflet-post")),
    ).toMatchObject({ lastModified: "2026-08-27T12:00:00.000Z" });
  });

  it("excludes unpublished and foreign-publication records before listing URLs", async () => {
    const leafletPosts = await getLeafletPosts(
      async () =>
        Response.json({
          records: [
            {
              uri: "at://did:plc:ucgyl53umtlpjplm5vugutbi/site.standard.document/included-rkey",
              cid: "included",
              value: {
                title: "Included",
                publishedAt: "2026-08-27T12:00:00.000Z",
                site: PUBLICATION_AT_URI,
              },
            },
            {
              uri: "at://did:plc:ucgyl53umtlpjplm5vugutbi/site.standard.document/unpublished-rkey",
              cid: "unpublished",
              value: {
                title: "Unpublished",
                site: PUBLICATION_AT_URI,
              },
            },
            {
              uri: "at://did:plc:ucgyl53umtlpjplm5vugutbi/site.standard.document/foreign-rkey",
              cid: "foreign",
              value: {
                title: "Foreign",
                publishedAt: "2026-08-27T12:00:00.000Z",
                site: `${PUBLICATION_AT_URI}-foreign`,
              },
            },
          ],
        }),
      async () => "included-slug",
    );
    mocks.getCachedBlogPosts.mockResolvedValue(leafletPosts);

    const urls = (await sitemap()).map(({ url }) => url);

    expect(urls).toContain("https://24letters.com/blog/included-slug");
    expect(urls.join("\n")).not.toMatch(
      /included-rkey|unpublished-rkey|foreign-rkey/,
    );
  });
});
