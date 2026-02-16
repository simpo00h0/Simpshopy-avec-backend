import { api } from './api';
import { reportError } from './error-handler';

export interface DashboardAuthResult {
  hasStore: boolean;
  user: unknown | null;
  store: unknown | null;
}

export async function fetchDashboardAuth(): Promise<DashboardAuthResult> {
  try {
    const [storesRes, meRes] = await Promise.all([
      api.get<unknown[]>('/stores', { skipErrorNotification: true }),
      api.get('/auth/me', { skipErrorNotification: true }).catch(() => ({ data: null })),
    ]);
    const stores = storesRes.data ?? [];
    const first = Array.isArray(stores) ? stores[0] : null;
    return {
      hasStore: Array.isArray(stores) && stores.length > 0,
      user: meRes?.data ?? null,
      store: first,
    };
  } catch (err) {
    reportError(err, { showNotification: false, context: 'dashboard-auth' });
    return { hasStore: false, user: null, store: null };
  }
}
