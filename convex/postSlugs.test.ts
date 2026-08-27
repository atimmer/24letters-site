import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

const modules = (
  import.meta as ImportMeta & {
    glob: (patterns: string[]) => Record<string, () => Promise<unknown>>;
  }
).glob(["./**/*.ts", "./**/*.js", "!./**/*.test.ts"]);

describe("post slug mapping", () => {
  it("assigns a title slug once and keeps it after a retitle", async () => {
    const t = convexTest(schema, modules);

    const first = await t.mutation(api.postSlugs.getOrCreate, {
      recordKey: "first-record",
      title: "My First Post!",
    });
    const repeated = await t.mutation(api.postSlugs.getOrCreate, {
      recordKey: "first-record",
      title: "A Completely Different Title",
    });

    expect(first).toBe("my-first-post");
    expect(repeated).toBe(first);
    await expect(
      t.run((ctx) => ctx.db.query("postSlugs").collect()),
    ).resolves.toHaveLength(1);
  });

  it("uses incrementing English suffixes for occupied and MDX-reserved slugs", async () => {
    const t = convexTest(schema, modules);

    const reservedCollision = await t.mutation(api.postSlugs.getOrCreate, {
      recordKey: "reserved",
      title: "Better Defaults",
    });
    const first = await t.mutation(api.postSlugs.getOrCreate, {
      recordKey: "one",
      title: "Shared Title",
    });
    const second = await t.mutation(api.postSlugs.getOrCreate, {
      recordKey: "two",
      title: "Shared Title",
    });
    const third = await t.mutation(api.postSlugs.getOrCreate, {
      recordKey: "three",
      title: "Shared Title",
    });

    expect(reservedCollision).toBe("better-defaults-two");
    expect([first, second, third]).toEqual([
      "shared-title",
      "shared-title-two",
      "shared-title-three",
    ]);
  });

  it("keeps both uniqueness directions under concurrent first sightings", async () => {
    const t = convexTest(schema, modules);

    const sameRecord = await Promise.all(
      Array.from({ length: 4 }, () =>
        t.mutation(api.postSlugs.getOrCreate, {
          recordKey: "same-record",
          title: "Concurrent",
        }),
      ),
    );
    const collidingRecords = await Promise.all(
      ["record-a", "record-b"].map((recordKey) =>
        t.mutation(api.postSlugs.getOrCreate, {
          recordKey,
          title: "Another Concurrent",
        }),
      ),
    );
    const mappings = await t.run((ctx) => ctx.db.query("postSlugs").collect());

    expect(new Set(sameRecord)).toEqual(new Set(["concurrent"]));
    expect(new Set(collidingRecords)).toEqual(
      new Set(["another-concurrent", "another-concurrent-two"]),
    );
    expect(new Set(mappings.map(({ recordKey }) => recordKey)).size).toBe(
      mappings.length,
    );
    expect(new Set(mappings.map(({ slug }) => slug)).size).toBe(
      mappings.length,
    );
  });
});
