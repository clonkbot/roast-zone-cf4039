import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  roasts: defineTable({
    targetName: v.string(),
    roastText: v.string(),
    memeUrl: v.optional(v.string()),
    userId: v.id("users"),
    likes: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_created", ["createdAt"])
    .index("by_target", ["targetName"]),

  roastLikes: defineTable({
    roastId: v.id("roasts"),
    userId: v.id("users"),
  })
    .index("by_roast", ["roastId"])
    .index("by_user_and_roast", ["userId", "roastId"]),
});
