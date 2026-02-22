'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container, Title, Text, TextInput, Button, Stack, Paper, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { resetPassword } from '@/lib/auth-service';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useForm({
    initialValues: { email: '' },
    validate: {
      email: (v) => (!v ? 'Email requis' : /^\S+@\S+$/.test(v) ? null : 'Email invalide'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    const result = await resetPassword(values.email);
    setLoading(false);

    if (!result.success) return;

    setSent(true);
    notifications.show({
      title: 'Email envoyé',
      message: 'Vérifiez votre boîte de réception pour réinitialiser votre mot de passe.',
      color: 'green',
    });
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
          <Title order={4}>Mot de passe oublié</Title>
          <Text c="dimmed" size="sm">
            Entrez votre email pour recevoir un lien de réinitialisation
          </Text>
        </Stack>
        <Paper p="xl" withBorder shadow="sm" radius="md">
          {sent ? (
            <Stack gap="md">
              <Text c="dimmed" ta="center">
                Un email a été envoyé à {form.values.email}. Cliquez sur le lien pour réinitialiser votre mot de passe.
              </Text>
              <Link href="/login" style={{ textDecoration: 'none', width: '100%' }}>
                <Button fullWidth>Retour à la connexion</Button>
              </Link>
            </Stack>
          ) : (
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="md">
                <TextInput
                  label="Email"
                  placeholder="vous@exemple.com"
                  {...form.getInputProps('email')}
                />
                <Button type="submit" color="green" fullWidth loading={loading}>
                  Envoyer le lien
                </Button>
              </Stack>
            </form>
          )}
        </Paper>
        <Group justify="center" gap="xs">
          <Link href="/login">
            <Text size="sm" c="green.7" fw={500} component="span">
              Retour à la connexion
            </Text>
          </Link>
        </Group>
      </Stack>
    </Container>
  );
}
