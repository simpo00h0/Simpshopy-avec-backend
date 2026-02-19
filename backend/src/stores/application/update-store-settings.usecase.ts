import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import {
  IStoreRepository,
  UpdateStoreSettingsData,
} from '../domain/store.repository';

export interface StoreSettingsUpdateResult {
  id: string;
  name: string;
  subdomain: string;
  email: string;
  status: string;
  settings: { themeId: string | null; themeCustomization: object | null };
}

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
    data: UpdateStoreSettingsData & { partial?: boolean },
  ): Promise<StoreSettingsUpdateResult> {
    let themeCustomizationData: object | undefined;
    let store: { id: string; name: string; subdomain: string; email: string; status: string; ownerId: string } | null;

    if (data.themeCustomization != null && data.partial) {
      const row = await this.storeRepository.findByIdForSettingsUpdate(id);
      if (!row || row.ownerId !== ownerId) {
        throw new ForbiddenException('Accès non autorisé');
      }
      store = row;
      themeCustomizationData = this.deepMerge(
        (row.themeCustomization as Record<string, unknown>) ?? {},
        data.themeCustomization as Record<string, unknown>,
      );
    } else {
      store = await this.storeRepository.findByIdMinimal(id);
      if (!store || store.ownerId !== ownerId) {
        throw new ForbiddenException('Accès non autorisé');
      }
      if (data.themeCustomization != null) {
        themeCustomizationData = data.themeCustomization as object;
      }
    }

    const { partial: _partial, themeCustomization: _tc, ...rest } =
      data as UpdateStoreSettingsData & { partial?: boolean };
    const settingsData: UpdateStoreSettingsData = {
      ...rest,
      ...(themeCustomizationData && {
        themeCustomization: themeCustomizationData,
      }),
    };

    const updatedSettings =
      await this.storeRepository.updateSettings(id, settingsData);

    return {
      id: store.id,
      name: store.name,
      subdomain: store.subdomain,
      email: store.email,
      status: store.status,
      settings: {
        themeId: updatedSettings.themeId,
        themeCustomization: updatedSettings.themeCustomization,
      },
    };
  }
}
