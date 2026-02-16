'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Container,
  Title,
  Text,
  Card,
  SimpleGrid,
  Button,
  Badge,
  Group,
  Box,
} from '@mantine/core';
import { IconPalette, IconCheck, IconEye } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useStoreStore } from '@/stores/storeStore';
import { api } from '@/lib/api';

interface ThemeTemplate {
  id: string;
  name: string;
  niche: string;
  description: string;
  colors: { primary: string; secondary: string; accent: string };
  tags: string[];
}

const themes: ThemeTemplate[] = [
  { id: 'classique', name: 'Classique', niche: 'Polyvalent', description: 'Boutique complète professionnelle, adaptée à tous types de produits.', colors: { primary: '#1a1a2e', secondary: '#16213e', accent: '#0f3460' }, tags: ['Général', 'Professionnel'] },
  { id: 'mode', name: 'Mode', niche: 'Vêtements & Accessoires', description: 'Boutique mode avec robe wax, sacs, boubous et accessoires.', colors: { primary: '#2d132c', secondary: '#801336', accent: '#c72c41' }, tags: ['Mode', 'Style'] },
  { id: 'tech', name: 'Tech', niche: 'Électronique & Gadgets', description: 'Boutique tech : smartphones, écouteurs, power banks, montres connectées.', colors: { primary: '#0d1b2a', secondary: '#1b263b', accent: '#00b4d8' }, tags: ['Électronique', 'Moderne'] },
  { id: 'food', name: 'Saveurs', niche: 'Alimentation & Restauration', description: 'Boutique alimentaire : miel, café, épices, produits du terroir.', colors: { primary: '#2d5016', secondary: '#7cb342', accent: '#ff8f00' }, tags: ['Alimentation', 'Bio'] },
  { id: 'beaute', name: 'Beauté', niche: 'Cosmétiques & Soins', description: 'Boutique beauté : crèmes karité, huiles, savon noir, soins cheveux.', colors: { primary: '#4a1942', secondary: '#7b2cbf', accent: '#e0aaff' }, tags: ['Beauté', 'Cosmétique'] },
  { id: 'artisanat', name: 'Artisanat', niche: 'Créations & Handmade', description: 'Boutique artisanale : sculptures, paniers, poterie, bijoux.', colors: { primary: '#3e2723', secondary: '#5d4037', accent: '#8d6e63' }, tags: ['Artisanat', 'Fait main'] },
  { id: 'sante', name: 'Bien-être', niche: 'Santé & Fitness', description: 'Boutique santé : vitamines, protéines, yoga, compléments.', colors: { primary: '#1b4332', secondary: '#2d6a4f', accent: '#52b788' }, tags: ['Santé', 'Sport'] },
  { id: 'luxe', name: 'Luxe', niche: 'Haut de gamme', description: 'Boutique premium : montres, parfums, accessoires de luxe.', colors: { primary: '#1a1a1a', secondary: '#2d2d2d', accent: '#c9a227' }, tags: ['Luxe', 'Premium'] },
  { id: 'minimal', name: 'Minimal', niche: 'Design épuré', description: 'Boutique ultra minimaliste, focus sur le produit.', colors: { primary: '#212529', secondary: '#495057', accent: '#212529' }, tags: ['Minimal', 'Épuré'] },
];

