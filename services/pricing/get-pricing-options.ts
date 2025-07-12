import api from "@/lib/axios";
import { PricingOptions } from "./interfaces";

export const getPricingOptions = async (): Promise<PricingOptions> => {
  try {
    const response = await api.get("/pricing");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch pricing options:", error);
    
    // Fallback to hardcoded values if API fails
    return {
      credits: {
        unitPrice: 2.99,
        unitPricingId: 1, // Fallback unit pricing ID
        presetOptions: [
          { id: 2, quantity: 5, price: 14.95 },
          { id: 3, quantity: 10, price: 29.90 }
        ]
      },
      subscriptions: [
        { id: 1, duration: "3months", label: "3 Months", price: 29.99 },
        { id: 2, duration: "6months", label: "6 Months", price: 54.99, savings: "Save $5" },
        { id: 3, duration: "1year", label: "1 Year", price: 99.99, savings: "Save $20" }
      ]
    };
  }
};