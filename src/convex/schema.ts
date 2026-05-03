import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const SURCHARGE_COLEGA = 1000;
export const SURCHARGE_LATE_SLOT = 8000;
export const DEPOSIT_RATE = 0.5;
export const BOOKING_ADVANCE_HOURS = 24;
export const PAYMENT_WINDOW_MINUTES = 120;

export const TIME_SLOTS = ["08:00", "11:00", "14:00", "16:30", "18:30"];
export const LATE_SLOT = "18:30";

export const SERVICE_SUBCATEGORIES = ["soft-gel", "capping", "semipermanente"] as const;

export interface ServicePriceConfig {
  retiro: Record<string, number>;
  servicio: Record<string, number>;
}

export const SERVICE_PRICES: ServicePriceConfig = {
  retiro: { "soft-gel": 8000, capping: 7000, semipermanente: 5000 },
  servicio: { "soft-gel": 24000, capping: 22000, semipermanente: 19500 },
};

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    avatar: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.union(v.literal("customer"), v.literal("admin")),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  appointments: defineTable({
    clientId: v.id("users"),
    type: v.union(
      v.literal("solo-retiro"),
      v.literal("retiro-servicio"),
      v.literal("solo-servicio")
    ),
    origin: v.union(v.literal("frecuente"), v.literal("colega")),
    retiroSubcategory: v.optional(v.string()),
    servicioSubcategory: v.optional(v.string()),
    hasColegaSurcharge: v.boolean(),
    hasLateSurcharge: v.boolean(),
    date: v.string(),
    time: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("deposit_paid"),
      v.literal("confirmed"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    totalAmount: v.number(),
    depositAmount: v.number(),
    depositPaid: v.boolean(),
    paymentMethod: v.union(v.literal("platform"), v.literal("transfer")),
    mpPreferenceId: v.optional(v.string()),
    mpPaymentId: v.optional(v.string()),
    receiptUrl: v.optional(v.string()),
    receiptVerified: v.optional(v.boolean()),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_client", ["clientId"])
    .index("by_date", ["date"])
    .index("by_status", ["status"])
    .index("by_date_time", ["date", "time"]),

  availability: defineTable({
    date: v.string(),
    dayOfWeek: v.number(),
    timeSlots: v.array(v.string()),
    allDay: v.boolean(),
    reason: v.optional(v.string()),
    createdBy: v.id("users"),
  }).index("by_date", ["date"]),

  payments: defineTable({
    appointmentId: v.id("appointments"),
    amount: v.number(),
    method: v.union(v.literal("platform"), v.literal("transfer")),
    mpPaymentId: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),
    receiptUrl: v.optional(v.string()),
    verifiedAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_appointment", ["appointmentId"]),

  gallery: defineTable({
    storageId: v.id("_storage"),
    caption: v.optional(v.string()),
    order: v.number(),
    active: v.boolean(),
    createdAt: v.number(),
  }).index("by_order", ["order"]),

  reviews: defineTable({
    googlePlaceId: v.string(),
    authorName: v.string(),
    rating: v.number(),
    text: v.string(),
    profilePhotoUrl: v.optional(v.string()),
    createdAt: v.number(),
  }),

  settings: defineTable({
    key: v.string(),
    value: v.any(),
  }).index("by_key", ["key"]),
});
