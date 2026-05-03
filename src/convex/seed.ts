import { mutation } from "./_generated/server";

export const seed = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("settings").first();
    if (existing) return;

    await ctx.db.insert("settings", {
      key: "business_hours",
      value: {
        monday: { open: "08:00", close: "18:30" },
        tuesday: { open: "08:00", close: "18:30" },
        wednesday: { open: "08:00", close: "18:30" },
        thursday: { open: "08:00", close: "18:30" },
        friday: { open: "08:00", close: "18:30" },
        saturday: { open: "08:00", close: "18:30" },
        sunday: null,
      },
    });

    await ctx.db.insert("settings", {
      key: "mp_account",
      value: {
        alias: "",
        cvu: "",
      },
    });

    await ctx.db.insert("settings", {
      key: "google_place_id",
      value: "ChIJnxeDGD-7vJURV2xI-3Lz9IQ",
    });
  },
});
