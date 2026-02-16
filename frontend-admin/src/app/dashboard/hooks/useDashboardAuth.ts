'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { api, primeTokenCache } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { useStoreStore } from '@/stores/storeStore';

type AuthState = {
  hasSession: boolean | null;
  hasStore: boolean | null;
};

export function useDashboardAuth(): AuthState {
  const router = useRouter();
  const { logout, setUser } = useAuthStore();
  const [state, setState] = useState<AuthState>({ hasSession: null, hasStore: null });

  useEffect(() => {
    const run = async () => {
      let session;
      try {
        const { data } = await supabase.auth.getSession();
        session = data.session;
      } catch {
        await supabase.auth.signOut();
        logout();
        setState({ hasSession: false, hasStore: null });
        router.replace('/login');
        return;
      }
      if (!session) {
        setState({ hasSession: false, hasStore: null });
        router.replace('/login');
        return;
      }
      if (session.access_token) primeTokenCache(session.access_token);
      setState({ hasSession: true, hasStore: null });
      try {
        const [storesRes, meRes] = await Promise.all([
          api.get<{ id: string; name: string; slug: string; email: string; status: string }[]>('/stores'),
          api.get('/auth/me').catch(() => null),
        ]);
        const stores = storesRes.data;
        queueMicrotask(() => {
          if (meRes?.data) setUser(meRes.data);
          const hasStore = stores != null && stores.length > 0;
          setState((s) => ({ ...s, hasStore }));
          if (stores?.length) useStoreStore.getState().setCurrentStore(stores[0]);
        });
      } catch {
        queueMicrotask(() => setState((s) => ({ ...s, hasStore: false })));
      }
    };
    run();
  }, [router, logout, setUser]);

  useEffect(() => {
    if (state.hasStore === false) router.replace('/onboarding');
  }, [state.hasStore, router]);

  return state;
}
