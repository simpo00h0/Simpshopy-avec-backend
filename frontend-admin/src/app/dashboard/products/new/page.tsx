'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Container,
  Title,
  Button,
  Card,
  Group,
  Stack,
  TextInput,
  NumberInput,
  Textarea,
  Select,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-utils';
import { ProductImagesField } from '@/components/ProductImagesField';

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
      metaTitle: '',
      metaDescription: '',
      status: 'DRAFT' as 'DRAFT' | 'ACTIVE' | 'OUT_OF_STOCK' | 'ARCHIVED',
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
        metaTitle: values.metaTitle || undefined,
        metaDescription: values.metaDescription || undefined,
        status: values.status,
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

  return (
    <Container fluid py="xl">
      <Group mb="xl" gap="md">
        <Link href="/dashboard/products" style={{ textDecoration: 'none' }}>
          <Button variant="subtle" leftSection={<IconArrowLeft size={16} />}>
            Retour
          </Button>
        </Link>
      </Group>
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Title order={3} mb="lg">
          Nouveau produit
        </Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Nom"
              placeholder="T-shirt imprimé"
              required
              {...form.getInputProps('name')}
            />
            <Textarea
              label="Description"
              placeholder="Décrivez votre produit"
              minRows={3}
              {...form.getInputProps('description')}
            />
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
            <Group grow>
              <NumberInput label="Stock" min={0} placeholder="0" {...form.getInputProps('inventoryQty')} />
              <TextInput label="SKU" placeholder="SKU-001" {...form.getInputProps('sku')} />
            </Group>
            <Select
              label="Catégorie"
              placeholder="Sélectionner une catégorie"
              data={categories.map((c) => ({ value: c.id, label: c.name }))}
              clearable
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
            <TextInput
              label="Titre SEO"
              placeholder="Titre pour les moteurs de recherche"
              {...form.getInputProps('metaTitle')}
            />
            <Textarea
              label="Description SEO"
              placeholder="Meta description pour les moteurs de recherche"
              minRows={2}
              {...form.getInputProps('metaDescription')}
            />
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
