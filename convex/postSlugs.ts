import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ATPROTO_TID_PATTERN, slugCandidate, slugifyTitle } from "./slugRules";

export const getByRecordKey = query({
  args: { recordKey: v.string() },
  handler: async (ctx, { recordKey }) => {
    const mapping = await ctx.db
      .query("postSlugs")
      .withIndex("by_record_key", (query) => query.eq("recordKey", recordKey))
      .unique();

    return mapping?.slug ?? null;
  },
});

export const getOrCreate = mutation({
  args: {
    recordKey: v.string(),
    reservedSlugs: v.array(v.string()),
    secret: v.string(),
    title: v.string(),
  },
  handler: async (ctx, { recordKey, reservedSlugs, secret, title }) => {
    const expectedSecret = process.env.POST_SLUG_SECRET;
    if (!expectedSecret || secret !== expectedSecret) {
      throw new Error("Unauthorized slug mapping request");
    }

    const existing = await ctx.db
      .query("postSlugs")
      .withIndex("by_record_key", (query) => query.eq("recordKey", recordKey))
      .unique();

    if (existing) return existing.slug;

    const baseSlug = slugifyTitle(title);
    const reservedSlugSet = new Set(reservedSlugs);
    let ordinal = 1;

    while (true) {
      const candidate = slugCandidate(baseSlug, ordinal);
      const owner = await ctx.db
        .query("postSlugs")
        .withIndex("by_slug", (query) => query.eq("slug", candidate))
        .unique();
      const recordKeyOwner = await ctx.db
        .query("postSlugs")
        .withIndex("by_record_key", (query) => query.eq("recordKey", candidate))
        .unique();

      if (
        !owner &&
        !recordKeyOwner &&
        !reservedSlugSet.has(candidate) &&
        !ATPROTO_TID_PATTERN.test(candidate)
      ) {
        await ctx.db.insert("postSlugs", { recordKey, slug: candidate });
        return candidate;
      }

      ordinal += 1;
    }
  },
});
