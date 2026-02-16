import { QueryClient } from '@tanstack/react-query';
import type { Product, Order } from '@simpshopy/shared';
import { api } from './api';

const STALE_TIME = 30_000;

async function fetchCoreData() {
  const [p, o, w, c, t] = await Promise.all([
    api.get<Product[]>('/products').catch(() => ({ data: [] })),
    api.get<Order[]>('/orders').catch(() => ({ data: [] })),
    api.get<{ balance: number }>('/wallet/balance').catch(() => ({ data: { balance: 0 } })),
    api.get<unknown[]>('/stores/customers').catch(() => ({ data: [] })),
    api.get<unknown[]>('/wallet/transactions', { params: { limit: 20 } }).catch(() => ({ data: [] })),
  ]);
  const products = p.data || [];
  const orders = o.data || [];
  const customers = c.data || [];
  return {
    products,
    orders,
    customers,
    balance: w.data?.balance ?? 0,
    transactions: t.data || [],
  };
}

export interface DashboardStats {
  products: number;
  orders: number;
  revenue: number;
  customers: number;
}

/** Fonction partagée pour fetch des stats dashboard (utilisée par useQuery sur la page dashboard). */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const core = await fetchCoreData();
  return {
    products: core.products.length,
    orders: core.orders.length,
    revenue: core.balance,
    customers: core.customers.length,
  };
}

/** Prefetch dashboard stats + products, orders, customers, wallet en un seul batch. */
export function prefetchDashboardStats(queryClient: QueryClient) {
  queryClient.prefetchQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { products, orders, customers, balance, transactions } = await fetchCoreData();
      queryClient.setQueryData(['products'], products);
      queryClient.setQueryData(['orders', null], orders);
      queryClient.setQueryData(['customers'], customers);
      queryClient.setQueryData(['wallet'], { balance, transactions });
      return {
        products: products.length,
        orders: orders.length,
        revenue: balance,
        customers: customers.length,
      };
    },
    staleTime: STALE_TIME,
  });
}

/** Prefetch complet au chargement du dashboard (alias de prefetchDashboardStats). */
export function prefetchAll(queryClient: QueryClient) {
  prefetchDashboardStats(queryClient);
}

export function prefetchProducts(queryClient: QueryClient) {
  queryClient.prefetchQuery({
    queryKey: ['products'],
    queryFn: () => api.get<Product[]>('/products').then((r) => r.data || []),
    staleTime: STALE_TIME,
  });
}

export function prefetchOrders(queryClient: QueryClient) {
  queryClient.prefetchQuery({
    queryKey: ['orders', null],
    queryFn: () => api.get<Order[]>('/orders').then((r) => r.data || []),
    staleTime: STALE_TIME,
  });
}

export function prefetchCustomers(queryClient: QueryClient) {
  queryClient.prefetchQuery({
    queryKey: ['customers'],
    queryFn: () => api.get<unknown[]>('/stores/customers').then((r) => r.data || []),
    staleTime: STALE_TIME,
  });
}

export function prefetchWallet(queryClient: QueryClient) {
  queryClient.prefetchQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const [b, t] = await Promise.all([
        api.get<{ balance: number }>('/wallet/balance'),
        api.get<unknown[]>('/wallet/transactions', { params: { limit: 20 } }),
      ]);
      return { balance: b.data?.balance ?? 0, transactions: t.data || [] };
    },
    staleTime: STALE_TIME,
  });
}
