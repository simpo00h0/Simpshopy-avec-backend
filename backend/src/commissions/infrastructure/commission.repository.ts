import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ICommissionRepository,
  StoreWithSubscription,
} from '../domain/commission.repository';
import { Commission } from '../domain/commission.entity';

@Injectable()
export class CommissionRepository implements ICommissionRepository {
  constructor(private prisma: PrismaService) {}

  async findStoreWithSubscription(
    storeId: string,
  ): Promise<StoreWithSubscription | null> {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      include: { subscription: true },
    });
    if (!store) return null;
    return {
      plan: (store.subscription?.plan ?? 'FREE') as StoreWithSubscription['plan'],
    };
  }

  async findByStoreAndType(
    storeId: string,
    appliesTo: 'order' | 'product' | 'payment',
  ): Promise<Commission | null> {
    const fee = await this.prisma.platformFee.findFirst({
      where: {
        storeId,
        appliesTo,
        isActive: true,
      },
    });

    if (!fee) {
      return null;
    }

    return {
      id: fee.id,
      storeId: fee.storeId,
      type: fee.type as 'percentage' | 'fixed',
      value: fee.value,
      currency: fee.currency,
      appliesTo: fee.appliesTo as 'order' | 'product' | 'payment',
      isActive: fee.isActive,
      minAmount: fee.minAmount ?? undefined,
      maxAmount: fee.maxAmount ?? undefined,
    };
  }
}
