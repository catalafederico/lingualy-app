import api from "@/lib/axios";

export interface CreateCheckoutSessionRequest {
  pricingId: number;
  quantity?: number; // Required for unit credits, ignored for presets/subscriptions
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
  checkoutId: number;
}

export const createCheckoutSession = async (
  request: CreateCheckoutSessionRequest
): Promise<CheckoutSessionResponse> => {
  try {
    const response = await api.post("/checkouts/create-session", request);
    return response.data;
  } catch (error: any) {
    console.error("Failed to create checkout session:", error);
    
    // Handle specific error cases
    if (error.response?.status === 400) {
      throw new Error(error.response.data.message || "Invalid checkout request");
    }
    
    if (error.response?.status === 401) {
      throw new Error("Authentication required. Please log in.");
    }
    
    if (error.response?.status === 404) {
      throw new Error("Invalid pricing option selected");
    }
    
    throw new Error("Failed to create checkout session. Please try again.");
  }
};