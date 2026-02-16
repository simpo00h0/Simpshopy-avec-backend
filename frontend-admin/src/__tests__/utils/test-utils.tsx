import { MantineProvider } from '@mantine/core';
import { ReactElement } from 'react';

export function AllTheProviders({ children }: { children: React.ReactNode }): ReactElement {
  return <MantineProvider>{children}</MantineProvider>;
}
