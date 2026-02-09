import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  IShippingRepository,
} from '../domain/shipping.repository';
import { ShippingZone, ShippingMethod } from '../domain/shipping.entity';

@Injectable()
export class ShippingRepository implements IShippingRepository {
  constructor(private prisma: PrismaService) {}

  async findZonesByStoreId(storeId: string): Promise<ShippingZone[]> {
    const zones = await this.prisma.shippingZone.findMany({
      where: {
        storeId,
        isActive: true,
      },
    });

    return zones.map((z) => this.mapZoneToEntity(z));
  }

  async findMethodsByZoneId(zoneId: string): Promise<ShippingMethod[]> {
    const methods = await this.prisma.shippingMethod.findMany({
      where: {
        zoneId,
        isActive: true,
      },
    });

    return methods.map((m) => this.mapMethodToEntity(m));
  }

  private mapZoneToEntity(zone: any): ShippingZone {
    return {
      id: zone.id,
      storeId: zone.storeId,
      name: zone.name,
      countries: zone.countries,
      cities: zone.cities,
      regions: zone.regions || [],
      isActive: zone.isActive,
    };
  }

  private mapMethodToEntity(method: any): ShippingMethod {
    return {
      id: method.id,
      zoneId: method.zoneId,
      name: method.name,
      price: method.price,
      currency: method.currency,
      minDays: method.minDays,
      maxDays: method.maxDays,
      delay: method.delay ?? undefined,
      minWeight: method.minWeight ?? undefined,
      maxWeight: method.maxWeight ?? undefined,
      isActive: method.isActive,
    };
  }
}
