import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const roasts = await ctx.db
      .query("roasts")
      .withIndex("by_created")
      .order("desc")
      .take(50);

    const userId = await getAuthUserId(ctx);

    const roastsWithLikeStatus = await Promise.all(
      roasts.map(async (roast) => {
        let hasLiked = false;
        if (userId) {
          const like = await ctx.db
            .query("roastLikes")
            .withIndex("by_user_and_roast", (q) =>
              q.eq("userId", userId).eq("roastId", roast._id)
            )
            .first();
          hasLiked = !!like;
        }
        return { ...roast, hasLiked };
      })
    );

    return roastsWithLikeStatus;
  },
});

export const create = mutation({
  args: {
    targetName: v.string(),
    roastText: v.string(),
    memeUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("roasts", {
      targetName: args.targetName,
      roastText: args.roastText,
      memeUrl: args.memeUrl,
      userId,
      likes: 0,
      createdAt: Date.now(),
    });
  },
});

export const toggleLike = mutation({
  args: { roastId: v.id("roasts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingLike = await ctx.db
      .query("roastLikes")
      .withIndex("by_user_and_roast", (q) =>
        q.eq("userId", userId).eq("roastId", args.roastId)
      )
      .first();

    const roast = await ctx.db.get(args.roastId);
    if (!roast) throw new Error("Roast not found");

    if (existingLike) {
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(args.roastId, { likes: Math.max(0, roast.likes - 1) });
    } else {
      await ctx.db.insert("roastLikes", { roastId: args.roastId, userId });
      await ctx.db.patch(args.roastId, { likes: roast.likes + 1 });
    }
  },
});

export const remove = mutation({
  args: { id: v.id("roasts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const roast = await ctx.db.get(args.id);
    if (!roast || roast.userId !== userId) throw new Error("Not authorized");

    // Delete all likes for this roast
    const likes = await ctx.db
      .query("roastLikes")
      .withIndex("by_roast", (q) => q.eq("roastId", args.id))
      .collect();

    for (const like of likes) {
      await ctx.db.delete(like._id);
    }

    await ctx.db.delete(args.id);
  },
});

export const generateMeme = action({
  args: { targetName: v.string() },
  handler: async (_ctx, args) => {
    // Using nanobananapro API for meme generation
    const searchQuery = encodeURIComponent(`${args.targetName} funny meme roast`);
    const memeUrl = `https://api.nanobananapro.com/v1/meme?query=${searchQuery}&random=${Date.now()}`;
    return memeUrl;
  },
});
