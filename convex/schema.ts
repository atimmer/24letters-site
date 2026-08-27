import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  postSlugs: defineTable({
    recordKey: v.string(),
    slug: v.string(),
  })
    .index("by_record_key", ["recordKey"])
    .index("by_slug", ["slug"]),
});
