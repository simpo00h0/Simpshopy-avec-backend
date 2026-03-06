'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Title,
  Text,
  Button,
  Card,
  Group,
  Table,
  Badge,
} from '@mantine/core';
import { IconPackage, IconPlus } from '@tabler/icons-react';
import { api } from '@/lib/api';
import { TableSkeleton } from '@/components/PageSkeleton';
import { EmptyState } from '@/components/EmptyState';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  status: string;
  inventoryQty: number;
  createdAt: string;
}

export default function ProductsPage() {
  const { data: products = [], isLoading: loading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get<Product[]>('/products').then((r) => r.data || []),
    staleTime: 30_000,
  });

  return (
    <Container fluid py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={2}>Produits</Title>
        <Link href="/dashboard/products/new" style={{ textDecoration: 'none' }}>
          <Button leftSection={<IconPlus size={18} />} color="green">
            Ajouter un produit
          </Button>
        </Link>
      </Group>

      {loading ? (
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <TableSkeleton rows={6} />
        </Card>
      ) : products.length === 0 ? (
        <EmptyState
          icon={IconPackage}
          title="Aucun produit pour le moment"
          description="Ajoutez votre premier produit pour commencer à vendre"
          action={
            <Link href="/dashboard/products/new" style={{ textDecoration: 'none' }}>
              <Button color="green">Ajouter un produit</Button>
            </Link>
          }
        />
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
                    <Text size="xs" c="dimmed">
                      {p.slug}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={p.status === 'ACTIVE' ? 'green' : 'gray'} size="sm">
                      {p.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{p.price.toLocaleString('fr-FR')} XOF</Table.Td>
                  <Table.Td>{p.inventoryQty}</Table.Td>
                  <Table.Td>
                    <Link href={`/dashboard/products/${p.id}`} style={{ textDecoration: 'none' }}>
                      <Button variant="subtle" size="xs">
                        Modifier
                      </Button>
                    </Link>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      )}
    </Container>
  );
}
