import { Injectable, Inject } from '@nestjs/common';
import {
  IShippingRepository,
} from '../domain/shipping.repository';
import {
  CalculateShippingInput,
  ShippingQuote,
} from '../domain/shipping.entity';
import { ShippingPolicy } from '../domain/shipping.policy';

@Injectable()
export class CalculateShippingUseCase {
  constructor(
    @Inject('IShippingRepository')
    private shippingRepository: IShippingRepository,
  ) {}

  async execute(input: CalculateShippingInput): Promise<ShippingQuote[]> {
    const zones = await this.shippingRepository.findZonesByStoreId(
      input.storeId,
    );

    const matchingZone = this.findMatchingZone(
      zones,
      input.country,
      input.city,
    );

    if (!matchingZone) {
      return [];
    }

    const methods = await this.shippingRepository.findMethodsByZoneId(
      matchingZone.id,
    );

    const availableMethods = this.filterByWeight(methods, input.weight);

    return availableMethods.map((method) => this.createQuote(method));
  }

  private findMatchingZone(
    zones: any[],
    country: string,
    city?: string,
  ): any | null {
    return zones.find((zone) =>
      ShippingPolicy.matchesZone(zone, country, city),
    ) || null;
  }

  private filterByWeight(methods: any[], weight?: number): any[] {
    return methods.filter((method) =>
      ShippingPolicy.matchesWeight(method, weight),
    );
  }

  private createQuote(method: any): ShippingQuote {
    return {
      method,
      price: method.price,
      currency: method.currency,
      estimatedDays: ShippingPolicy.formatDelay(
        method.minDays,
        method.maxDays,
      ),
    };
  }
}
