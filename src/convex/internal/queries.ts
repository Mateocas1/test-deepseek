import { v } from "convex/values";
import { internalQuery } from "../_generated/server";

export const getExpiredUnpaid = internalQuery({
  handler: async (ctx) => {
    const now = Date.now();
    return await ctx.db
      .query("appointments")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .filter((q) => q.lt(q.field("expiresAt"), now))
      .collect();
  },
});
