'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, Card, Group, Table } from '@mantine/core';
import { IconWallet } from '@tabler/icons-react';
import { api } from '@/lib/api';
import { LoadingScreen } from '@/components/LoadingScreen';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  balance: number;
  description?: string;
  createdAt: string;
}

export default function WalletPage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [balanceRes, txnRes] = await Promise.all([
          api.get<{ balance: number }>('/wallet/balance'),
          api.get<Transaction[]>('/wallet/transactions', { params: { limit: 20 } }),
        ]);
        setBalance(balanceRes.data?.balance ?? 0);
        setTransactions(txnRes.data || []);
      } catch {
        setBalance(0);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Title order={2} mb="xl">
          Portefeuille
        </Title>
        <LoadingScreen />
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="xl">
        Portefeuille
      </Title>
      <Card shadow="sm" padding="xl" radius="md" withBorder mb="xl">
        <Group justify="space-between">
          <div>
            <Text size="sm" c="dimmed">
              Solde disponible
            </Text>
            <Text size="xl" fw={700}>
              {(balance ?? 0).toLocaleString('fr-FR')} XOF
            </Text>
          </div>
          <IconWallet size={40} stroke={1.5} />
        </Group>
        <Text size="xs" c="dimmed" mt="md">
          Les paiements de vos ventes seront crédités ici. Vous pourrez effectuer des retraits vers votre compte bancaire ou Mobile Money.
        </Text>
      </Card>
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Title order={4} mb="md">
          Historique des transactions
        </Title>
        {transactions.length === 0 ? (
          <Text size="sm" c="dimmed" py={20} ta="center">
            Aucune transaction pour le moment
          </Text>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Montant</Table.Th>
                <Table.Th>Solde</Table.Th>
                <Table.Th>Description</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {transactions.map((t) => (
                <Table.Tr key={t.id}>
                  <Table.Td>{new Date(t.createdAt).toLocaleString('fr-FR')}</Table.Td>
                  <Table.Td>{t.type}</Table.Td>
                  <Table.Td style={{ color: t.type === 'credit' ? 'var(--mantine-color-green-7)' : undefined }}>
                    {t.type === 'credit' ? '+' : '-'}{Math.abs(t.amount).toLocaleString('fr-FR')} XOF
                  </Table.Td>
                  <Table.Td>{t.balance?.toLocaleString('fr-FR')} XOF</Table.Td>
                  <Table.Td>{t.description || '-'}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Card>
    </Container>
  );
}
