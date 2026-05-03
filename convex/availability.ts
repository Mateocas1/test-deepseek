import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getBlockedSlots = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    return await ctx.db
      .query("availability")
      .withIndex("by_date", (q) => q.eq("date", date))
      .first();
  },
});

export const blockSlots = mutation({
  args: {
    date: v.string(),
    timeSlots: v.array(v.string()),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, { date, timeSlots, reason }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== "admin") throw new Error("No autorizado");

    const existing = await ctx.db
      .query("availability")
      .withIndex("by_date", (q) => q.eq("date", date))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        timeSlots,
        allDay: false,
        reason,
        createdBy: user._id,
      });
    } else {
      await ctx.db.insert("availability", {
        date,
        dayOfWeek: new Date(date).getDay(),
        timeSlots,
        allDay: false,
        reason,
        createdBy: user._id,
      });
    }
  },
});

export const blockDay = mutation({
  args: {
    date: v.string(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, { date, reason }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== "admin") throw new Error("No autorizado");

    const existing = await ctx.db
      .query("availability")
      .withIndex("by_date", (q) => q.eq("date", date))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        timeSlots: [],
        allDay: true,
        reason,
        createdBy: user._id,
      });
    } else {
      await ctx.db.insert("availability", {
        date,
        dayOfWeek: new Date(date).getDay(),
        timeSlots: [],
        allDay: true,
        reason,
        createdBy: user._id,
      });
    }
  },
});

export const unblockDate = mutation({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== "admin") throw new Error("No autorizado");

    const existing = await ctx.db
      .query("availability")
      .withIndex("by_date", (q) => q.eq("date", date))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const getAvailableSlots = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const blocked = await ctx.db
      .query("availability")
      .withIndex("by_date", (q) => q.eq("date", date))
      .first();

    if (blocked?.allDay) return [];

    const takenAppointments = await ctx.db
      .query("appointments")
      .withIndex("by_date", (q) => q.eq("date", date))
      .filter((q) => q.neq(q.field("status"), v.literal("cancelled")))
      .collect();

    const takenTimes = new Set(takenAppointments.map((a) => a.time));
    const blockedSlots = new Set(blocked?.timeSlots ?? []);

    const allSlots = ["08:00", "11:00", "14:00", "16:30", "18:30"];
    return allSlots.filter(
      (slot) => !takenTimes.has(slot) && !blockedSlots.has(slot)
    );
  },
});

export const listAllBlocked = query({
  handler: async (ctx) => {
    return await ctx.db.query("availability").collect();
  },
});
