'use client';

import { Container, Title, Text, SimpleGrid, Card } from '@mantine/core';
import { IconQuote } from '@tabler/icons-react';
import { useTheme } from '../ThemeContext';

const defaultTestimonials = [
  { name: 'Amina K.', text: 'Excellente boutique, produits de qualité et livraison rapide. Je recommande !', rating: 5 },
  { name: 'Moussa D.', text: 'Service client au top. J\'ai reçu ma commande en 48h. Merci !', rating: 5 },
  { name: 'Fatou S.', text: 'Les produits correspondent parfaitement aux photos. Très satisfaite.', rating: 5 },
];

interface TestimonialsSectionProps {
  title?: string;
  items?: { name: string; text: string; rating: number }[];
}

export function TestimonialsSection({ title, items }: TestimonialsSectionProps) {
  const { theme } = useTheme();
  const { colors } = theme;
  const testimonials = (items && items.length > 0) ? items : (theme.testimonialsItems ?? defaultTestimonials);
  const displayTitle = title ?? theme.testimonialsTitle ?? 'Ce que disent nos clients';

  return (
    <section
      style={{
        padding: '48px 0',
        backgroundColor: colors.secondary + '15',
      }}
    >
      <Container size="xl">
        <Title order={2} mb="xl" ta="center" style={{ color: colors.text }}>
          {displayTitle}
        </Title>
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
          {testimonials.map((t, i) => (
            <Card key={i} shadow="sm" padding="lg" radius="md" withBorder>
              <IconQuote size={32} style={{ color: colors.accent, opacity: 0.6 }} />
              <Text size="md" mt="sm" style={{ color: colors.text }}>
                &quot;{t.text}&quot;
              </Text>
              <Text size="sm" fw={600} mt="md" style={{ color: colors.primary }}>
                {t.name}
              </Text>
              <Text size="xs" c="dimmed">
                {'★'.repeat(t.rating)}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </section>
  );
}
