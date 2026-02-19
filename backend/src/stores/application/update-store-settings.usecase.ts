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
    const row = await this.storeRepository.findByIdForSettingsUpdate(id);
    if (!row || row.ownerId !== ownerId) {
      throw new ForbiddenException('Accès non autorisé');
    }

    let themeCustomizationData: object | undefined;
    if (data.themeCustomization != null) {
      themeCustomizationData = data.partial
        ? this.deepMerge(
            (row.themeCustomization as Record<string, unknown>) ?? {},
            data.themeCustomization as Record<string, unknown>,
          )
        : (data.themeCustomization as object);
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
      id: row.id,
      name: row.name,
      subdomain: row.subdomain,
      email: row.email,
      status: row.status,
      settings: {
        themeId: updatedSettings.themeId,
        themeCustomization: updatedSettings.themeCustomization,
      },
    };
  }
}
