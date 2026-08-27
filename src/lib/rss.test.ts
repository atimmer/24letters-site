import { afterEach, describe, expect, it, vi } from "vitest";
import { XMLValidator } from "fast-xml-parser";
import type { BlogPost } from "@/app/blog/utils";
import {
  buildRssFeed,
  RSS_CACHE_CONTROL,
  RSS_REVALIDATE_SECONDS,
} from "@/lib/rss";

function posts(): BlogPost[] {
  return [
    {
      source: "mdx",
      slug: "legacy-post",
      content: "Full **legacy** body",
      metadata: {
        title: "Legacy post",
        publishedAt: "2025-01-02",
      },
    },
    {
      source: "leaflet",
      recordKey: "leaflet-rkey",
      slug: "leaflet-post",
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
                  plaintext: "Full Leaflet body",
                },
              },
            ],
          },
        ],
      },
      metadata: {
        title: "R&D <launch> ]]>",
        summary: "Safe & sound <summary> ]]>",
        publishedAt: "2026-08-27T12:00:00.000Z",
      },
    },
  ];
}

describe("RSS route", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("publishes MDX and Leaflet posts at canonical URLs with full valid XML", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("no fetch"))),
    );

    const xml = await buildRssFeed(posts());

    expect(RSS_REVALIDATE_SECONDS).toBe(300);
    expect(RSS_CACHE_CONTROL).toBe(
      "public, s-maxage=300, stale-while-revalidate=300",
    );
    expect(xml).toContain("https://24letters.com/blog/legacy-post");
    expect(xml).toContain("https://24letters.com/blog/leaflet-post");
    expect(xml).not.toContain("https://24letters.com/blog/leaflet-rkey");
    expect(xml).toContain("Full Leaflet body</p>");
    expect(xml).toContain("<strong>legacy</strong>");
    expect(xml).toContain("<title>R&amp;D &lt;launch&gt; ]]&gt;</title>");
    expect(xml).toContain(
      "<description>Safe &amp; sound &lt;summary&gt; ]]&gt;</description>",
    );
    expect(XMLValidator.validate(xml)).toBe(true);
    expect(fetch).not.toHaveBeenCalled();
  });
});
