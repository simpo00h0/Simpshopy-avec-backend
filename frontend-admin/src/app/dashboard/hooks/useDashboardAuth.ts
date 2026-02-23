'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { primeTokenCache } from '@/lib/api';
import { useAuthStore, type User } from '@/stores/authStore';
import { useStoreStore, type Store } from '@/stores/storeStore';
import { fetchDashboardAuth } from '@/lib/dashboard-auth-service';
import { reportError } from '@/lib/error-handler';
import { getFastSessionSync } from '@/lib/fast-session';

type AuthState = {
  hasSession: boolean | null;
  hasStore: boolean | null;
};

export function useDashboardAuth(): AuthState {
  const router = useRouter();
  const { logout, setUser } = useAuthStore();
  const [state, setState] = useState<AuthState>({ hasSession: null, hasStore: null });

  useEffect(() => {
    const fast = getFastSessionSync();
    if (fast) setState((s) => ({ ...s, hasSession: true }));

    const run = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setState({ hasSession: false, hasStore: null });
        router.replace('/login');
        return;
      }
      if (session.access_token) primeTokenCache(session.access_token);
      setState({ hasSession: true, hasStore: null });

      const result = await fetchDashboardAuth();
      queueMicrotask(() => {
        if (result.user) setUser(result.user as User);
        setState((s) => ({ ...s, hasStore: result.hasStore }));
        if (result.store) useStoreStore.getState().setCurrentStore(result.store as Store);
      });
    };
    run().catch((err) => {
      reportError(err, { showNotification: false, context: 'useDashboardAuth' });
      supabase.auth.signOut();
      logout();
      setState({ hasSession: false, hasStore: null });
      router.replace('/login');
    });
  }, [router, logout, setUser]);

  useEffect(() => {
    if (state.hasStore === false) router.replace('/onboarding');
  }, [state.hasStore, router]);

  return state;
}
