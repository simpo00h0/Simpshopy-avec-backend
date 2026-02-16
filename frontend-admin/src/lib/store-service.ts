import { api } from './api';
import { reportError } from './error-handler';

export interface CheckStoresResult {
  hasStores: boolean;
}

export async function checkHasStores(): Promise<CheckStoresResult> {
  try {
    const { data } = await api.get<unknown[]>('/stores', { skipErrorNotification: true });
    return { hasStores: Array.isArray(data) && data.length > 0 };
  } catch {
    return { hasStores: false };
  }
}

export interface LoadStoresResult {
  stores: unknown[];
  first: unknown | null;
}

export async function loadStores(): Promise<LoadStoresResult> {
  try {
    const { data } = await api.get<unknown[]>('/stores', { skipErrorNotification: true });
    const stores = Array.isArray(data) ? data : [];
    return { stores, first: stores[0] ?? null };
  } catch (err) {
    reportError(err, { showNotification: false, context: 'store.load' });
    return { stores: [], first: null };
  }
}

export interface CreateStoreParams {
  name: string;
  slug: string;
  email: string;
  phone: string;
  city: string;
  country: string;
}

export interface CreateStoreResult {
  success: boolean;
}

export async function createStore(params: CreateStoreParams): Promise<CreateStoreResult> {
  try {
    await api.post('/stores', params);
    return { success: true };
  } catch (err) {
    reportError(err, { context: 'store.create' });
    return { success: false };
  }
}
