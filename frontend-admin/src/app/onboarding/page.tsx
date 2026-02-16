'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Container,
  Title,
  Text,
  TextInput,
  Button,
  Stack,
  Paper,
  Group,
  Stepper,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';
import { checkHasStores, createStore } from '@/lib/store-service';

function subdomainFromName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'ma-boutique';
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [step, setStep] = useState(0);

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      city: 'Dakar',
      country: 'SN',
    },
    validate: {
      name: (v: string) => (!v || v.length < 2 ? 'Nom de la boutique requis (2 caractères min)' : null),
      email: (v: string) => (!v ? 'Email requis' : /^\S+@\S+$/.test(v) ? null : 'Email invalide'),
      phone: (v: string) => (!v ? 'Téléphone requis' : /^\+?[1-9]\d{1,14}$/.test(v) ? null : 'Format invalide (ex: +221771234567)'),
    },
  });

  const generatedSubdomain = form.values.name ? subdomainFromName(form.values.name) : '';

  useEffect(() => {
    const run = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setHasSession(false);
        setChecking(false);
        router.replace('/login');
        return;
      }
      setHasSession(true);
      const { hasStores } = await checkHasStores();
      if (hasStores) {
        router.replace('/dashboard');
        return;
      }
      setChecking(false);
    };
    run();
  }, [router]);

  useEffect(() => {
    if (user?.email && !form.values.email) {
      form.setFieldValue('email', user.email);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- on ne réagit qu'à user.email
  }, [user?.email]);

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    const result = await createStore({
      name: values.name,
      email: values.email,
      phone: values.phone,
      city: values.city,
      country: values.country,
    });
    setLoading(false);

    if (!result.success) return;

    notifications.show({ title: 'Boutique créée !', message: 'Votre boutique a été créée avec succès.', color: 'green' });
    router.push('/dashboard');
  };

  if (checking || !hasSession) {
    return (
      <Container size={420} py={60}>
        <Stack align="center" gap="md">
          <Text c="dimmed">Chargement...</Text>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size={520} py={60}>
      <Stack gap="xl">
        <Stack gap={4} ta="center">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Title order={2} c="green.7">
              Simpshopy
            </Title>
          </Link>
          <Title order={3}>Créez votre boutique</Title>
          <Text c="dimmed" size="sm">
            Quelques étapes pour démarrer. Vous pourrez tout modifier plus tard.
          </Text>
        </Stack>

        <Stepper active={step} onStepClick={setStep} size="sm">
          <Stepper.Step label="Nom de la boutique" description="Identité">
            <Paper p="xl" withBorder mt="md" radius="md">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const valid = form.validateField('name');
                  if (!valid.hasError) setStep(1);
                }}
              >
                <Stack gap="md">
                  <TextInput
                    label="Nom de votre boutique"
                    placeholder="Ma Boutique Africaine"
                    {...form.getInputProps('name')}
                  />
                  <Box>
                    <Text size="sm" fw={500} mb={4}>
                      Votre boutique sera accessible à
                    </Text>
                    <Text size="sm" c="dimmed">
                      {(generatedSubdomain || 'ma-boutique')}.simpshopy.com
                    </Text>
                    <Text size="xs" c="dimmed" mt={4}>
                      Généré automatiquement à partir du nom (comme Shopify)
                    </Text>
                  </Box>
                  <Button type="submit" color="green" fullWidth>
                    Continuer
                  </Button>
                </Stack>
              </form>
            </Paper>
          </Stepper.Step>
          <Stepper.Step label="Contact" description="Coordonnées">
            <Paper p="xl" withBorder mt="md" radius="md">
              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                  <TextInput
                    label="Email de contact"
                    placeholder="contact@maboutique.sn"
                    {...form.getInputProps('email')}
                  />
                  <TextInput
                    label="Téléphone"
                    placeholder="+221771234567"
                    {...form.getInputProps('phone')}
                  />
                  <TextInput label="Ville" placeholder="Dakar" {...form.getInputProps('city')} />
                  <TextInput label="Pays (code)" placeholder="SN" {...form.getInputProps('country')} />
                  <Group justify="space-between">
                    <Button variant="subtle" onClick={() => setStep(0)}>
                      Retour
                    </Button>
                    <Button type="submit" color="green" loading={loading}>
                      Créer ma boutique
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Paper>
          </Stepper.Step>
        </Stepper>

        <Group justify="center" gap="xs">
          <Link href="/dashboard">
            <Text size="sm" c="dimmed" component="span">
              J&apos;ai déjà une boutique
            </Text>
          </Link>
        </Group>
      </Stack>
    </Container>
  );
}
