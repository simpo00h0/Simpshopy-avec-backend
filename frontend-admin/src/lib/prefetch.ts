import { QueryClient } from '@tanstack/react-query';
import { api } from './api';

export function prefetchDashboardStats(queryClient: QueryClient) {
  queryClient.prefetchQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [p, o, w, c] = await Promise.all([
        api.get<unknown[]>('/products').catch(() => ({ data: [] })),
        api.get<unknown[]>('/orders').catch(() => ({ data: [] })),
        api.get<{ balance: number }>('/wallet/balance').catch(() => ({ data: { balance: 0 } })),
        api.get<unknown[]>('/stores/customers').catch(() => ({ data: [] })),
      ]);
      return {
        products: ((p.data || []) as unknown[]).length,
        orders: ((o.data || []) as unknown[]).length,
        revenue: w.data?.balance ?? 0,
        customers: ((c.data || []) as unknown[]).length,
      };
    },
  });
}

export function prefetchProducts(queryClient: QueryClient) {
  queryClient.prefetchQuery({
    queryKey: ['products'],
    queryFn: () => api.get<unknown[]>('/products').then((r) => r.data || []),
    staleTime: 30_000,
  });
}

export function prefetchOrders(queryClient: QueryClient) {
  queryClient.prefetchQuery({
    queryKey: ['orders', null],
    queryFn: () => api.get<unknown[]>('/orders').then((r) => r.data || []),
    staleTime: 30_000,
  });
}

export function prefetchCustomers(queryClient: QueryClient) {
  queryClient.prefetchQuery({
    queryKey: ['customers'],
    queryFn: () => api.get<unknown[]>('/stores/customers').then((r) => r.data || []),
    staleTime: 30_000,
  });
}

export function prefetchStores(queryClient: QueryClient) {
  queryClient.prefetchQuery({ queryKey: ['stores'], queryFn: () => api.get('/stores').then((r) => r.data) });
}
