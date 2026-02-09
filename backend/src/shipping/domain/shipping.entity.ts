export interface ShippingZone {
  id: string;
  storeId: string;
  name: string;
  countries: string[];
  cities: string[];
  regions: string[];
  isActive: boolean;
}

export interface ShippingMethod {
  id: string;
  zoneId: string;
  name: string;
  price: number;
  currency: string;
  minDays: number;
  maxDays: number;
  delay?: string;
  minWeight?: number;
  maxWeight?: number;
  isActive: boolean;
}

export interface CalculateShippingInput {
  storeId: string;
  country: string;
  city?: string;
  weight?: number;
}

export interface ShippingQuote {
  method: ShippingMethod;
  price: number;
  currency: string;
  estimatedDays: string;
}
