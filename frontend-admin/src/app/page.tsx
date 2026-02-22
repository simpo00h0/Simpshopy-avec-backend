import Link from 'next/link';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  ThemeIcon,
  SimpleGrid,
  rem,
  Box,
} from '@mantine/core';
import {
  IconShoppingBag,
  IconWallet,
  IconTruck,
  IconChartBar,
  IconChevronRight,
} from '@tabler/icons-react';
import { LandingFooter } from './landing-sections/LandingFooter';

export default function LandingPage() {
  return (
    <Box>
      {/* Header */}
      <Box
        component="header"
        py="md"
        px="xl"
        style={{
          borderBottom: '1px solid var(--mantine-color-gray-2)',
          position: 'sticky',
          top: 0,
          backgroundColor: 'var(--mantine-color-white)',
          zIndex: 100,
        }}
      >
        <Group justify="space-between" align="center">
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Title order={3} fw={700} c="green.7">
              Simpshopy
            </Title>
          </Link>
          <Group gap="md">
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <Button variant="subtle" color="dark">
                Se connecter
              </Button>
            </Link>
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <Button color="green">
                Démarrer gratuitement
              </Button>
            </Link>
          </Group>
        </Group>
      </Box>

      {/* Hero */}
      <Box
        py={{ base: 60, md: 100 }}
        px="md"
        style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
        }}
      >
        <Container size="lg">
          <Stack align="center" gap="xl" ta="center">
            <Title
              order={1}
              fw={800}
              size={rem(48)}
              lh={1.1}
              maw={800}
              style={{ letterSpacing: '-0.02em' }}
            >
              Vendez en ligne en Afrique de l&apos;Ouest
            </Title>
            <Text size="xl" c="dimmed" maw={600}>
              Créez votre boutique en quelques minutes. Mobile Money, commission réduite,
              tout pour réussir en Zone CFA.
            </Text>
            <Group justify="center" gap="md">
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <Button
                  size="xl"
                  color="green"
                  rightSection={<IconChevronRight size={20} />}
                >
                  Démarrer gratuitement
                </Button>
              </Link>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Button size="xl" variant="light" color="green">
                  Se connecter
                </Button>
              </Link>
            </Group>
          </Stack>
        </Container>
      </Box>

      {/* Offre trial */}
      <Box py={60} px="md" style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
        <Container size="md">
          <Stack align="center" gap="md" ta="center">
            <Title order={2}>Gratuit pour commencer</Title>
            <Text size="lg" c="dimmed" maw={500}>
              Créez votre boutique, ajoutez vos produits. Passez à un plan payant quand vous êtes prêt à vendre.
            </Text>
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <Button size="lg" color="green">
                Démarrer gratuitement
              </Button>
            </Link>
          </Stack>
        </Container>
      </Box>

      {/* 3 étapes - style Shopify */}
      <Box py={80} px="md">
        <Container size="lg">
          <Title order={2} ta="center" mb="xl">
            Lancez-vous en 3 étapes
          </Title>
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
            <Stack align="center" gap="md" ta="center">
              <Box
                w={56}
                h={56}
                style={{
                  borderRadius: '50%',
                  background: 'var(--mantine-color-green-1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text fw={700} size="xl" c="green.7">
                  01
                </Text>
              </Box>
              <Text fw={600}>Créez votre compte</Text>
              <Text size="sm" c="dimmed">
                Inscrivez-vous en 2 minutes, créez votre boutique et personnalisez-la.
              </Text>
            </Stack>
            <Stack align="center" gap="md" ta="center">
              <Box
                w={56}
                h={56}
                style={{
                  borderRadius: '50%',
                  background: 'var(--mantine-color-green-1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text fw={700} size="xl" c="green.7">
                  02
                </Text>
              </Box>
              <Text fw={600}>Ajoutez vos produits</Text>
              <Text size="sm" c="dimmed">
                Photos, descriptions, prix. Votre catalogue en ligne en quelques clics.
              </Text>
            </Stack>
            <Stack align="center" gap="md" ta="center">
              <Box
                w={56}
                h={56}
                style={{
                  borderRadius: '50%',
                  background: 'var(--mantine-color-green-1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text fw={700} size="xl" c="green.7">
                  03
                </Text>
              </Box>
              <Text fw={600}>Configurez les paiements</Text>
              <Text size="sm" c="dimmed">
                Mobile Money, cartes, virement. Recevez vos paiements en XOF.
              </Text>
            </Stack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Features */}
      <Box py={60} px="md" style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
        <Container size="lg">
          <Title order={2} ta="center" mb="xl">
            Tout ce dont vous avez besoin pour vendre
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
            <Stack align="flex-start" gap="xs">
              <ThemeIcon size={48} radius="md" color="green">
                <IconShoppingBag size={28} />
              </ThemeIcon>
              <Text fw={600}>Boutique en ligne</Text>
              <Text size="sm" c="dimmed">
                Créez votre vitrine, ajoutez vos produits, lancez-vous.
              </Text>
            </Stack>
            <Stack align="flex-start" gap="xs">
              <ThemeIcon size={48} radius="md" color="green">
                <IconWallet size={28} />
              </ThemeIcon>
              <Text fw={600}>Mobile Money</Text>
              <Text size="sm" c="dimmed">
                Orange, MTN, Moov : acceptez les paiements en XOF.
              </Text>
            </Stack>
            <Stack align="flex-start" gap="xs">
              <ThemeIcon size={48} radius="md" color="green">
                <IconTruck size={28} />
              </ThemeIcon>
              <Text fw={600}>Livraison</Text>
              <Text size="sm" c="dimmed">
                Zones de livraison par pays et ville.
              </Text>
            </Stack>
            <Stack align="flex-start" gap="xs">
              <ThemeIcon size={48} radius="md" color="green">
                <IconChartBar size={28} />
              </ThemeIcon>
              <Text fw={600}>Tableau de bord</Text>
              <Text size="sm" c="dimmed">
                Suivez vos ventes, commandes et revenus.
              </Text>
            </Stack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA final */}
      <Box
        py={60}
        px="md"
        style={{
          background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)',
          color: 'white',
        }}
      >
        <Container size="md">
          <Stack align="center" gap="lg" ta="center">
            <Title order={2} c="white">
              Prêt à lancer votre boutique ?
            </Title>
            <Text c="gray.3" maw={500}>
              Rejoignez les vendeurs qui utilisent Simpshopy pour vendre en Zone CFA.
            </Text>
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <Button
                size="lg"
                color="white"
                c="green.8"
                rightSection={<IconChevronRight size={20} />}
              >
                Créer mon compte
              </Button>
            </Link>
          </Stack>
        </Container>
      </Box>

      <LandingFooter />
    </Box>
  );
}
