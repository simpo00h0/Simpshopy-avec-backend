import type { ThemeCustomization } from '@simpshopy/shared';
import type { HOME_BLOCKS, TEMPLATES } from './editor-constants';

export type BlockId = (typeof HOME_BLOCKS)[number]['id'];
export type Template = (typeof TEMPLATES)[number];

export type UpdateFn = <K extends keyof ThemeCustomization>(key: K, value: ThemeCustomization[K]) => void;
export type UpdateNestedFn = <K extends keyof ThemeCustomization>(key: K, subKey: string, value: string | number) => void;

export interface BlockSettingsProps {
  customization: ThemeCustomization;
  update: UpdateFn;
  updateNested: UpdateNestedFn;
}
