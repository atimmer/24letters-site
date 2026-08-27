import { beforeEach, describe, expect, it, vi } from "vitest";
import type { BlogPost } from "@/app/blog/utils";

const mocks = vi.hoisted(() => ({
  getCachedBlogPosts: vi.fn<() => Promise<BlogPost[]>>(),
}));

vi.mock("@/app/blog/utils", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/app/blog/utils")>();
  return { ...original, getCachedBlogPosts: mocks.getCachedBlogPosts };
});

import { GET, revalidate } from "./route";

describe("RSS route", () => {
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
        recordKey: "leaflet-rkey",
        slug: "leaflet-post",
        content: {},
        metadata: {
          title: "Leaflet post",
          publishedAt: "2026-08-27T12:00:00.000Z",
        },
      },
    ]);
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string | URL | Request) => {
        const url = input.toString();
        const slug = url.split("/").at(-1);
        return new Response(
          `<html><body><article><p>Full ${slug} body</p></article></body></html>`,
        );
      }),
    );
  });

  it("publishes MDX and Leaflet posts at canonical URLs with full HTML", async () => {
    const response = await GET();
    const xml = await response.text();

    expect(revalidate).toBe(300);
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe(
      "public, s-maxage=300, stale-while-revalidate=300",
    );
    expect(xml).toContain("https://24letters.com/blog/legacy-post");
    expect(xml).toContain("https://24letters.com/blog/leaflet-post");
    expect(xml).not.toContain("https://24letters.com/blog/leaflet-rkey");
    expect(xml).toContain("<p>Full leaflet-post body</p>");
  });
});
