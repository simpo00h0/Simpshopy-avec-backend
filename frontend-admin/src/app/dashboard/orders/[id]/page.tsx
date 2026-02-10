'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container, Title, Text, Button, Card, Group, Stack, Badge, Table } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { api } from '@/lib/api';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  subtotal: number;
  shippingAmount: number;
  discountAmount: number;
  currency: string;
  createdAt: string;
  shippingAddress?: { name?: string; address?: string; city?: string; phone?: string };
  items?: { quantity: number; price: number; total: number; product?: { name: string } }[];
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetch();
  }, [id]);

  if (loading || !order) {
    return (
      <Container fluid py="xl">
        {!loading && !order && (
          <Text c="dimmed">Commande introuvable. <Link href="/dashboard/orders">Retour aux commandes</Link></Text>
        )}
        {loading && <Text c="dimmed">Chargement...</Text>}
      </Container>
    );
  }

  const statusColor: Record<string, string> = {
    PENDING: 'yellow', CONFIRMED: 'blue', PROCESSING: 'cyan',
    SHIPPED: 'teal', DELIVERED: 'green', CANCELLED: 'red',
  };

  return (
    <Container fluid py="xl">
      <Group mb="xl" gap="md">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} component={Link} href="/dashboard/orders">
          Retour aux commandes
        </Button>
      </Group>
      <Stack gap="md">
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Group justify="space-between" mb="md">
            <Title order={3}>Commande {order.orderNumber}</Title>
            <Group>
              <Badge color={statusColor[order.status] || 'gray'}>{order.status}</Badge>
              <Badge color={order.paymentStatus === 'COMPLETED' ? 'green' : 'yellow'}>
                {order.paymentStatus === 'COMPLETED' ? 'Payé' : order.paymentStatus}
              </Badge>
            </Group>
          </Group>
          <Text size="sm" c="dimmed">
            {new Date(order.createdAt).toLocaleString('fr-FR')}
          </Text>
        </Card>
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Title order={4} mb="md">Articles</Title>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Produit</Table.Th>
                <Table.Th>Quantité</Table.Th>
                <Table.Th>Prix</Table.Th>
                <Table.Th>Total</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {(order.items || []).map((item, i) => (
                <Table.Tr key={i}>
                  <Table.Td>{item.product?.name || 'Produit'}</Table.Td>
                  <Table.Td>{item.quantity}</Table.Td>
                  <Table.Td>{item.price?.toLocaleString('fr-FR')} {order.currency}</Table.Td>
                  <Table.Td>{item.total?.toLocaleString('fr-FR')} {order.currency}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          <Stack gap="xs" mt="md" style={{ maxWidth: 280, marginLeft: 'auto' }}>
            <Group justify="space-between">
              <Text size="sm">Sous-total</Text>
              <Text>{order.subtotal?.toLocaleString('fr-FR')} {order.currency}</Text>
            </Group>
            {order.shippingAmount > 0 && (
              <Group justify="space-between">
                <Text size="sm">Livraison</Text>
                <Text>{order.shippingAmount?.toLocaleString('fr-FR')} {order.currency}</Text>
              </Group>
            )}
            {order.discountAmount > 0 && (
              <Group justify="space-between">
                <Text size="sm">Réduction</Text>
                <Text c="green">-{order.discountAmount?.toLocaleString('fr-FR')} {order.currency}</Text>
              </Group>
            )}
            <Group justify="space-between" fw={600}>
              <Text>Total</Text>
              <Text>{order.total?.toLocaleString('fr-FR')} {order.currency}</Text>
            </Group>
          </Stack>
        </Card>
        {order.shippingAddress && (
          <Card shadow="sm" padding="xl" radius="md" withBorder>
            <Title order={4} mb="md">Adresse de livraison</Title>
            <Text size="sm">{order.shippingAddress.name}</Text>
            <Text size="sm">{order.shippingAddress.address}</Text>
            <Text size="sm">{order.shippingAddress.city}</Text>
            {order.shippingAddress.phone && <Text size="sm">{order.shippingAddress.phone}</Text>}
          </Card>
        )}
      </Stack>
    </Container>
  );
}
