import { SubscriptionPlan } from '@prisma/client';

export class CommissionPolicy {
  private static readonly FREE_RATE = 0.05; // 5%
  private static readonly STARTER_RATE = 0.015; // 1.5%
  private static readonly PRO_RATE = 0; // 0%

  static getDefaultRate(plan: SubscriptionPlan): number {
    switch (plan) {
      case 'FREE':
        return this.FREE_RATE;
      case 'STARTER':
        return this.STARTER_RATE;
      case 'PRO':
        return this.PRO_RATE;
      case 'ENTERPRISE':
        return 0;
      default:
        return this.FREE_RATE;
    }
  }

  static calculatePercentage(amount: number, rate: number): number {
    return amount * rate;
  }

  static calculateFixed(amount: number, fixedValue: number): number {
    return fixedValue;
  }

  static applyLimits(
    commission: number,
    minAmount?: number,
    maxAmount?: number,
  ): number {
    if (minAmount !== null && commission < minAmount) {
      return minAmount;
    }
    if (maxAmount !== null && commission > maxAmount) {
      return maxAmount;
    }
    return commission;
  }
}
