'use client';

import { useQuery } from '@tanstack/react-query';
import { Container, Title, Text, Card, Table } from '@mantine/core';
import { IconUsers } from '@tabler/icons-react';
import { api } from '@/lib/api';
import { LoadingScreen } from '@/components/LoadingScreen';

interface CustomerRow {
  customer: { id: string; firstName: string; lastName: string; email: string };
  orders: number;
  total: number;
}

export default function CustomersPage() {
  const { data: customers = [], isLoading: loading } = useQuery({
    queryKey: ['customers'],
    queryFn: () => api.get<CustomerRow[]>('/stores/customers').then((r) => r.data || []),
    staleTime: 30_000,
  });

  return (
    <Container fluid py="xl">
      <Title order={2} mb="xl">
        Clients
      </Title>
      {loading ? (
        <LoadingScreen />
      ) : customers.length === 0 ? (
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <div style={{ textAlign: 'center', padding: 60 }}>
            <IconUsers size={48} stroke={1.5} color="var(--mantine-color-gray-4)" />
            <Text size="lg" fw={500} mt="md">
              Aucun client
            </Text>
            <Text size="sm" c="dimmed" mt="xs">
              Vos clients apparaîtront ici après leurs achats
            </Text>
          </div>
        </Card>
      ) : (
        <Card shadow="sm" padding="0" radius="md" withBorder>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Client</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Commandes</Table.Th>
                <Table.Th>Total dépensé</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {customers.map(({ customer, orders, total }) => (
                <Table.Tr key={customer.id}>
                  <Table.Td>
                    <Text fw={500}>{customer.firstName} {customer.lastName}</Text>
                  </Table.Td>
                  <Table.Td>{customer.email}</Table.Td>
                  <Table.Td>{orders}</Table.Td>
                  <Table.Td>{total.toLocaleString('fr-FR')} XOF</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      )}
    </Container>
  );
}
