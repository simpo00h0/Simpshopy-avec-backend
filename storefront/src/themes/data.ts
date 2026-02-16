export type { ThemeConfig, MockProduct } from './theme-types';
import type { ThemeConfig } from './theme-types';
import { themesPart1 } from './themes-data-part1';
import { themesPart2 } from './themes-data-part2';
import { themesPart3 } from './themes-data-part3';

export const themesData: Record<string, ThemeConfig> = {
  ...themesPart1,
  ...themesPart2,
  ...themesPart3,
};
