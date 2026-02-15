import type { ThemeCustomization } from '@simpshopy/shared';
import { api } from '@/lib/api';
import type { IStoreSettingsRepository, StoreWithTheme } from '../domain/store-settings.port';

export class ApiStoreSettingsRepository implements IStoreSettingsRepository {
  async getStoreWithTheme(storeId: string): Promise<StoreWithTheme> {
    const { data } = await api.get<StoreWithTheme>(`/stores/${storeId}`);
    return data;
  }

  async saveThemeCustomization(
    storeId: string,
    customization: ThemeCustomization
  ): Promise<StoreWithTheme | undefined> {
    const res = await api.patch(`/stores/${storeId}/settings`, { themeCustomization: customization });
    return res.data as StoreWithTheme | undefined;
  }
}

export const defaultStoreSettingsRepository = new ApiStoreSettingsRepository();
