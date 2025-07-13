import api from "@/lib/axios";

export interface CheckoutSummary {
  id: number;
  orderId?: number;
  type: 'CREDITS' | 'SUBSCRIPTION';
  quantity?: number;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';
  label: string;
  savings?: string;
  createdAt: string;
}

export const getCheckoutSummary = async (stripeSessionId: string): Promise<CheckoutSummary> => {
  try {
    const response = await api.get(`/checkouts/session/${stripeSessionId}`);
    const data = response.data;
    
    // Transform status to uppercase to match frontend enum values
    return {
      ...data,
      status: data.status.toUpperCase()
    };
  } catch (error: any) {
    console.error("Failed to fetch checkout summary:", error);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      throw new Error("Authentication required. Please log in.");
    }
    
    if (error.response?.status === 404) {
      throw new Error("Checkout session not found");
    }
    
    throw new Error("Failed to load checkout summary. Please try again.");
  }
};