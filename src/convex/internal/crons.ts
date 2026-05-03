import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

export const expireUnpaid = internalMutation({
  handler: async (ctx) => {
    const now = Date.now();
    const pending = await ctx.db
      .query("appointments")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    for (const appointment of pending) {
      if (now > appointment.expiresAt) {
        await ctx.db.patch(appointment._id, { status: "cancelled" });
      }
    }
  },
});

export const releaseExpired = internalMutation({
  handler: async (ctx) => {
    const now = Date.now();
    const expired = await ctx.db
      .query("appointments")
      .filter((q) =>
        q.and(
          q.eq(q.field("status"), v.literal("pending")),
          q.lt(q.field("expiresAt"), now)
        )
      )
      .collect();

    for (const appointment of expired) {
      await ctx.db.patch(appointment._id, { status: "cancelled" });
    }
  },
});
