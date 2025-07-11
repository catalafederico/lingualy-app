import api from "@/lib/axios";
import { PricingOptions } from "./interfaces";

export const getPricingOptions = async (): Promise<PricingOptions> => {
  try {
    const response = await api.get("/api/pricing/options");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch pricing options:", error);
    
    // Fallback to hardcoded values if API fails
    return {
      credits: {
        unitPrice: 2.99,
        presetOptions: [
          { quantity: 5, price: 14.95 },
          { quantity: 10, price: 29.90 }
        ]
      },
      subscriptions: [
        { id: "3months", duration: "3months", label: "3 Months", price: 29.99 },
        { id: "6months", duration: "6months", label: "6 Months", price: 54.99, savings: "Save $5" },
        { id: "1year", duration: "1year", label: "1 Year", price: 99.99, savings: "Save $20" }
      ]
    };
  }
};