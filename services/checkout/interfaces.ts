export interface CreateCheckoutSessionRequest {
  pricingId: number;
  quantity?: number; // Required for unit credits, ignored for presets/subscriptions
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
  checkoutId: number;
}

export interface CheckoutSummary {
  id: number;
  type: 'CREDITS' | 'SUBSCRIPTION';
  quantity?: number;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';
  label: string;
  savings?: string;
  createdAt: string;
}

export enum CheckoutStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum PaymentType {
  CREDITS = 'CREDITS',
  SUBSCRIPTION = 'SUBSCRIPTION',
}