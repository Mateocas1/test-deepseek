import { v } from "convex/values";
import { query } from "./_generated/server";
import { SERVICE_PRICES, SERVICE_SUBCATEGORIES } from "./schema";

export const list = query({
  handler: async () => {
    return SERVICE_SUBCATEGORIES.map((sub) => ({
      subcategory: sub,
      retiroPrice: SERVICE_PRICES.retiro[sub],
      servicioPrice: SERVICE_PRICES.servicio[sub],
    }));
  },
});

export const getPrices = query({
  handler: async () => {
    return SERVICE_PRICES;
  },
});
