import { describe, expect, it } from "vitest";
import { PUBLICATION_AT_URI } from "@/app/blog/leaflet";
import { GET } from "./route";

describe("standard.site publication discovery", () => {
  it("returns the exact public AT-URI as plain text without authentication", async () => {
    const response = GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "text/plain; charset=utf-8",
    );
    expect(await response.text()).toBe(PUBLICATION_AT_URI);
  });
});
