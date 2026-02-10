'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  Select,
  Textarea,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  slug?: string;
  price: number;
  status: string;
  inventoryQty?: number;
}

export default function ProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        form.setValues({
          name: data.name,
          description: data.description || '',
          price: data.price,
          compareAtPrice: data.compareAtPrice?.toString() || '',
          inventoryQty: data.inventoryQty ?? 0,
          sku: data.sku || '',
          status: data.status || 'DRAFT',
        });
      } catch {
        notifications.show({ title: 'Produit introuvable', color: 'red' });
        router.push('/dashboard/products');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetch();
  }, [id]);

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
        old.map((p) => (p.id === id ? { ...p, name: values.name, price: values.price, status: values.status, inventoryQty: values.inventoryQty } : p))
      );
    },
    onSuccess: () => {
      notifications.show({ title: 'Produit mis à jour', color: 'green' });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Erreur';
      notifications.show({ title: 'Erreur', message: msg, color: 'red' });
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    updateMutation.mutate(values);
  };

  if (loading) {
    return (
      <Container fluid py="xl">
        <Text c="dimmed">Chargement...</Text>
      </Container>
    );
  }

  return (
    <Container fluid py="xl">
      <Group mb="xl" gap="md">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} component={Link} href="/dashboard/products">
          Retour
        </Button>
      </Group>
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Title order={3} mb="lg">
          Modifier le produit
        </Title>
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
              <Button variant="subtle" component={Link} href="/dashboard/products">
                Annuler
              </Button>
            </Group>
          </Stack>
        </form>
      </Card>
    </Container>
  );
}
