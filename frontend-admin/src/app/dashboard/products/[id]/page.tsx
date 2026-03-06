'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Container,
  Title,
  Button,
  Card,
  Group,
  Stack,
  TextInput,
  NumberInput,
  Select,
  Textarea,
  Modal,
  Text,
  Menu,
  Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowLeft, IconTrash, IconArchive, IconCopy } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-utils';
import { PageSkeleton } from '@/components/PageSkeleton';
import { ProductImagesField } from '@/components/ProductImagesField';
import {
  ProductVariantsField,
  variantsFromApi,
  buildVariantsForSubmit,
  type ProductOption,
  type VariantRow,
} from '@/app/dashboard/products/components/ProductVariantsField';

interface ProductVariant {
  attributes?: Record<string, string>;
  price?: number;
  inventoryQty?: number;
  sku?: string;
  imageUrl?: string;
}

interface Product {
  id: string;
  name: string;
  slug?: string;
  price: number;
  status: string;
  inventoryQty?: number;
  description?: string;
  compareAtPrice?: number;
  sku?: string;
  categoryId?: string | null;
  images?: string[];
  variants?: ProductVariant[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      price: 0,
      compareAtPrice: '',
      inventoryQty: 0,
      sku: '',
      status: 'DRAFT',
      categoryId: null as string | null,
      images: [] as string[],
      productOptions: [] as ProductOption[],
      variants: [] as VariantRow[],
    },
  });

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get<Product>(`/products/${id}`).then((r) => r.data),
    enabled: !!id,
    staleTime: 30_000,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<Category[]>('/categories').then((r) => r.data || []),
    staleTime: 60_000,
  });

  useEffect(() => {
    if (product) {
      const { options, variants } = variantsFromApi(product.variants ?? []);
      form.setValues({
        name: product.name,
        description: product.description || '',
        price: product.price,
        compareAtPrice: product.compareAtPrice?.toString() || '',
        inventoryQty: product.inventoryQty ?? 0,
        sku: product.sku || '',
        status: product.status || 'DRAFT',
        categoryId: product.categoryId ?? null,
        images: product.images ?? [],
        productOptions: options,
        variants,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- form.setValues when product loads
  }, [product]);

  useEffect(() => {
    if (isError) {
      notifications.show({ title: 'Produit introuvable', message: '', color: 'red' });
      router.push('/dashboard/products');
    }
  }, [isError, router]);

  const updateMutation = useMutation({
    mutationFn: (values: typeof form.values) => {
      const variantsToSend = buildVariantsForSubmit(
        values.productOptions,
        values.variants,
        values.price
      );
      return api.patch(`/products/${id}`, {
        name: values.name,
        description: values.description || undefined,
        price: values.price,
        compareAtPrice: values.compareAtPrice ? Number(values.compareAtPrice) : undefined,
        inventoryQty: values.inventoryQty,
        sku: values.sku || undefined,
        status: values.status,
        categoryId: values.categoryId || null,
        images: values.images,
        variants:
          variantsToSend.length > 0
            ? variantsToSend.map((v) => ({
                attributes: v.attributes,
                price: v.price,
                inventoryQty: v.inventoryQty,
                sku: v.sku || undefined,
              }))
            : undefined,
      });
    },
    onMutate: (values) => {
      queryClient.setQueryData<Product[]>(['products'], (old = []) =>
        old.map((p) =>
          p.id === id
            ? { ...p, name: values.name, price: values.price, status: values.status, inventoryQty: values.inventoryQty }
            : p
        )
      );
    },
    onSuccess: () => {
      notifications.show({ title: 'Produit mis à jour', message: '', color: 'green' });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
    },
    onError: (err) => {
      notifications.show({ title: 'Erreur', message: getApiErrorMessage(err), color: 'red' });
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    updateMutation.mutate(values);
  };

  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      notifications.show({ title: 'Produit supprimé', message: '', color: 'green' });
      closeDeleteModal();
      router.push('/dashboard/products');
    },
    onError: (err) => {
      notifications.show({ title: 'Erreur', message: getApiErrorMessage(err), color: 'red' });
      closeDeleteModal();
    },
  });

  const archiveMutation = useMutation({
    mutationFn: () =>
      api.patch(`/products/${id}`, { status: 'ARCHIVED' }),
    onSuccess: () => {
      form.setFieldValue('status', 'ARCHIVED');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      notifications.show({ title: 'Produit archivé', message: '', color: 'green' });
    },
    onError: (err) => {
      notifications.show({ title: 'Erreur', message: getApiErrorMessage(err), color: 'red' });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: () => {
      const { variants } = variantsFromApi(product?.variants ?? []);
      return api.post<Product>('/products', {
        name: `${product?.name ?? ''} (copie)`,
        description: product?.description,
        price: product?.price ?? 0,
        compareAtPrice: product?.compareAtPrice,
        inventoryQty: product?.inventoryQty ?? 0,
        sku: product?.sku ? `${product.sku}-copy` : undefined,
        categoryId: product?.categoryId ?? undefined,
        images: product?.images ?? [],
        status: 'DRAFT',
        variants:
          variants.length > 0
            ? variants.map((v: VariantRow) => ({
                attributes: v.attributes,
                price: v.price,
                inventoryQty: v.inventoryQty,
                sku: v.sku || undefined,
              }))
            : undefined,
      });
    },
    onSuccess: (res) => {
      const created = res.data as Product;
      queryClient.invalidateQueries({ queryKey: ['products'] });
      notifications.show({ title: 'Produit dupliqué', message: '', color: 'green' });
      router.push(`/dashboard/products/${created.id}`);
    },
    onError: (err) => {
      notifications.show({ title: 'Erreur', message: getApiErrorMessage(err), color: 'red' });
    },
  });

  if (isLoading) {
    return (
      <Container fluid py="xl">
        <Title order={2} mb="xl">Produits</Title>
        <PageSkeleton />
      </Container>
    );
  }

  if (isError) {
    return null;
  }

  return (
    <Container fluid py="xl">
      <Group mb="xl" gap="md" justify="space-between">
        <Group gap="md">
          <Link href="/dashboard/products" style={{ textDecoration: 'none' }}>
            <Button variant="subtle" leftSection={<IconArrowLeft size={16} />}>
              Retour
            </Button>
          </Link>
        </Group>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button variant="subtle" color="gray">
              Actions
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconArchive size={16} />}
              onClick={() => archiveMutation.mutate()}
              disabled={archiveMutation.isPending || product?.status === 'ARCHIVED'}
            >
              Archiver
            </Menu.Item>
            <Menu.Item
              leftSection={<IconCopy size={16} />}
              onClick={() => duplicateMutation.mutate()}
              disabled={duplicateMutation.isPending}
            >
              Dupliquer
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              leftSection={<IconTrash size={16} />}
              color="red"
              onClick={openDeleteModal}
            >
              Supprimer
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Supprimer le produit"
      >
        <Text size="sm" c="dimmed" mb="md">
          Cette action est irréversible. Le produit sera définitivement supprimé.
          Si ce produit a des commandes associées, la suppression sera refusée.
        </Text>
        <Group justify="flex-end">
          <Button variant="subtle" onClick={closeDeleteModal}>
            Annuler
          </Button>
          <Button
            color="red"
            loading={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate()}
          >
            Supprimer
          </Button>
        </Group>
      </Modal>

      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Title order={3} mb="lg">Modifier le produit</Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg">
            <div>
              <Title order={4} mb="xs">Informations de base</Title>
              <Stack gap="md">
                <TextInput label="Nom" required {...form.getInputProps('name')} />
                <Textarea label="Description" minRows={3} {...form.getInputProps('description')} />
              </Stack>
            </div>
            <Divider />
            <div>
              <Title order={4} mb="xs">Médias</Title>
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
              <Group grow>
                <NumberInput label="Prix (XOF)" min={0} required {...form.getInputProps('price')} />
                <NumberInput label="Prix comparé (XOF)" min={0} {...form.getInputProps('compareAtPrice')} />
              </Group>
            </div>
            <Divider />
            <div>
              <Title order={4} mb="xs">Inventaire (produit sans variantes)</Title>
              <Group grow>
                <NumberInput label="Stock" min={0} {...form.getInputProps('inventoryQty')} />
                <TextInput label="SKU" {...form.getInputProps('sku')} />
              </Group>
            </div>
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
            </div>
            <Group mt="md">
              <Button type="submit" color="green" loading={updateMutation.isPending}>
                Enregistrer
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
