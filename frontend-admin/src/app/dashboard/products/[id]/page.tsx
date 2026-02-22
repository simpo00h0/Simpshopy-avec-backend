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
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-utils';
import { LoadingScreen } from '@/components/LoadingScreen';

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
    },
  });

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get<Product>(`/products/${id}`).then((r) => r.data),
    enabled: !!id,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (product) {
      form.setValues({
        name: product.name,
        description: product.description || '',
        price: product.price,
        compareAtPrice: product.compareAtPrice?.toString() || '',
        inventoryQty: product.inventoryQty ?? 0,
        sku: product.sku || '',
        status: product.status || 'DRAFT',
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
    mutationFn: (values: typeof form.values) =>
      api.patch(`/products/${id}`, {
        name: values.name,
        description: values.description || undefined,
        price: values.price,
        compareAtPrice: values.compareAtPrice ? Number(values.compareAtPrice) : undefined,
        inventoryQty: values.inventoryQty,
        sku: values.sku || undefined,
        status: values.status,
      }),
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

  if (isLoading) {
    return (
      <Container fluid py="xl">
        <Title order={2} mb="xl">Produits</Title>
        <LoadingScreen />
      </Container>
    );
  }

  if (isError) {
    return null;
  }

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
        <Title order={3} mb="lg">Modifier le produit</Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput label="Nom" required {...form.getInputProps('name')} />
            <Textarea label="Description" minRows={3} {...form.getInputProps('description')} />
            <Group grow>
              <NumberInput label="Prix (XOF)" min={0} required {...form.getInputProps('price')} />
              <NumberInput label="Prix comparé (XOF)" min={0} {...form.getInputProps('compareAtPrice')} />
            </Group>
            <Group grow>
              <NumberInput label="Stock" min={0} {...form.getInputProps('inventoryQty')} />
              <TextInput label="SKU" {...form.getInputProps('sku')} />
            </Group>
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
