'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
  Container,
  Title,
  Text,
  Button,
  Card,
  Group,
  Table,
  Modal,
  TextInput,
  NumberInput,
  Stack,
  Badge,
} from '@mantine/core';
import { IconPackage, IconPlus } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  status: string;
  inventoryQty: number;
  createdAt: string;
}

function createProduct(values: { name: string; price: number; description?: string; inventoryQty: number; sku?: string }) {
  return api.post<Product>('/products', {
    name: values.name,
    price: values.price,
    description: values.description || undefined,
    inventoryQty: values.inventoryQty,
    sku: values.sku || undefined,
  });
}

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const { data: products = [], isLoading: loading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get<Product[]>('/products').then((r) => r.data || []),
    staleTime: 30_000,
  });
  const [modalOpen, setModalOpen] = useState(false);

  const createMutation = useMutation({
    mutationFn: createProduct,
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const prev = queryClient.getQueryData<Product[]>(['products']);
      const optimistic: Product = {
        id: `temp-${Date.now()}`,
        name: values.name,
        slug: values.name.toLowerCase().replace(/\s+/g, '-'),
        price: values.price,
        status: 'DRAFT',
        inventoryQty: values.inventoryQty,
        createdAt: new Date().toISOString(),
      };
      queryClient.setQueryData<Product[]>(['products'], (old = []) => [...old, optimistic]);
      return { prev };
    },
    onSuccess: (res) => {
      const created = res.data as Product;
      queryClient.setQueryData<Product[]>(['products'], (old = []) =>
        old.map((p) => (p.id.startsWith('temp-') ? { ...p, ...created, id: created.id } : p))
      );
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      notifications.show({ title: 'Produit créé', color: 'green' });
      setModalOpen(false);
      form.reset();
    },
    onError: (_err, _values, ctx) => {
      if (ctx?.prev != null) queryClient.setQueryData(['products'], ctx.prev);
      const msg = (_err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Erreur';
      notifications.show({ title: 'Erreur', message: msg, color: 'red' });
    },
  });

  const form = useForm({
    initialValues: {
      name: '',
      price: 0,
      description: '',
      inventoryQty: 0,
      sku: '',
    },
    validate: {
      name: (v) => (!v || v.length < 2 ? 'Nom requis (2 caractères min)' : null),
      price: (v) => (v < 0 ? 'Prix invalide' : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    createMutation.mutate(values);
  };

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={2}>Produits</Title>
        <Button leftSection={<IconPlus size={18} />} color="green" onClick={() => setModalOpen(true)}>
          Ajouter un produit
        </Button>
      </Group>

      {loading ? (
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Text c="dimmed" ta="center" py={40}>Chargement...</Text>
        </Card>
      ) : products.length === 0 ? (
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Group justify="center" py={60}>
            <div style={{ textAlign: 'center' }}>
              <IconPackage size={48} stroke={1.5} color="var(--mantine-color-gray-4)" />
              <Text size="lg" fw={500} mt="md">
                Aucun produit pour le moment
              </Text>
              <Text size="sm" c="dimmed" mt="xs">
                Ajoutez votre premier produit pour commencer à vendre
              </Text>
              <Button color="green" mt="md" onClick={() => setModalOpen(true)}>
                Ajouter un produit
              </Button>
            </div>
          </Group>
        </Card>
      ) : (
        <Card shadow="sm" padding="0" radius="md" withBorder>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Produit</Table.Th>
                <Table.Th>Statut</Table.Th>
                <Table.Th>Prix</Table.Th>
                <Table.Th>Stock</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {products.map((p) => (
                <Table.Tr key={p.id}>
                  <Table.Td>
                    <Text fw={500}>{p.name}</Text>
                    <Text size="xs" c="dimmed">{p.slug}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={p.status === 'ACTIVE' ? 'green' : 'gray'} size="sm">
                      {p.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{p.price.toLocaleString('fr-FR')} XOF</Table.Td>
                  <Table.Td>{p.inventoryQty}</Table.Td>
                  <Table.Td>
                    <Button variant="subtle" size="xs" component={Link} href={`/dashboard/products/${p.id}`}>
                      Modifier
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      )}

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Ajouter un produit"
        size="md"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Nom du produit"
              placeholder="T-shirt imprimé"
              required
              {...form.getInputProps('name')}
            />
            <NumberInput
              label="Prix (XOF)"
              placeholder="5000"
              min={0}
              required
              {...form.getInputProps('price')}
            />
            <TextInput
              label="Description (optionnel)"
              placeholder="Description du produit"
              {...form.getInputProps('description')}
            />
            <NumberInput
              label="Quantité en stock"
              placeholder="0"
              min={0}
              {...form.getInputProps('inventoryQty')}
            />
            <TextInput
              label="SKU (optionnel)"
              placeholder="SKU-001"
              {...form.getInputProps('sku')}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={() => setModalOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" color="green" loading={createMutation.isPending}>
                Créer
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}
