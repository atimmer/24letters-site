import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getLeafletPosts,
  type BlogPost,
} from "@/app/blog/utils";
import { PUBLICATION_AT_URI } from "@/app/blog/leaflet";

const mocks = vi.hoisted(() => ({
  getCachedBlogPosts: vi.fn<() => Promise<BlogPost[]>>(),
}));

vi.mock("@/app/blog/utils", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/app/blog/utils")>();
  return { ...original, getCachedBlogPosts: mocks.getCachedBlogPosts };
});

import { proxy } from "./proxy";

function leafletPost(title = "Original title"): BlogPost {
  return {
    source: "leaflet",
    recordKey: "3mu2s6rzakc2o",
    slug: "how-i-think-about-my-automations-like-a-pyramid",
    content: {},
    metadata: {
      title,
      publishedAt: "2026-08-27T11:57:14.284Z",
    },
  };
}

function request(path: string): NextRequest {
  return new NextRequest(`https://24letters.com${path}`);
}

describe("Leaflet document path proxy", () => {
  beforeEach(() => {
    mocks.getCachedBlogPosts.mockReset();
    mocks.getCachedBlogPosts.mockResolvedValue([leafletPost()]);
  });

  it("returns an exact 301 to the canonical frozen slug", async () => {
    const response = await proxy(request("/blog/3mu2s6rzakc2o"));

    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(
      "https://24letters.com/blog/how-i-think-about-my-automations-like-a-pyramid",
    );
  });

  it("keeps the frozen redirect target after a retitle", async () => {
    mocks.getCachedBlogPosts.mockResolvedValue([
      leafletPost("A completely different title"),
    ]);

    const response = await proxy(request("/blog/3mu2s6rzakc2o"));

    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(
      "https://24letters.com/blog/how-i-think-about-my-automations-like-a-pyramid",
    );
  });

  it("passes canonical slug requests through without a redirect loop", async () => {
    const response = await proxy(
      request("/blog/how-i-think-about-my-automations-like-a-pyramid"),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("returns 404 for an unknown record key or slug", async () => {
    const response = await proxy(request("/blog/unknown-record"));

    expect(response.status).toBe(404);
    expect(response.headers.get("location")).toBeNull();
  });

  it("does not redirect a record from another publication", async () => {
    const posts = await getLeafletPosts(
      async () =>
        Response.json({
          records: [
            {
              uri: "at://did:plc:ucgyl53umtlpjplm5vugutbi/site.standard.document/foreign",
              cid: "fixture-foreign",
              value: {
                title: "Foreign",
                publishedAt: "2026-08-27T11:57:14.284Z",
                site: `${PUBLICATION_AT_URI}-foreign`,
              },
            },
          ],
        }),
      async () => "foreign",
    );
    mocks.getCachedBlogPosts.mockResolvedValue(posts);

    const response = await proxy(request("/blog/foreign"));

    expect(response.status).toBe(404);
    expect(response.headers.get("location")).toBeNull();
  });
});
