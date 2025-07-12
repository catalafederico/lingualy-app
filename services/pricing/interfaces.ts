export interface CreditPresetOption {
  id: number;
  quantity: number;
  price: number;
  savings?: string;
}

export interface CreditPricing {
  unitPrice: number;
  unitPricingId: number;
  presetOptions: CreditPresetOption[];
}

export interface SubscriptionOption {
  id: number;
  duration: string;
  label: string;
  price: number;
  savings?: string;
}

export interface PricingOptions {
  credits: CreditPricing;
  subscriptions: SubscriptionOption[];
}