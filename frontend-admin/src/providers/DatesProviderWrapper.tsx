'use client';

import 'dayjs/locale/fr';
import { DatesProvider } from '@mantine/dates';

export function DatesProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <DatesProvider settings={{ locale: 'fr', firstDayOfWeek: 1 }}>
      {children}
    </DatesProvider>
  );
}
