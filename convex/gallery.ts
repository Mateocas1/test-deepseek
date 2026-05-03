import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("gallery").collect();
  },
});

export const listAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("gallery").collect();
  },
});

export const add = mutation({
  args: {
    storageId: v.id("_storage"),
    caption: v.optional(v.string()),
    order: v.number(),
  },
  handler: async (ctx, { storageId, caption, order }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");
    return await ctx.db.insert("gallery", {
      storageId,
      caption,
      order,
      active: true,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("gallery") },
  handler: async (ctx, { id }) => {
    return await ctx.db.delete(id);
  },
});

export const updateOrder = mutation({
  args: { id: v.id("gallery"), order: v.number() },
  handler: async (ctx, { id, order }) => {
    await ctx.db.patch(id, { order });
  },
});

export const toggleActive = mutation({
  args: { id: v.id("gallery") },
  handler: async (ctx, { id }) => {
    const item = await ctx.db.get(id);
    if (item) {
      await ctx.db.patch(id, { active: !item.active });
    }
  },
});
