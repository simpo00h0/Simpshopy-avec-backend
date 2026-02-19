import type { ThemeCustomization } from '@simpshopy/shared';

export interface StoreWithTheme {
  id: string;
  name: string;
  subdomain: string;
  email?: string;
  status?: string;
  settings?: { themeCustomization?: ThemeCustomization | null } | null;
}

export interface SaveThemeCustomizationOptions {
  partial?: boolean;
}

export interface IStoreSettingsRepository {
  getStoreWithTheme(storeId: string): Promise<StoreWithTheme>;
  saveThemeCustomization(
    storeId: string,
    customization: ThemeCustomization | Partial<ThemeCustomization>,
    options?: SaveThemeCustomizationOptions
  ): Promise<StoreWithTheme | undefined>;
}
