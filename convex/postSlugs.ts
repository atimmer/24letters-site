import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { RESERVED_MDX_SLUGS, slugCandidate, slugifyTitle } from "./slugRules";

export const getOrCreate = mutation({
  args: {
    recordKey: v.string(),
    title: v.string(),
  },
  handler: async (ctx, { recordKey, title }) => {
    const existing = await ctx.db
      .query("postSlugs")
      .withIndex("by_record_key", (query) => query.eq("recordKey", recordKey))
      .unique();

    if (existing) return existing.slug;

    const baseSlug = slugifyTitle(title);
    let ordinal = 1;

    while (true) {
      const candidate = slugCandidate(baseSlug, ordinal);
      const owner = await ctx.db
        .query("postSlugs")
        .withIndex("by_slug", (query) => query.eq("slug", candidate))
        .unique();

      if (!owner && !RESERVED_MDX_SLUGS.has(candidate)) {
        await ctx.db.insert("postSlugs", { recordKey, slug: candidate });
        return candidate;
      }

      ordinal += 1;
    }
  },
});
