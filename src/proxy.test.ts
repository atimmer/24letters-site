import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getFrozenSlugByRecordKey:
    vi.fn<(recordKey: string) => Promise<string | null>>(),
}));

vi.mock("@/app/blog/leaflet", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/app/blog/leaflet")>();
  return {
    ...original,
    getFrozenSlugByRecordKey: mocks.getFrozenSlugByRecordKey,
  };
});

import { proxy } from "./proxy";

function request(path: string): NextRequest {
  return new NextRequest(`https://24letters.com${path}`);
}

describe("Leaflet document path proxy", () => {
  beforeEach(() => {
    mocks.getFrozenSlugByRecordKey.mockReset();
    mocks.getFrozenSlugByRecordKey.mockResolvedValue(
      "how-i-think-about-my-automations-like-a-pyramid",
    );
  });

  it("returns an exact 301 to the canonical frozen slug", async () => {
    const response = await proxy(request("/blog/3mu2s6rzakc2o"));

    expect(response.status).toBe(301);
    expect(new URL(response.headers.get("location")!).pathname).toBe(
      "/blog/how-i-think-about-my-automations-like-a-pyramid",
    );
  });

  it("keeps the frozen redirect target after a retitle", async () => {
    const response = await proxy(request("/blog/3mu2s6rzakc2o"));

    expect(response.status).toBe(301);
    expect(new URL(response.headers.get("location")!).pathname).toBe(
      "/blog/how-i-think-about-my-automations-like-a-pyramid",
    );
  });

  it("passes canonical slug requests through without a redirect loop", async () => {
    mocks.getFrozenSlugByRecordKey.mockResolvedValue(null);
    const response = await proxy(
      request("/blog/how-i-think-about-my-automations-like-a-pyramid"),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("fails open for an unknown record key so the route can return 404", async () => {
    mocks.getFrozenSlugByRecordKey.mockResolvedValue(null);
    const response = await proxy(request("/blog/unknown-record"));

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("skips Convex entirely for a known static MDX slug", async () => {
    const response = await proxy(request("/blog/how-i-use-checklister"));

    expect(response.status).toBe(200);
    expect(mocks.getFrozenSlugByRecordKey).not.toHaveBeenCalled();
  });

  it("fails open when the indexed Convex lookup is unavailable", async () => {
    mocks.getFrozenSlugByRecordKey.mockRejectedValue(new Error("offline"));

    const response = await proxy(request("/blog/3mu2s6rzakc2o"));

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });
});
