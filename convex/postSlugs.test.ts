import { convexTest } from "convex-test";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

const modules = (
  import.meta as ImportMeta & {
    glob: (patterns: string[]) => Record<string, () => Promise<unknown>>;
  }
).glob(["./**/*.ts", "./**/*.js", "!./**/*.test.ts"]);

const TEST_SECRET = "test-post-slug-secret";
const RESERVED_SLUGS = ["better-defaults", "how-i-use-checklister"];

function slugArgs(recordKey: string, title: string) {
  return {
    recordKey,
    reservedSlugs: RESERVED_SLUGS,
    secret: TEST_SECRET,
    title,
  };
}

describe("post slug mapping", () => {
  beforeEach(() => vi.stubEnv("POST_SLUG_SECRET", TEST_SECRET));
  afterEach(() => vi.unstubAllEnvs());

  it("rejects mapping creation without the configured shared secret", async () => {
    const t = convexTest(schema, modules);

    await expect(
      t.mutation(api.postSlugs.getOrCreate, {
        recordKey: "attacker-record",
        reservedSlugs: RESERVED_SLUGS,
        secret: "wrong-secret",
        title: "Poisoned title",
      }),
    ).rejects.toThrow("Unauthorized slug mapping request");
  });

  it("assigns a title slug once and keeps it after a retitle", async () => {
    const t = convexTest(schema, modules);

    const first = await t.mutation(
      api.postSlugs.getOrCreate,
      slugArgs("first-record", "My First Post!"),
    );
    const repeated = await t.mutation(
      api.postSlugs.getOrCreate,
      slugArgs("first-record", "A Completely Different Title"),
    );

    expect(first).toBe("my-first-post");
    expect(repeated).toBe(first);
    await expect(
      t.run((ctx) => ctx.db.query("postSlugs").collect()),
    ).resolves.toHaveLength(1);
  });

  it("uses incrementing English suffixes for occupied and MDX-reserved slugs", async () => {
    const t = convexTest(schema, modules);

    const reservedCollision = await t.mutation(
      api.postSlugs.getOrCreate,
      slugArgs("reserved", "How I use Checklister"),
    );
    const first = await t.mutation(
      api.postSlugs.getOrCreate,
      slugArgs("one", "Shared Title"),
    );
    const second = await t.mutation(
      api.postSlugs.getOrCreate,
      slugArgs("two", "Shared Title"),
    );
    const third = await t.mutation(
      api.postSlugs.getOrCreate,
      slugArgs("three", "Shared Title"),
    );

    expect(reservedCollision).toBe("how-i-use-checklister-two");
    expect([first, second, third]).toEqual([
      "shared-title",
      "shared-title-two",
      "shared-title-three",
    ]);
  });

  it("never assigns a slug that belongs to an existing record key", async () => {
    const t = convexTest(schema, modules);

    await t.mutation(
      api.postSlugs.getOrCreate,
      slugArgs("existing-rkey", "Original post"),
    );
    const slug = await t.mutation(
      api.postSlugs.getOrCreate,
      slugArgs("another-rkey", "existing-rkey"),
    );

    expect(slug).toBe("existing-rkey-two");
  });

  it("reserves TID-shaped slugs before their record keys exist", async () => {
    const t = convexTest(schema, modules);
    const futureRecordKey = "3jzfcijpj2z2a";

    await expect(
      t.run((ctx) => ctx.db.query("postSlugs").collect()),
    ).resolves.toEqual([]);

    const slug = await t.mutation(
      api.postSlugs.getOrCreate,
      slugArgs("unrelated-record", futureRecordKey),
    );

    expect(slug).toBe(`${futureRecordKey}-two`);
  });

  it("keeps both uniqueness directions under concurrent first sightings", async () => {
    const t = convexTest(schema, modules);

    const sameRecord = await Promise.all(
      Array.from({ length: 4 }, () =>
        t.mutation(api.postSlugs.getOrCreate, {
          ...slugArgs("same-record", "Concurrent"),
        }),
      ),
    );
    const collidingRecords = await Promise.all(
      ["record-a", "record-b"].map((recordKey) =>
        t.mutation(api.postSlugs.getOrCreate, {
          ...slugArgs(recordKey, "Another Concurrent"),
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
