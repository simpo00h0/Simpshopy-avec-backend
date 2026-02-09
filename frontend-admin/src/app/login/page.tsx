'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container, Title, Text, TextInput, PasswordInput, Button, Stack, Paper, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';
import { api, primeTokenCache } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // Redirection si déjà connecté : aller au dashboard (qui redirigera vers onboarding si pas de boutique)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/dashboard');
      }
    });
  }, [router]);

  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (v) => (!v ? 'Email requis' : /^\S+@\S+$/.test(v) ? null : 'Email invalide'),
      password: (v) => (!v ? 'Mot de passe requis' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) throw error;
      if (!authData.session) throw new Error('Session non créée');
      if (authData.session.access_token) primeTokenCache(authData.session.access_token);

      const [userRes, storesRes] = await Promise.all([
        api.get('/auth/me'),
        api.get<unknown[]>('/stores').catch(() => ({ data: [] })),
      ]);
      setUser(userRes.data);
      const hasStores = Array.isArray(storesRes.data) && storesRes.data.length > 0;

      notifications.show({ title: 'Connexion réussie', message: 'Bienvenue.', color: 'green' });
      router.push(hasStores ? '/dashboard' : '/onboarding');
    } catch (err: unknown) {
      const msg =
        (err as { message?: string })?.message ||
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Erreur de connexion';
      notifications.show({ title: 'Erreur', message: msg, color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} py={60}>
      <Stack gap="xl">
        <Stack gap={4} ta="center">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Title order={2} c="green.7">
              Simpshopy
            </Title>
          </Link>
          <Text c="dimmed">Connectez-vous à votre compte</Text>
        </Stack>
        <Paper p="xl" withBorder shadow="sm" radius="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="vous@exemple.com"
                {...form.getInputProps('email')}
              />
              <PasswordInput
                label="Mot de passe"
                placeholder="Votre mot de passe"
                {...form.getInputProps('password')}
              />
              <Group justify="flex-end">
                <Link href="/forgot-password">
                  <Text size="sm" c="green.7" component="span">
                    Mot de passe oublié ?
                  </Text>
                </Link>
              </Group>
              <Button type="submit" color="green" fullWidth loading={loading}>
                Se connecter
              </Button>
            </Stack>
          </form>
        </Paper>
        <Group justify="center" gap="xs">
          <Text size="sm" c="dimmed">
            Pas encore de compte ?
          </Text>
          <Link href="/signup">
            <Text size="sm" c="green.7" fw={500} component="span">
              S&apos;inscrire
            </Text>
          </Link>
        </Group>
      </Stack>
    </Container>
  );
}
