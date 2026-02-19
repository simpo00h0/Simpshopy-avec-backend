'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { primeTokenCache } from '@/lib/api';

/**
 * Prime le cache du token JWT au chargement de l'app pour éviter
 * getSession() à chaque requête API (économie de ~100-300ms par requête).
 */
export function TokenCachePrimer() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) primeTokenCache(session.access_token);
    });
  }, []);
  return null;
}
