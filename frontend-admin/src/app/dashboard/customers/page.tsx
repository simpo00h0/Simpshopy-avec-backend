'use client';

import { useQuery } from '@tanstack/react-query';
import { Container, Title, Text, Card, Table } from '@mantine/core';
import { IconUsers } from '@tabler/icons-react';
import { api } from '@/lib/api';
import { LoadingScreen } from '@/components/LoadingScreen';
import { EmptyState } from '@/components/EmptyState';

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
        <EmptyState
          icon={IconUsers}
          title="Aucun client"
          description="Vos clients apparaîtront ici après leurs achats"
        />
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
