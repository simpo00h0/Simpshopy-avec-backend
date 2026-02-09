export class ShippingPolicy {
  static matchesZone(
    zone: { countries: string[]; cities: string[] },
    country: string,
    city?: string,
  ): boolean {
    const countryMatch = zone.countries.includes(country);

    if (!city) {
      return countryMatch;
    }

    const cityMatch = zone.cities.length === 0 || zone.cities.includes(city);

    return countryMatch && cityMatch;
  }

  static matchesWeight(
    method: { minWeight?: number; maxWeight?: number },
    weight?: number,
  ): boolean {
    if (!weight) {
      return true;
    }

    if (method.minWeight && weight < method.minWeight) {
      return false;
    }

    if (method.maxWeight && weight > method.maxWeight) {
      return false;
    }

    return true;
  }

  static formatDelay(minDays: number, maxDays: number): string {
    if (minDays === maxDays) {
      return `${minDays} jour${minDays > 1 ? 's' : ''}`;
    }

    return `${minDays}-${maxDays} jours`;
  }
}
