import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("reviews").collect();
  },
});

export const upsert = mutation({
  args: {
    googlePlaceId: v.string(),
    authorName: v.string(),
    rating: v.number(),
    text: v.string(),
    profilePhotoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("reviews", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
