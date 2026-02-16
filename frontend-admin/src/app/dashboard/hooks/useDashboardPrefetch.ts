'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { prefetchAll } from '@/lib/prefetch';

const DASHBOARD_ROUTES = [
  '/dashboard',
  '/dashboard/boutique',
  '/dashboard/boutique/editor',
  '/dashboard/themes',
  '/dashboard/orders',
  '/dashboard/products',
  '/dashboard/customers',
  '/dashboard/settings',
  '/dashboard/discounts',
  '/dashboard/analytics',
  '/dashboard/wallet',
] as const;

export function useDashboardPrefetch(hasSession: boolean, hasStore: boolean): void {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (hasSession !== true) return;
    DASHBOARD_ROUTES.forEach((r) => router.prefetch(r));
  }, [hasSession, router]);

  useEffect(() => {
    if (hasStore !== true) return;
    prefetchAll(queryClient);
  }, [hasStore, queryClient]);
}
