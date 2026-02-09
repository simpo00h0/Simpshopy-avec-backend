'use client';

import { Container, Title, Text, Card, Group, Box } from '@mantine/core';
import { IconMail, IconPhone, IconMapPin } from '@tabler/icons-react';
import { useTheme } from '../ThemeContext';
import { BlockWrapper } from '../BlockWrapper';

export function ContactTemplate() {
  const { theme } = useTheme();
  const { storeName, contactEmail, contactPhone, colors } = theme;

  const email = contactEmail ?? 'contact@exemple.com';
  const phone = contactPhone ?? '+221 XX XXX XX XX';

  return (
    <BlockWrapper blockId="contact" label="Page Contact">
    <Container size="md" py="xl">
      <Title order={1} mb="xl" style={{ color: colors.text }}>
        Contactez-nous
      </Title>
      <Text size="md" mb="xl" style={{ color: colors.text }}>
        Une question ? Une demande ? N&apos;hésitez pas à nous contacter.
      </Text>
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Group gap="lg" wrap="wrap">
          <Box>
            <Group gap="xs" mb="xs">
              <IconMail size={24} style={{ color: colors.primary }} />
              <Text fw={600}>Email</Text>
            </Group>
            <Text size="sm" c="dimmed">
              {email}
            </Text>
          </Box>
          <Box>
            <Group gap="xs" mb="xs">
              <IconPhone size={24} style={{ color: colors.primary }} />
              <Text fw={600}>Téléphone</Text>
            </Group>
            <Text size="sm" c="dimmed">
              {phone}
            </Text>
          </Box>
          <Box>
            <Group gap="xs" mb="xs">
              <IconMapPin size={24} style={{ color: colors.primary }} />
              <Text fw={600}>Zone CFA</Text>
            </Group>
            <Text size="sm" c="dimmed">
              Livraison Sénégal, Côte d&apos;Ivoire, Togo, Bénin...
            </Text>
          </Box>
        </Group>
      </Card>
    </Container>
    </BlockWrapper>
  );
}
