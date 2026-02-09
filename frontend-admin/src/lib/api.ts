import axios from 'axios';
import { supabase } from './supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cache du token pour éviter getSession() à chaque requête (-100–300ms par requête)
let tokenCache: { token: string; expiresAt: number } | null = null;
const CACHE_TTL_MS = 60_000; // 1 minute

function getCachedToken(): string | null {
  if (!tokenCache) return null;
  if (Date.now() >= tokenCache.expiresAt) {
    tokenCache = null;
    return null;
  }
  return tokenCache.token;
}

function setTokenCache(token: string) {
  tokenCache = { token, expiresAt: Date.now() + CACHE_TTL_MS };
}

export function primeTokenCache(token: string) {
  setTokenCache(token);
}

// Mise à jour du cache quand la session change
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.access_token) setTokenCache(session.access_token);
    else tokenCache = null;
  });
}

api.interceptors.request.use(async (config) => {
  if (typeof window === 'undefined') return config;
  let token = getCachedToken();
  if (!token) {
    const { data: { session } } = await supabase.auth.getSession();
    token = session?.access_token ?? null;
    if (token) setTokenCache(token);
  }
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Sur 401, invalider le cache pour forcer un refresh au prochain appel
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) tokenCache = null;
    return Promise.reject(err);
  }
);

export default api;
