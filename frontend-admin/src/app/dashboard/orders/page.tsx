'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Title,
  Text,
  Card,
  Table,
  Badge,
  Select,
  Group,
} from '@mantine/core';
import { IconShoppingCart } from '@tabler/icons-react';
import { api } from '@/lib/api';
import { LoadingScreen } from '@/components/LoadingScreen';

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  store?: { name: string };
}

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { data: orders = [], isLoading: loading } = useQuery({
    queryKey: ['orders', statusFilter],
    queryFn: () => api.get<Order[]>('/orders', { params: statusFilter ? { status: statusFilter } : {} }).then((r) => r.data || []),
    staleTime: 30_000,
  });

  const statusColor: Record<string, string> = {
    PENDING: 'yellow',
    CONFIRMED: 'blue',
    PROCESSING: 'cyan',
    SHIPPED: 'teal',
    DELIVERED: 'green',
    CANCELLED: 'red',
  };

  return (
    <Container fluid py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={2}>Commandes</Title>
        <Select
          placeholder="Filtrer par statut"
          clearable
          data={[
            { value: 'PENDING', label: 'En attente' },
            { value: 'CONFIRMED', label: 'Confirmée' },
            { value: 'PROCESSING', label: 'En cours' },
            { value: 'SHIPPED', label: 'Expédiée' },
            { value: 'DELIVERED', label: 'Livrée' },
            { value: 'CANCELLED', label: 'Annulée' },
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
          w={200}
        />
      </Group>

      {loading ? (
        <LoadingScreen />
      ) : orders.length === 0 ? (
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Group justify="center" py={60}>
            <div style={{ textAlign: 'center' }}>
              <IconShoppingCart size={48} stroke={1.5} color="var(--mantine-color-gray-4)" />
              <Text size="lg" fw={500} mt="md">
                Aucune commande
              </Text>
              <Text size="sm" c="dimmed" mt="xs">
                Vos commandes apparaîtront ici une fois que vous aurez des ventes
              </Text>
            </div>
          </Group>
        </Card>
      ) : (
        <Card shadow="sm" padding="0" radius="md" withBorder>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Commande</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Statut</Table.Th>
                <Table.Th>Paiement</Table.Th>
                <Table.Th>Total</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {orders.map((o) => (
                <Table.Tr key={o.id}>
                  <Table.Td>
                    <Link href={`/dashboard/orders/${o.id}`} style={{ color: 'inherit', fontWeight: 500 }}>
                      {o.orderNumber}
                    </Link>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{new Date(o.createdAt).toLocaleDateString('fr-FR')}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={statusColor[o.status] || 'gray'} size="sm">
                      {o.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={o.paymentStatus === 'COMPLETED' ? 'green' : o.paymentStatus === 'FAILED' ? 'red' : 'yellow'} size="sm">
                      {o.paymentStatus === 'COMPLETED' ? 'Payé' : o.paymentStatus}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{o.total?.toLocaleString('fr-FR')} XOF</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      )}
    </Container>
  );
}
