import { Injectable } from '@nestjs/common';
import { CalculateShippingUseCase } from './application/calculate-shipping.usecase';
import { CalculateShippingInput, ShippingQuote } from './domain/shipping.entity';

@Injectable()
export class ShippingService {
  constructor(
    private calculateShippingUseCase: CalculateShippingUseCase,
  ) {}

  async calculateShipping(
    input: CalculateShippingInput,
  ): Promise<ShippingQuote[]> {
    return this.calculateShippingUseCase.execute(input);
  }
}
