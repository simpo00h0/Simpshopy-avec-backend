import { ShippingZone, ShippingMethod } from './shipping.entity';

export interface IShippingRepository {
  findZonesByStoreId(storeId: string): Promise<ShippingZone[]>;
  findMethodsByZoneId(zoneId: string): Promise<ShippingMethod[]>;
}
