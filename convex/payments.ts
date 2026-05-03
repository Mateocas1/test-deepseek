import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("payments").order("desc").collect();
  },
});

export const getByAppointment = query({
  args: { appointmentId: v.id("appointments") },
  handler: async (ctx, { appointmentId }) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_appointment", (q) => q.eq("appointmentId", appointmentId))
      .first();
  },
});
