export interface CreditPresetOption {
  quantity: number;
  price: number;
  savings?: string;
}

export interface CreditPricing {
  unitPrice: number;
  presetOptions: CreditPresetOption[];
}

export interface SubscriptionOption {
  id: string;
  duration: string;
  label: string;
  price: number;
  savings?: string;
}

export interface PricingOptions {
  credits: CreditPricing;
  subscriptions: SubscriptionOption[];
}