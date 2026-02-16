'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Container,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Paper,
  Group,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useAuthStore, type User } from '@/stores/authStore';
import { signUp } from '@/lib/auth-service';

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      phone: '',
    },
    validate: {
      email: (v: string) => (!v ? 'Email requis' : /^\S+@\S+$/.test(v) ? null : 'Email invalide'),
      firstName: (v: string) => (!v || v.length < 2 ? 'Prénom requis (2 caractères min)' : null),
      lastName: (v: string) => (!v || v.length < 2 ? 'Nom requis (2 caractères min)' : null),
      password: (v: string) => (!v || v.length < 8 ? 'Mot de passe requis (8 caractères min)' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    const result = await signUp({
      email: values.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone || undefined,
    });
    setLoading(false);

    if (!result.success) return;

    if (result.accountExists) {
      notifications.show({
        title: 'Compte existant',
        message: 'Un compte avec cet email existe déjà. Connectez-vous.',
        color: 'yellow',
      });
      router.push('/login');
      return;
    }

    if (result.user) {
      setUser(result.user as User);
      notifications.show({ title: 'Compte créé avec succès', message: '', color: 'green' });
      router.push('/onboarding');
      return;
    }

    notifications.show({
      title: 'Vérifiez votre email',
      message: 'Un lien de confirmation a été envoyé à votre adresse email.',
      color: 'green',
      autoClose: 8000,
    });
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
          <Text c="dimmed">Créez votre compte pour lancer votre boutique</Text>
          <Text size="sm" c="green.7" fw={500}>
            Gratuit pour commencer — sans carte bancaire
          </Text>
        </Stack>
        <Paper p="xl" withBorder shadow="sm" radius="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <Group grow>
                <TextInput
                  label="Prénom"
                  placeholder="Jean"
                  {...form.getInputProps('firstName')}
                />
                <TextInput
                  label="Nom"
                  placeholder="Dupont"
                  {...form.getInputProps('lastName')}
                />
              </Group>
              <TextInput
                label="Email"
                placeholder="vous@exemple.com"
                {...form.getInputProps('email')}
              />
              <TextInput
                label="Téléphone (optionnel)"
                placeholder="+221771234567"
                {...form.getInputProps('phone')}
              />
              <PasswordInput
                label="Mot de passe"
                placeholder="Min. 8 caractères"
                {...form.getInputProps('password')}
              />
              <Button type="submit" color="green" fullWidth loading={loading}>
                Créer mon compte
              </Button>
            </Stack>
          </form>
        </Paper>
        <Group justify="center" gap="xs">
          <Text size="sm" c="dimmed">
            Déjà un compte ?
          </Text>
          <Link href="/login">
            <Text size="sm" c="green.7" fw={500} component="span">
              Se connecter
            </Text>
          </Link>
        </Group>
      </Stack>
    </Container>
  );
}
