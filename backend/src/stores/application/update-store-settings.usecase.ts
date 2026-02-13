import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import {
  IStoreRepository,
  UpdateStoreSettingsData,
} from '../domain/store.repository';
import { Store } from '../domain/store.entity';

@Injectable()
export class UpdateStoreSettingsUseCase {
  constructor(
    @Inject('IStoreRepository')
    private storeRepository: IStoreRepository,
  ) {}

  private deepMerge(
    target: Record<string, unknown> | null,
    source: Record<string, unknown>,
  ): Record<string, unknown> {
    if (!target || typeof target !== 'object') return { ...source };
    const result = { ...target };
    for (const key of Object.keys(source)) {
      const val = source[key];
      const tgt = target[key];
      if (
        val != null &&
        typeof val === 'object' &&
        !Array.isArray(val) &&
        tgt != null &&
        typeof tgt === 'object' &&
        !Array.isArray(tgt)
      ) {
        result[key] = this.deepMerge(
          tgt as Record<string, unknown>,
          val as Record<string, unknown>,
        );
      } else if (val !== undefined) {
        result[key] = val;
      }
    }
    return result;
  }

  async execute(
    id: string,
    ownerId: string,
    data: UpdateStoreSettingsData,
  ): Promise<Store> {
    const store = await this.storeRepository.findById(id);
    if (!store || store.ownerId !== ownerId) {
      throw new ForbiddenException('Accès non autorisé');
    }

    let themeCustomizationData: object | undefined;
    if (data.themeCustomization != null && store.settings) {
      const existing = (store.settings as { themeCustomization?: object })
        .themeCustomization as Record<string, unknown> | null;
      themeCustomizationData = this.deepMerge(
        existing ?? {},
        data.themeCustomization as Record<string, unknown>,
      );
    }

    const settingsData: UpdateStoreSettingsData = { ...data };
    if (themeCustomizationData) {
      settingsData.themeCustomization = themeCustomizationData;
    }

    await this.storeRepository.updateSettings(id, settingsData);

    const updated = await this.storeRepository.findById(id);
    if (!updated) throw new ForbiddenException('Boutique introuvable');
    return updated;
  }
}
