import { supabase } from './supabase';
import { api, primeTokenCache } from './api';
import { reportError } from './error-handler';

export interface SignInResult {
  success: boolean;
  user?: unknown;
  hasStores?: boolean;
}

export interface SignUpResult {
  success: boolean;
  user?: unknown;
  needsEmailConfirmation?: boolean;
  accountExists?: boolean;
}

export interface ResetPasswordResult {
  success: boolean;
}

export async function signIn(email: string, password: string): Promise<SignInResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!data.session) throw new Error('Session non créée');
    if (data.session.access_token) primeTokenCache(data.session.access_token);

    const [userRes, storesRes] = await Promise.all([
      api.get('/auth/me'),
      api.get<unknown[]>('/stores', { skipErrorNotification: true }).catch(() => ({ data: [] })),
    ]);

    return {
      success: true,
      user: userRes.data,
      hasStores: Array.isArray(storesRes.data) && storesRes.data.length > 0,
    };
  } catch (err) {
    reportError(err, { context: 'auth.signIn' });
    return { success: false };
  }
}

export async function signUp(params: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}): Promise<SignUpResult> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: {
          firstName: params.firstName,
          lastName: params.lastName,
          ...(params.phone && { phone: params.phone }),
        },
        emailRedirectTo:
          typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
      },
    });
    if (error) throw error;

    if (data.user && !data.user.identities?.length) {
      return { success: false, accountExists: true };
    }

    if (data.session) {
      if (data.session.access_token) primeTokenCache(data.session.access_token);
      const { data: userData } = await api.get('/auth/me');
      return { success: true, user: userData };
    }

    return { success: true, needsEmailConfirmation: true };
  } catch (err) {
    reportError(err, { context: 'auth.signUp' });
    return { success: false };
  }
}

export async function resetPassword(email: string): Promise<ResetPasswordResult> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined,
    });
    if (error) throw error;
    return { success: true };
  } catch (err) {
    reportError(err, { context: 'auth.resetPassword' });
    return { success: false };
  }
}

export async function fetchAuthMe(): Promise<{ user: unknown | null }> {
  try {
    const { data } = await api.get('/auth/me', { skipErrorNotification: true });
    return { user: data ?? null };
  } catch {
    return { user: null };
  }
}

export async function updatePassword(newPassword: string): Promise<ResetPasswordResult> {
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return { success: true };
  } catch (err) {
    reportError(err, { context: 'auth.updatePassword' });
    return { success: false };
  }
}
