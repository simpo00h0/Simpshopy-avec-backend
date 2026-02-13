import { Injectable, Inject } from '@nestjs/common';
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
  ) {}

  async execute(input: CalculateCommissionInput): Promise<CommissionResult> {
    const { storeId, amount, appliesTo } = input;

    const store = await this.commissionRepository.findStoreWithSubscription(
      storeId,
    );
    const plan = store?.plan ?? 'FREE';

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

  private calculateAmount(
    amount: number,
    plan: string,
    customFee?: { type?: string; value?: number; isActive?: boolean; minAmount?: number; maxAmount?: number } | null,
  ): number {
    if (customFee?.isActive && customFee?.type && customFee?.value != null) {
      return this.calculateWithCustomFee(amount, {
        type: customFee.type,
        value: customFee.value,
        minAmount: customFee.minAmount,
        maxAmount: customFee.maxAmount,
      });
    }

    const rate = CommissionPolicy.getDefaultRate(plan as 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE');
    const commission = CommissionPolicy.calculatePercentage(amount, rate);

    return Math.round(commission * 100) / 100;
  }

  private calculateWithCustomFee(
    amount: number,
    fee: { type: string; value: number; minAmount?: number; maxAmount?: number },
  ): number {
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
