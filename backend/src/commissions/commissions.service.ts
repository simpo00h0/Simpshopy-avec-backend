import { Injectable } from '@nestjs/common';
import { CalculateCommissionUseCase } from './application/calculate-commission.usecase';
import { CalculateCommissionInput } from './application/calculate-commission.usecase';

@Injectable()
export class CommissionsService {
  constructor(
    private calculateCommissionUseCase: CalculateCommissionUseCase,
  ) {}

  async calculateCommission(
    input: CalculateCommissionInput,
  ): Promise<{ amount: number; percentage?: number; type: string; plan: string }> {
    return this.calculateCommissionUseCase.execute(input);
  }
}