export default function ThemesPage() {
  const currentStore = useStoreStore((s) => s.currentStore);
  const setCurrentStore = useStoreStore((s) => s.setCurrentStore);
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const storefrontUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3002';

  useEffect(() => {
    const themeId = currentStore?.settings?.themeId ?? null;
    setActiveTheme(themeId);
  }, [currentStore?.settings?.themeId]);

  const handlePreview = (id: string) => {
    window.open(`${storefrontUrl}/preview/${id}`, '_blank', 'noopener,noreferrer,width=1200,height=800');
  };

  const applyMutation = useMutation({
    mutationFn: (themeId: string) => api.patch(`/stores/${currentStore!.id}/settings`, { themeId }),
    onMutate: (themeId) => {
      setActiveTheme(themeId); // Feedback immédiat
    },
    onSuccess: async (_, themeId) => {
      const storesRes = await api.get<{ id: string; name: string; subdomain: string; email: string; status: string; settings?: { themeId?: string | null } }[]>('/stores');
      const stores = storesRes.data;
      const updated = stores?.find((s) => s.id === currentStore?.id) ?? stores?.[0];
      if (updated) setCurrentStore(updated);
      const theme = themes.find((t) => t.id === themeId);
      notifications.show({
        title: 'Thème appliqué',
        message: `Le thème "${theme?.name}" est maintenant actif. Personnalisez-le dans l'onglet Boutique.`,
        color: 'green',
      });
    },
    onError: () => {
      setActiveTheme(currentStore?.settings?.themeId ?? null); // Rollback
      notifications.show({ title: 'Erreur', message: 'Impossible d\'appliquer le thème', color: 'red' });
    },
  });

  const handleApply = (id: string) => {
    if (!currentStore?.id) {
      notifications.show({ title: 'Erreur', message: 'Aucune boutique sélectionnée', color: 'red' });
      return;
    }
    applyMutation.mutate(id);
  };

  return (
    <Container fluid py="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Templates de boutique</Title>
          <Text size="sm" c="dimmed" mt={4}>
            Boutiques pré-créées par niche — Prévisualisez puis appliquez. Le thème choisi apparaît dans l&apos;onglet Boutique.
          </Text>
        </div>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
        {themes.map((theme) => (
          <Card
            key={theme.id}
            shadow="sm"
            padding="0"
            radius="md"
            withBorder
            style={{
              overflow: 'hidden',
              borderColor: activeTheme === theme.id ? 'var(--mantine-color-green-6)' : undefined,
              borderWidth: activeTheme === theme.id ? 2 : 1,
            }}
          >
            <Box
              style={{
                height: 140,
                background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 50%, ${theme.colors.accent} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                cursor: 'pointer',
              }}
              onClick={() => handlePreview(theme.id)}
            >
              <Text size="xs" c="white" style={{ opacity: 0.9 }}>
                Cliquez pour prévisualiser
              </Text>
              <Badge
                size="sm"
                variant="white"
                color="dark"
                style={{ position: 'absolute', bottom: 8, right: 8 }}
                leftSection={<IconEye size={12} />}
              >
                Aperçu
              </Badge>
            </Box>
            <Box p="md">
              <Group justify="space-between" mb="xs">
                <Title order={4}>{theme.name}</Title>
                {activeTheme === theme.id && (
                  <Badge color="green" size="sm" leftSection={<IconCheck size={12} />}>
                    Actif
                  </Badge>
                )}
              </Group>
              <Text size="xs" c="dimmed" fw={500} mb={4}>
                {theme.niche}
              </Text>
              <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
                {theme.description}
              </Text>
              <Group gap={4} mb="md">
                {theme.tags.map((tag) => (
                  <Badge key={tag} variant="light" size="xs">
                    {tag}
                  </Badge>
                ))}
              </Group>
              <Group gap="xs">
                <Button
                  variant="light"
                  leftSection={<IconEye size={16} />}
                  onClick={() => handlePreview(theme.id)}
                  style={{ flex: 1 }}
                >
                  Prévisualiser
                </Button>
                <Button
                  variant={activeTheme === theme.id ? 'light' : 'filled'}
                  color="green"
                  onClick={() => handleApply(theme.id)}
                  loading={applyMutation.isPending}
                >
                  {activeTheme === theme.id ? 'Actif' : 'Appliquer'}
                </Button>
              </Group>
            </Box>
          </Card>
        ))}
      </SimpleGrid>

      <Card shadow="sm" padding="lg" radius="md" withBorder mt="xl">
        <Group>
          <IconPalette size={24} />
          <div>
            <Text fw={500}>Personnaliser votre boutique</Text>
            <Text size="sm" c="dimmed">
              Une fois le thème appliqué, rendez-vous dans l&apos;onglet <strong>Boutique</strong> pour personnaliser les couleurs, textes et sections.
            </Text>
          </div>
        </Group>
      </Card>
    </Container>
  );
}
