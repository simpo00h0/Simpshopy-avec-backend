'use client';

import { useState, useEffect } from 'react';
import {
  Modal,
  Table,
  Text,
  Button,
  Group,
  NumberInput,
  TextInput,
  Select,
  ScrollArea,
} from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-utils';

export interface BulkEditProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  inventoryQty: number;
  sku?: string | null;
  status: string;
}

export interface BulkEditRow {
  price: number;
  compareAtPrice: string;
  inventoryQty: number;
  sku: string;
  status: string;
}

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Brouillon' },
  { value: 'ACTIVE', label: 'Actif' },
  { value: 'OUT_OF_STOCK', label: 'Rupture de stock' },
  { value: 'ARCHIVED', label: 'Archivé' },
];

type Props = {
  opened: boolean;
  onClose: () => void;
  products: BulkEditProduct[];
  currency?: string;
  onSuccess: () => void;
};

function toRow(p: BulkEditProduct): BulkEditRow {
  return {
    price: p.price,
    compareAtPrice: p.compareAtPrice != null ? String(p.compareAtPrice) : '',
    inventoryQty: p.inventoryQty ?? 0,
    sku: p.sku ?? '',
    status: p.status || 'DRAFT',
  };
}

export function BulkEditProductsModal({ opened, onClose, products, currency = '', onSuccess }: Props) {
  const priceLabel = currency ? `Prix (${currency})` : 'Prix';
  const compareLabel = currency ? `Prix comparé (${currency})` : 'Prix comparé';
  const [rows, setRows] = useState<Record<string, BulkEditRow>>({});

  useEffect(() => {
    if (opened && products.length > 0) {
      const initial: Record<string, BulkEditRow> = {};
      products.forEach((p) => {
        initial[p.id] = toRow(p);
      });
      setRows(initial);
    }
  }, [opened, products]);

  const updateRow = (id: string, field: keyof BulkEditRow, value: string | number) => {
    setRows((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const bulkSaveMutation = useMutation({
    mutationFn: async () => {
      for (const p of products) {
        const row = rows[p.id];
        if (!row) continue;
        await api.patch(`/products/${p.id}`, {
          price: row.price,
          compareAtPrice: row.compareAtPrice ? Number(row.compareAtPrice) : undefined,
          inventoryQty: row.inventoryQty,
          sku: row.sku || undefined,
          status: row.status,
        });
      }
    },
    onSuccess: () => {
      notifications.show({
        title: 'Modifications enregistrées',
        message: `${products.length} produit(s) mis à jour`,
        color: 'green',
      });
      onSuccess();
      onClose();
    },
    onError: (err) => {
      notifications.show({ title: 'Erreur', message: getApiErrorMessage(err), color: 'red' });
    },
  });

  if (products.length === 0) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Édition en masse"
      size="xl"
    >
      <Text size="sm" c="dimmed" mb="md">
        Modifiez les champs souhaités puis enregistrez. Les colonnes Prix, Prix comparé, Stock, SKU et Statut sont éditables.
      </Text>
      <ScrollArea.Autosize mah={400} type="scroll">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Produit</Table.Th>
              <Table.Th>{priceLabel}</Table.Th>
              <Table.Th>{compareLabel}</Table.Th>
              <Table.Th>Stock</Table.Th>
              <Table.Th>SKU</Table.Th>
              <Table.Th>Statut</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {products.map((p) => {
              const row = rows[p.id] ?? toRow(p);
              return (
                <Table.Tr key={p.id}>
                  <Table.Td>
                    <Text size="sm" fw={500} lineClamp={1}>
                      {p.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {p.slug}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <NumberInput
                      size="xs"
                      min={0}
                      value={row.price}
                      onChange={(v) => updateRow(p.id, 'price', Number(v) || 0)}
                    />
                  </Table.Td>
                  <Table.Td>
                    <NumberInput
                      size="xs"
                      min={0}
                      value={row.compareAtPrice}
                      onChange={(v) => updateRow(p.id, 'compareAtPrice', String(v ?? ''))}
                    />
                  </Table.Td>
                  <Table.Td>
                    <NumberInput
                      size="xs"
                      min={0}
                      value={row.inventoryQty}
                      onChange={(v) => updateRow(p.id, 'inventoryQty', Number(v) || 0)}
                    />
                  </Table.Td>
                  <Table.Td>
                    <TextInput
                      size="xs"
                      value={row.sku}
                      onChange={(e) => updateRow(p.id, 'sku', e.target.value)}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Select
                      size="xs"
                      data={STATUS_OPTIONS}
                      value={row.status}
                      onChange={(v) => v && updateRow(p.id, 'status', v)}
                    />
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </ScrollArea.Autosize>
      <Group justify="flex-end" mt="md">
        <Button variant="subtle" onClick={onClose}>
          Annuler
        </Button>
        <Button
          color="green"
          loading={bulkSaveMutation.isPending}
          onClick={() => bulkSaveMutation.mutate()}
        >
          Enregistrer
        </Button>
      </Group>
    </Modal>
  );
}
