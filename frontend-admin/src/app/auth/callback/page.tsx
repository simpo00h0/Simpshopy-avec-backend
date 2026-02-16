'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Text, Loader, Stack } from '@mantine/core';
import { supabase } from '@/lib/supabase';
import { useAuthStore, type User } from '@/stores/authStore';
import { primeTokenCache } from '@/lib/api';
import { fetchAuthMe } from '@/lib/auth-service';

/**
 * Page de callback après confirmation d'email Supabase.
 * Supabase redirige ici avec les tokens dans l'URL.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handle = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        setError(sessionError.message);
        setTimeout(() => router.replace('/login'), 3000);
        return;
      }
      if (session) {
        if (session.access_token) primeTokenCache(session.access_token);
        const { user } = await fetchAuthMe();
        if (user) setUser(user as User);
        router.replace('/onboarding');
      } else {
        router.replace('/login');
      }
    };
    handle();
  }, [router, setUser]);

  if (error) {
    return (
      <Container size="sm" py={60}>
        <Stack align="center" gap="md">
          <Text c="red">{error}</Text>
          <Text size="sm" c="dimmed">Redirection vers la connexion...</Text>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="sm" py={60}>
      <Stack align="center" gap="md">
        <Loader size="lg" />
        <Text c="dimmed">Connexion en cours...</Text>
      </Stack>
    </Container>
  );
}
