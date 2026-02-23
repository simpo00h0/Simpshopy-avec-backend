/**
 * Lecture rapide de la session Supabase depuis localStorage (~0.2ms vs ~50ms pour getSession).
 * Workaround pour le bug connu: https://github.com/supabase/supabase-js/issues/970
 * Utilisé pour l'affichage optimiste du dashboard pendant la validation complète.
 */
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

function getStorageKey(): string {
  try {
    const hostname = new URL(supabaseUrl || 'https://x.supabase.co').hostname;
    const projectRef = hostname.split('.')[0] ?? 'unknown';
    return `sb-${projectRef}-auth-token`;
  } catch {
    return 'sb-unknown-auth-token';
  }
}

/**
 * Lit la session depuis localStorage de façon synchrone.
 * Retourne null si pas de session ou si le JWT est expiré (marge 60s).
 */
export function getFastSessionSync(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const key = getStorageKey();
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const data = JSON.parse(raw) as { currentSession?: Session; expires_at?: number } | Session;
    const session =
      (data as { currentSession?: Session }).currentSession ?? (data as Session);
    if (!session?.access_token) return null;
    const exp =
      session.expires_at ?? (data as { expires_at?: number }).expires_at;
    if (typeof exp === 'number' && exp * 1000 < Date.now() + 60_000) return null;
    return session as Session;
  } catch {
    return null;
  }
}

/**
 * Vérifie rapidement si une session semble valide (pour affichage optimiste).
 */
export function hasFastSession(): boolean {
  return getFastSessionSync() !== null;
}
