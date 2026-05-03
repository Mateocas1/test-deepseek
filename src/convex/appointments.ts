import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  SURCHARGE_COLEGA,
  SURCHARGE_LATE_SLOT,
  DEPOSIT_RATE,
  BOOKING_ADVANCE_HOURS,
  PAYMENT_WINDOW_MINUTES,
  SERVICE_PRICES,
  LATE_SLOT,
} from "./schema";

export const calculatePrice = mutation({
  args: {
    type: v.union(
      v.literal("solo-retiro"),
      v.literal("retiro-servicio"),
      v.literal("solo-servicio")
    ),
    origin: v.union(v.literal("frecuente"), v.literal("colega")),
    retiroSubcategory: v.optional(v.string()),
    servicioSubcategory: v.optional(v.string()),
    time: v.string(),
  },
  handler: async (
    _ctx: any,
    { type, origin, retiroSubcategory, servicioSubcategory, time }: any
  ) => {
    let total = 0;

    if (type === "solo-retiro" && retiroSubcategory) {
      total += SERVICE_PRICES.retiro[retiroSubcategory] ?? 0;
    }

    if (type === "retiro-servicio") {
      if (retiroSubcategory) {
        total += SERVICE_PRICES.retiro[retiroSubcategory] ?? 0;
      }
      if (servicioSubcategory) {
        total += SERVICE_PRICES.servicio[servicioSubcategory] ?? 0;
      }
    }

    if (type === "solo-servicio" && servicioSubcategory) {
      total += SERVICE_PRICES.servicio[servicioSubcategory] ?? 0;
    }

    if (origin === "colega") {
      total += SURCHARGE_COLEGA;
    }

    if (time === LATE_SLOT) {
      total += SURCHARGE_LATE_SLOT;
    }

    const deposit = Math.round(total * DEPOSIT_RATE);

    return { total, deposit };
  },
});

export const create = mutation({
  args: {
    type: v.union(
      v.literal("solo-retiro"),
      v.literal("retiro-servicio"),
      v.literal("solo-servicio")
    ),
    origin: v.union(v.literal("frecuente"), v.literal("colega")),
    retiroSubcategory: v.optional(v.string()),
    servicioSubcategory: v.optional(v.string()),
    date: v.string(),
    time: v.string(),
    paymentMethod: v.union(v.literal("platform"), v.literal("transfer")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) throw new Error("Usuario no encontrado");

    const minDate = new Date(Date.now() + BOOKING_ADVANCE_HOURS * 60 * 60 * 1000);
    const bookingDate = new Date(`${args.date}T${args.time}:00`);
    if (bookingDate < minDate) {
      throw new Error("Debe reservar con al menos 24 horas de anticipación");
    }

    const existing = await ctx.db
      .query("appointments")
      .withIndex("by_date_time", (q) =>
        q.eq("date", args.date).eq("time", args.time)
      )
      .filter((q) =>
        q.neq(q.field("status"), v.literal("cancelled"))
      )
      .first();

    if (existing) {
      throw new Error("Ese horario ya está reservado");
    }

    let total = 0;
    const { type, origin, retiroSubcategory, servicioSubcategory, time } = args;

    if (type === "solo-retiro" && retiroSubcategory) {
      total += SERVICE_PRICES.retiro[retiroSubcategory] ?? 0;
    }
    if (type === "retiro-servicio") {
      if (retiroSubcategory) total += SERVICE_PRICES.retiro[retiroSubcategory] ?? 0;
      if (servicioSubcategory) total += SERVICE_PRICES.servicio[servicioSubcategory] ?? 0;
    }
    if (type === "solo-servicio" && servicioSubcategory) {
      total += SERVICE_PRICES.servicio[servicioSubcategory] ?? 0;
    }
    if (origin === "colega") total += SURCHARGE_COLEGA;
    if (time === LATE_SLOT) total += SURCHARGE_LATE_SLOT;

    const deposit = Math.round(total * DEPOSIT_RATE);
    const expiresAt = Date.now() + PAYMENT_WINDOW_MINUTES * 60 * 1000;

    const appointmentId = await ctx.db.insert("appointments", {
      clientId: user._id,
      type,
      origin,
      retiroSubcategory,
      servicioSubcategory,
      hasColegaSurcharge: origin === "colega",
      hasLateSurcharge: time === LATE_SLOT,
      date: args.date,
      time,
      status: "pending",
      totalAmount: total,
      depositAmount: deposit,
      depositPaid: false,
      paymentMethod: args.paymentMethod,
      expiresAt,
      createdAt: Date.now(),
    });

    return appointmentId;
  },
});

export const listByDate = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    return await ctx.db
      .query("appointments")
      .withIndex("by_date", (q) => q.eq("date", date))
      .collect();
  },
});

export const listByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, { status }) => {
    return await ctx.db
      .query("appointments")
      .withIndex("by_status", (q) => q.eq("status", status as any))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("appointments") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const getMyAppointments = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) return [];
    return await ctx.db
      .query("appointments")
      .withIndex("by_client", (q) => q.eq("clientId", user._id))
      .order("desc")
      .collect();
  },
});

export const getAll = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user || user.role !== "admin") return [];
    return await ctx.db.query("appointments").order("desc").collect();
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("appointments"),
    status: v.union(
      v.literal("pending"),
      v.literal("deposit_paid"),
      v.literal("confirmed"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, { id, status }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");
    await ctx.db.patch(id, { status });
  },
});

export const markDepositPaid = mutation({
  args: {
    id: v.id("appointments"),
    mpPaymentId: v.optional(v.string()),
  },
  handler: async (ctx, { id, mpPaymentId }) => {
    const appointment = await ctx.db.get(id);
    if (!appointment) throw new Error("Turno no encontrado");

    await ctx.db.patch(id, {
      status: "deposit_paid",
      depositPaid: true,
      mpPaymentId,
    });

    await ctx.db.insert("payments", {
      appointmentId: id,
      amount: appointment.depositAmount,
      method: "platform",
      mpPaymentId,
      status: "approved",
      createdAt: Date.now(),
    });
  },
});
