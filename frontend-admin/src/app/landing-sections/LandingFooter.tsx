import Link from 'next/link';
import { Box, Container, Text, SimpleGrid, Stack, Group } from '@mantine/core';

export function LandingFooter() {
  return (
    <Box
      component="footer"
      py="xl"
      px="xl"
      style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}
    >
      <Container size="lg">
        <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="xl" mb="xl">
          <Stack gap="xs">
            <Text size="sm" fw={600}>
              Simpshopy
            </Text>
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <Text size="sm" c="dimmed" component="span">
                Créer une boutique
              </Text>
            </Link>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <Text size="sm" c="dimmed" component="span">
                Se connecter
              </Text>
            </Link>
          </Stack>
          <Stack gap="xs">
            <Text size="sm" fw={600}>
              Aide
            </Text>
            <Text size="sm" c="dimmed" component="span">
              Centre d&apos;aide
            </Text>
            <Text size="sm" c="dimmed" component="span">
              Contact
            </Text>
          </Stack>
          <Stack gap="xs">
            <Text size="sm" fw={600}>
              Légal
            </Text>
            <Link href="/privacy" style={{ textDecoration: 'none' }}>
              <Text size="sm" c="dimmed" component="span">
                Confidentialité
              </Text>
            </Link>
            <Link href="/terms" style={{ textDecoration: 'none' }}>
              <Text size="sm" c="dimmed" component="span">
                Conditions d&apos;utilisation
              </Text>
            </Link>
          </Stack>
        </SimpleGrid>
        <Group
          justify="space-between"
          pt="md"
          style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}
        >
          <Text size="sm" c="dimmed">
            © Simpshopy — Zone CFA Afrique de l&apos;Ouest
          </Text>
        </Group>
      </Container>
    </Box>
  );
}
