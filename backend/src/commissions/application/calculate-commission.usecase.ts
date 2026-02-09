import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CommissionPolicy } from '../domain/commission.policy';
import { ICommissionRepository } from '../domain/commission.repository';
import { CommissionResult } from '../domain/commission.entity';

export interface CalculateCommissionInput {
  storeId: string;
  amount: number;
  appliesTo: 'order' | 'product' | 'payment';
}

@Injectable()
export class CalculateCommissionUseCase {
  constructor(
    @Inject('ICommissionRepository')
    private commissionRepository: ICommissionRepository,
    private prisma: PrismaService,
  ) {}

  async execute(input: CalculateCommissionInput): Promise<CommissionResult> {
    const { storeId, amount, appliesTo } = input;

    const store = await this.getStoreWithSubscription(storeId);
    const plan = store.subscription?.plan || 'FREE';

    const customFee = await this.commissionRepository.findByStoreAndType(
      storeId,
      appliesTo,
    );

    const commissionAmount = this.calculateAmount(
      amount,
      plan,
      customFee,
    );

    return {
      amount: commissionAmount,
      percentage:
        customFee?.type === 'percentage'
          ? customFee.value
          : CommissionPolicy.getDefaultRate(plan) * 100,
      type: customFee?.type || 'percentage',
      plan,
    };
  }

  private async getStoreWithSubscription(storeId: string) {
    return this.prisma.store.findUnique({
      where: { id: storeId },
      include: { subscription: true },
    });
  }

  private calculateAmount(
    amount: number,
    plan: string,
    customFee?: any,
  ): number {
    if (customFee?.isActive) {
      return this.calculateWithCustomFee(amount, customFee);
    }

    const rate = CommissionPolicy.getDefaultRate(plan as any);
    const commission = CommissionPolicy.calculatePercentage(amount, rate);

    return Math.round(commission * 100) / 100;
  }

  private calculateWithCustomFee(amount: number, fee: any): number {
    let commission = 0;

    if (fee.type === 'percentage') {
      commission = CommissionPolicy.calculatePercentage(
        amount,
        fee.value / 100,
      );
    } else {
      commission = CommissionPolicy.calculateFixed(amount, fee.value);
    }

    commission = CommissionPolicy.applyLimits(
      commission,
      fee.minAmount,
      fee.maxAmount,
    );

    return Math.round(commission * 100) / 100;
  }
}
