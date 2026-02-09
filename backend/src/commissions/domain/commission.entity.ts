import { SubscriptionPlan } from '@prisma/client';

export interface Commission {
  id: string;
  storeId: string;
  type: 'percentage' | 'fixed';
  value: number;
  currency: string;
  appliesTo: 'order' | 'product' | 'payment';
  isActive: boolean;
  minAmount?: number;
  maxAmount?: number;
}

export interface CommissionResult {
  amount: number;
  percentage?: number;
  type: 'percentage' | 'fixed';
  plan: SubscriptionPlan;
}
