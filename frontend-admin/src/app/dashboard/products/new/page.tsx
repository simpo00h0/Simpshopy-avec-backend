'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Container,
  Title,
  Text,
  Button,
  Card,
  Group,
  Stack,
  TextInput,
  NumberInput,
  Textarea,
  Select,
  Divider,
  Badge,
  Box,
  Breadcrumbs,
  Anchor,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-utils';
import { ProductImagesField } from '@/components/ProductImagesField';
import {
  ProductVariantsField,
  type ProductOption,
  type VariantRow,
} from '@/app/dashboard/products/components/ProductVariantsField';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  status: string;
  inventoryQty: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ProductCreatePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      price: 0,
      compareAtPrice: '',
      inventoryQty: 0,
      sku: '',
      categoryId: null as string | null,
      images: [] as string[],
      status: 'DRAFT' as 'DRAFT' | 'ACTIVE' | 'OUT_OF_STOCK' | 'ARCHIVED',
      productOptions: [] as ProductOption[],
      variants: [] as VariantRow[],
    },
    validate: {
      name: (v) => (!v || v.length < 2 ? 'Nom requis (2 caractères min)' : null),
      price: (v) => (v < 0 ? 'Prix invalide' : null),
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<Category[]>('/categories').then((r) => r.data || []),
    staleTime: 60_000,
  });

  const createMutation = useMutation({
    mutationFn: (values: typeof form.values) =>
      api.post<Product>('/products', {
        name: values.name,
        description: values.description || undefined,
        price: values.price,
        compareAtPrice: values.compareAtPrice ? Number(values.compareAtPrice) : undefined,
        inventoryQty: values.inventoryQty,
        sku: values.sku || undefined,
        categoryId: values.categoryId || undefined,
        images: values.images.length > 0 ? values.images : undefined,
        status: values.status,
        variants:
          values.variants.length > 0
            ? values.variants.map((v) => ({
                attributes: v.attributes,
                price: v.price,
                inventoryQty: v.inventoryQty,
                sku: v.sku || undefined,
              }))
            : undefined,
      }),
    onSuccess: (res) => {
      const created = res.data as Product;
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      notifications.show({ title: 'Produit créé', message: '', color: 'green' });
      router.push(`/dashboard/products/${created.id}`);
    },
    onError: (err) => {
      notifications.show({ title: 'Erreur', message: getApiErrorMessage(err), color: 'red' });
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    createMutation.mutate(values);
  };

  const slugPreview = useMemo(() => {
    const name = form.values.name?.trim() || '';
    if (name.length < 2) return '';
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }, [form.values.name]);

  const compareAt = form.values.compareAtPrice ? Number(form.values.compareAtPrice) : 0;
  const showCompareTip = compareAt > 0 && form.values.price > 0 && compareAt > form.values.price;

  return (
    <Container fluid py="xl">
      <Stack gap="md" mb="xl">
        <Breadcrumbs>
          <Anchor component={Link} href="/dashboard/products" size="sm" c="dimmed">
            Produits
          </Anchor>
          <Text size="sm" fw={500}>Nouveau produit</Text>
        </Breadcrumbs>
        <Group gap="md">
          <Link href="/dashboard/products" style={{ textDecoration: 'none' }}>
            <Button variant="subtle" leftSection={<IconArrowLeft size={16} />}>
              Retour
            </Button>
          </Link>
        </Group>
      </Stack>
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Title order={3} mb="xs">
          Nouveau produit
        </Title>
        <Text size="sm" c="dimmed" mb="lg">
          Les champs marqués * sont obligatoires.
        </Text>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg">
            <div>
              <Title order={4} mb="xs">Informations de base</Title>
              <Text size="xs" c="dimmed" mb="sm">
                Titre et description affichés sur la fiche produit.
              </Text>
              <Stack gap="md">
                <TextInput
                  label="Nom"
                  placeholder="T-shirt imprimé"
                  required
                  {...form.getInputProps('name')}
                />
                {slugPreview && (
                  <Text size="xs" c="dimmed">
                    URL prévue : /products/{slugPreview}
                  </Text>
                )}
                <Textarea
                  label="Description"
                  placeholder="Décrivez votre produit"
                  minRows={3}
                  {...form.getInputProps('description')}
                />
              </Stack>
            </div>

            <Divider />

            <div>
              <Title order={4} mb="xs">Médias</Title>
              <Text size="xs" c="dimmed" mb="sm">
                La première image sera utilisée comme image principale.
              </Text>
              <ProductImagesField
              images={form.values.images}
              onRemove={(url) =>
                form.setFieldValue(
                  'images',
                  form.values.images.filter((u) => u !== url)
                )
              }
              onAdd={(url) =>
                form.setFieldValue('images', [...form.values.images, url])
              }
              onAddMultiple={(urls) =>
                form.setFieldValue('images', [...form.values.images, ...urls])
              }
              onReorder={(urls) => form.setFieldValue('images', urls)}
            />
            </div>

            <Divider />

            <div>
              <Title order={4} mb="xs">Prix</Title>
              <Text size="xs" c="dimmed" mb="sm">
                Prix de vente et prix comparé (affiché barré si supérieur).
              </Text>
              <Group grow>
                <NumberInput
                  label="Prix (XOF)"
                  placeholder="5000"
                  min={0}
                  required
                  {...form.getInputProps('price')}
                />
                <NumberInput
                  label="Prix comparé (XOF)"
                  placeholder="7000"
                  min={0}
                  {...form.getInputProps('compareAtPrice')}
                />
              </Group>
              {showCompareTip && (
                <Text size="xs" c="green.7" mt="xs">
                  Le prix comparé sera affiché barré sur la fiche produit.
                </Text>
              )}
            </div>

            <Divider />

            <div>
              <Title order={4} mb="xs">Inventaire</Title>
              <Text size="xs" c="dimmed" mb="sm">
                Quantité en stock et référence produit.
              </Text>
              <Group grow>
                <NumberInput label="Stock" min={0} placeholder="0" {...form.getInputProps('inventoryQty')} />
                <TextInput label="SKU" placeholder="SKU-001" {...form.getInputProps('sku')} />
              </Group>
            </div>

            <Divider />

            <Divider />

            <div>
              <Title order={4} mb="xs">Options et variantes</Title>
              <ProductVariantsField
                options={form.values.productOptions}
                variants={form.values.variants}
                basePrice={form.values.price}
                onOptionsChange={(v) => form.setFieldValue('productOptions', v)}
                onVariantsChange={(v) => form.setFieldValue('variants', v)}
              />
            </div>

            <Divider />

            <div>
              <Title order={4} mb="xs">Organisation</Title>
              <Text size="xs" c="dimmed" mb="sm">
                Catégorie et statut de publication.
              </Text>
              <Stack gap="md">
                <Select
                  label="Catégorie"
                  placeholder="Sélectionner une catégorie"
                  data={categories.map((c) => ({ value: c.id, label: c.name }))}
                  clearable
                  searchable
                  {...form.getInputProps('categoryId')}
                />
                <Select
                  label="Statut"
                  data={[
                    { value: 'DRAFT', label: 'Brouillon' },
                    { value: 'ACTIVE', label: 'Actif' },
                    { value: 'OUT_OF_STOCK', label: 'Rupture de stock' },
                    { value: 'ARCHIVED', label: 'Archivé' },
                  ]}
                  {...form.getInputProps('status')}
                />
                <Text size="xs" c="dimmed">
                  Brouillon = non visible en boutique · Actif = en vente
                </Text>
              </Stack>
            </div>

            <Divider />

            <div>
              <Title order={4} mb="xs">Résumé</Title>
              <Text size="xs" c="dimmed" mb="sm">
                Aperçu rapide avant de créer le produit.
              </Text>
              <Card padding="md" radius="md" withBorder>
                <Group justify="space-between" mb="xs" align="flex-start" wrap="nowrap">
                  {form.values.images[0] ? (
                    <Box
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 8,
                        overflow: 'hidden',
                        flexShrink: 0,
                        background: 'var(--mantine-color-gray-2)',
                      }}
                    >
                      <img
                        src={form.values.images[0]}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                  ) : null}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <Text fw={500} lineClamp={1}>
                      {form.values.name || 'Nouveau produit'}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {form.values.sku || 'SKU non défini'}
                    </Text>
                  </div>
                  <Text fw={600} style={{ whiteSpace: 'nowrap' }}>
                    {form.values.price > 0
                      ? `${form.values.price.toLocaleString('fr-FR')} XOF`
                      : 'Prix non défini'}
                  </Text>
                </Group>
                <Group gap="xs">
                  <Badge
                    size="xs"
                    color={
                      form.values.status === 'ACTIVE'
                        ? 'green'
                        : form.values.status === 'OUT_OF_STOCK'
                          ? 'yellow'
                          : 'gray'
                    }
                  >
                    {form.values.status}
                  </Badge>
                  <Text size="xs" c="dimmed">
                    Stock: {form.values.inventoryQty}
                  </Text>
                  {form.values.compareAtPrice && (
                    <Text size="xs" c="dimmed">
                      Prix comparé: {Number(form.values.compareAtPrice).toLocaleString('fr-FR')} XOF
                    </Text>
                  )}
                </Group>
              </Card>
            </div>

            <Group mt="md">
              <Button type="submit" color="green" loading={createMutation.isPending}>
                Créer le produit
              </Button>
              <Link href="/dashboard/products" style={{ textDecoration: 'none' }}>
                <Button variant="subtle">Annuler</Button>
              </Link>
            </Group>
          </Stack>
        </form>
      </Card>
    </Container>
  );
}
