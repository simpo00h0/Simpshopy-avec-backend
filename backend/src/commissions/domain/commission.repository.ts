import { Commission } from './commission.entity';
import { SubscriptionPlan } from '@prisma/client';

export interface StoreWithSubscription {
  plan: SubscriptionPlan;
}

export interface ICommissionRepository {
  findByStoreAndType(
    storeId: string,
    appliesTo: 'order' | 'product' | 'payment',
  ): Promise<Commission | null>;

  findStoreWithSubscription(storeId: string): Promise<StoreWithSubscription | null>;
}
