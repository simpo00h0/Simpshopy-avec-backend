'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container, Title, Text, PasswordInput, Button, Stack, Paper } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import { updatePassword } from '@/lib/auth-service';

/**
 * Page de réinitialisation du mot de passe.
 * Supabase redirige ici après clic sur le lien email.
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: { password: '' },
    validate: {
      password: (v) => (!v || v.length < 8 ? 'Minimum 8 caractères' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    const result = await updatePassword(values.password);
    setLoading(false);

    if (!result.success) return;

    notifications.show({ title: 'Mot de passe mis à jour', message: '', color: 'green' });
    router.push('/login');
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
          <Title order={4}>Nouveau mot de passe</Title>
          <Text c="dimmed" size="sm">
            Choisissez un nouveau mot de passe sécurisé
          </Text>
        </Stack>
        <Paper p="xl" withBorder shadow="sm" radius="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <PasswordInput
                label="Nouveau mot de passe"
                placeholder="Min. 8 caractères"
                {...form.getInputProps('password')}
              />
              <Button type="submit" color="green" fullWidth loading={loading}>
                Enregistrer
              </Button>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </Container>
  );
}
