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
    console.error("Failed to create checkout session:", {
      error,
      request,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
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
    
    if (error.response?.status === 500) {
      throw new Error("Server error. Please check your configuration and try again.");
    }
    
    // Show the actual error message if available
    const errorMessage = error.response?.data?.message || error.message || "Failed to create checkout session. Please try again.";
    throw new Error(errorMessage);
  }
};