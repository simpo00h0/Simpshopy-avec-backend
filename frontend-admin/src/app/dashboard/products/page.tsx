'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Container,
  Title,
  Text,
  Button,
  Card,
  Group,
  Table,
  Badge,
  Menu,
  Modal,
  ActionIcon,
  Checkbox,
} from '@mantine/core';
import { IconPackage, IconPlus, IconDots, IconPencil, IconArchive, IconCopy, IconTrash, IconEdit } from '@tabler/icons-react';
import { api } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-utils';
import { notifications } from '@mantine/notifications';
import { TableSkeleton } from '@/components/PageSkeleton';
import { EmptyState } from '@/components/EmptyState';
import { BulkEditProductsModal } from './components/BulkEditProductsModal';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  status: string;
  inventoryQty: number;
  compareAtPrice?: number | null;
  sku?: string | null;
  createdAt?: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkEditOpen, setBulkEditOpen] = useState(false);

  const { data: products = [], isLoading: loading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get<Product[]>('/products').then((r) => r.data || []),
    staleTime: 30_000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const previous = queryClient.getQueryData<Product[]>(['products']);
      queryClient.setQueryData<Product[]>(['products'], (old = []) =>
        old.filter((p) => p.id !== id)
      );
      setProductToDelete(null);
      return { previous };
    },
    onError: (err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(['products'], context.previous);
      notifications.show({ title: 'Erreur', message: getApiErrorMessage(err), color: 'red' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      notifications.show({ title: 'Produit supprimé', message: '', color: 'green' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/products/${id}`, { status: 'ARCHIVED' }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const previous = queryClient.getQueryData<Product[]>(['products']);
      queryClient.setQueryData<Product[]>(['products'], (old = []) =>
        old.map((p) => (p.id === id ? { ...p, status: 'ARCHIVED' as const } : p))
      );
      return { previous };
    },
    onError: (err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(['products'], context.previous);
      notifications.show({ title: 'Erreur', message: getApiErrorMessage(err), color: 'red' });
    },
    onSuccess: () => {
      notifications.show({ title: 'Produit archivé', message: '', color: 'green' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: (p: Product) =>
      api.post<Product>('/products', {
        name: `${p.name} (copie)`,
        price: p.price,
        compareAtPrice: undefined,
        inventoryQty: p.inventoryQty ?? 0,
        sku: p.slug ? `${p.slug}-copy` : undefined,
        status: 'DRAFT',
      }),
    onMutate: async (p) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const previous = queryClient.getQueryData<Product[]>(['products']);
      const placeholderId = `temp-dup-${Date.now()}`;
      const placeholder: Product = {
        ...p,
        id: placeholderId,
        name: `${p.name} (copie)`,
        status: 'DRAFT',
      };
      queryClient.setQueryData<Product[]>(['products'], (old = []) => [placeholder, ...old]);
      return { previous, placeholderId };
    },
    onSuccess: (res, _p, context) => {
      const created = res.data as Product;
      const placeholderId = context?.placeholderId;
      queryClient.setQueryData<Product[]>(['products'], (old = []) =>
        [created, ...old.filter((x) => x.id !== placeholderId)]
      );
      notifications.show({ title: 'Produit dupliqué', message: '', color: 'green' });
      router.push(`/dashboard/products/${created.id}`);
    },
    onError: (err, _p, context) => {
      const placeholderId = context?.placeholderId;
      if (placeholderId) {
        queryClient.setQueryData<Product[]>(['products'], (old = []) =>
          old.filter((x) => x.id !== placeholderId)
        );
      }
      if (context?.previous) queryClient.setQueryData(['products'], context.previous);
      notifications.show({ title: 'Erreur', message: getApiErrorMessage(err), color: 'red' });
    },
  });

  const selectedProducts = products.filter((p) => selectedIds.has(p.id));
  const allSelected = products.length > 0 && selectedIds.size === products.length;
  const someSelected = selectedIds.size > 0;

  const toggleSelectAll = useCallback(() => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(products.map((p) => p.id)));
  }, [allSelected, products]);

  const toggleOne = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const bulkArchiveMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      for (const id of ids) {
        await api.patch(`/products/${id}`, { status: 'ARCHIVED' });
      }
    },
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const previous = queryClient.getQueryData<Product[]>(['products']);
      const idSet = new Set(ids);
      queryClient.setQueryData<Product[]>(['products'], (old = []) =>
        old.map((p) => (idSet.has(p.id) ? { ...p, status: 'ARCHIVED' as const } : p))
      );
      setSelectedIds(new Set());
      return { previous };
    },
    onError: (err, _ids, context) => {
      if (context?.previous) queryClient.setQueryData(['products'], context.previous);
      notifications.show({ title: 'Erreur', message: getApiErrorMessage(err), color: 'red' });
    },
    onSuccess: (_, ids) => {
      notifications.show({
        title: 'Produits archivés',
        message: `${ids.length} produit(s) archivé(s)`,
        color: 'green',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const bulkDuplicateMutation = useMutation({
    mutationFn: async (items: Product[]) => {
      const created: Product[] = [];
      for (const p of items) {
        const res = await api.post<Product>('/products', {
          name: `${p.name} (copie)`,
          price: p.price,
          inventoryQty: p.inventoryQty ?? 0,
          sku: p.slug ? `${p.slug}-copy` : undefined,
          status: 'DRAFT',
        });
        created.push(res.data as Product);
      }
      return created;
    },
    onMutate: async (items) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const previous = queryClient.getQueryData<Product[]>(['products']);
      const ts = Date.now();
      const placeholders: Product[] = items.map((p, i) => ({
        ...p,
        id: `temp-dup-${ts}-${i}`,
        name: `${p.name} (copie)`,
        status: 'DRAFT',
      }));
      queryClient.setQueryData<Product[]>(['products'], (old = []) => [...placeholders, ...old]);
      setSelectedIds(new Set());
      return { previous, placeholderPrefix: `temp-dup-${ts}` };
    },
    onSuccess: (created, _items, context) => {
      const prefix = context?.placeholderPrefix ?? 'temp-dup-';
      queryClient.setQueryData<Product[]>(['products'], (old = []) =>
        [...created, ...old.filter((x) => !x.id.startsWith(prefix))]
      );
      notifications.show({
        title: 'Produits dupliqués',
        message: `${created.length} produit(s) créé(s)`,
        color: 'green',
      });
    },
    onError: (err, _items, context) => {
      const prefix = context?.placeholderPrefix ?? 'temp-dup-';
      if (context?.previous) queryClient.setQueryData(['products'], context.previous);
      else {
        queryClient.setQueryData<Product[]>(['products'], (old = []) =>
          old.filter((x) => !x.id.startsWith(prefix))
        );
      }
      notifications.show({ title: 'Erreur', message: getApiErrorMessage(err), color: 'red' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const results = await Promise.allSettled(
        ids.map((id) => api.delete(`/products/${id}`))
      );
      const ok = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected').length;
      return { ids, ok, failed };
    },
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const previous = queryClient.getQueryData<Product[]>(['products']);
      const idSet = new Set(ids);
      queryClient.setQueryData<Product[]>(['products'], (old = []) =>
        old.filter((p) => !idSet.has(p.id))
      );
      setSelectedIds(new Set());
      setBulkDeleteOpen(false);
      return { previous };
    },
    onError: (err, _ids, context) => {
      if (context?.previous) queryClient.setQueryData(['products'], context.previous);
      notifications.show({ title: 'Erreur', message: getApiErrorMessage(err), color: 'red' });
      setBulkDeleteOpen(false);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      if (result.failed > 0) {
        notifications.show({
          title: 'Suppression partielle',
          message: `${result.ok} supprimé(s), ${result.failed} non supprimé(s) (commandes associées)`,
          color: 'yellow',
        });
      } else {
        notifications.show({
          title: 'Produits supprimés',
          message: `${result.ok} produit(s) supprimé(s)`,
          color: 'green',
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const handleBulkArchive = () => {
    const ids = selectedProducts.filter((p) => p.status !== 'ARCHIVED').map((p) => p.id);
    if (ids.length > 0) bulkArchiveMutation.mutate(ids);
  };

  const handleBulkDuplicate = () => {
    if (selectedProducts.length > 0) bulkDuplicateMutation.mutate(selectedProducts);
  };

  const handleBulkDelete = () => {
    if (selectedIds.size > 0) bulkDeleteMutation.mutate(Array.from(selectedIds));
  };

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
        <>
          <Modal
            opened={productToDelete !== null}
            onClose={() => setProductToDelete(null)}
            title="Supprimer le produit"
          >
            {productToDelete && (
              <>
                <Text size="sm" c="dimmed" mb="md">
                  Supprimer « {productToDelete.name} » ? Cette action est irréversible.
                  Impossible si le produit a des commandes associées.
                </Text>
                <Group justify="flex-end">
                  <Button variant="subtle" onClick={() => setProductToDelete(null)}>
                    Annuler
                  </Button>
                  <Button
                    color="red"
                    loading={deleteMutation.isPending}
                    onClick={() => deleteMutation.mutate(productToDelete.id)}
                  >
                    Supprimer
                  </Button>
                </Group>
              </>
            )}
          </Modal>

          <Modal
            opened={bulkDeleteOpen}
            onClose={() => setBulkDeleteOpen(false)}
            title="Supprimer les produits"
          >
            <Text size="sm" c="dimmed" mb="md">
              Supprimer {selectedIds.size} produit(s) ? Cette action est irréversible.
              Les produits avec des commandes associées seront ignorés.
            </Text>
            <Group justify="flex-end">
              <Button variant="subtle" onClick={() => setBulkDeleteOpen(false)}>
                Annuler
              </Button>
              <Button
                color="red"
                loading={bulkDeleteMutation.isPending}
                onClick={handleBulkDelete}
              >
                Supprimer
              </Button>
            </Group>
          </Modal>

          <BulkEditProductsModal
            opened={bulkEditOpen}
            onClose={() => setBulkEditOpen(false)}
            products={selectedProducts}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['products'] });
              setSelectedIds(new Set());
            }}
          />

          {someSelected && (
            <Card shadow="sm" padding="sm" radius="md" withBorder mb="sm">
              <Group justify="space-between">
                <Text size="sm" fw={500}>
                  {selectedIds.size} produit(s) sélectionné(s)
                </Text>
                <Group gap="xs">
                  <Button
                    variant="light"
                    size="xs"
                    leftSection={<IconEdit size={14} />}
                    onClick={() => setBulkEditOpen(true)}
                  >
                    Modifier en masse
                  </Button>
                  <Button
                    variant="light"
                    size="xs"
                    leftSection={<IconArchive size={14} />}
                    onClick={handleBulkArchive}
                    loading={bulkArchiveMutation.isPending}
                    disabled={selectedProducts.every((p) => p.status === 'ARCHIVED')}
                  >
                    Archiver
                  </Button>
                  <Button
                    variant="light"
                    size="xs"
                    leftSection={<IconCopy size={14} />}
                    onClick={handleBulkDuplicate}
                    loading={bulkDuplicateMutation.isPending}
                  >
                    Dupliquer
                  </Button>
                  <Button
                    variant="light"
                    color="red"
                    size="xs"
                    leftSection={<IconTrash size={14} />}
                    onClick={() => setBulkDeleteOpen(true)}
                  >
                    Supprimer
                  </Button>
                  <Button variant="subtle" size="xs" onClick={clearSelection}>
                    Désélectionner
                  </Button>
                </Group>
              </Group>
            </Card>
          )}

          <Card shadow="sm" padding="0" radius="md" withBorder>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th style={{ width: 40 }}>
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected && !allSelected}
                      onChange={toggleSelectAll}
                      aria-label="Tout sélectionner"
                    />
                  </Table.Th>
                  <Table.Th>Produit</Table.Th>
                  <Table.Th>Statut</Table.Th>
                  <Table.Th>Prix</Table.Th>
                  <Table.Th>Stock</Table.Th>
                  <Table.Th style={{ width: 100 }}></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {products.map((p) => {
                  const isPlaceholder = p.id.startsWith('temp-dup-');
                  return (
                    <Table.Tr key={p.id}>
                      <Table.Td onClick={(e) => e.stopPropagation()}>
                        {!isPlaceholder && (
                          <Checkbox
                            checked={selectedIds.has(p.id)}
                            onChange={() => toggleOne(p.id)}
                            aria-label={`Sélectionner ${p.name}`}
                          />
                        )}
                      </Table.Td>
                      <Table.Td>
                        {isPlaceholder ? (
                          <>
                            <Text fw={500}>{p.name}</Text>
                            <Text size="xs" c="dimmed">Création en cours...</Text>
                          </>
                        ) : (
                          <>
                            <Link href={`/dashboard/products/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                              <Text fw={500}>{p.name}</Text>
                            </Link>
                            <Text size="xs" c="dimmed">{p.slug}</Text>
                          </>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Badge color={p.status === 'ACTIVE' ? 'green' : p.status === 'ARCHIVED' ? 'gray' : 'yellow'} size="sm">
                          {p.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>{p.price.toLocaleString('fr-FR')} XOF</Table.Td>
                      <Table.Td>{p.inventoryQty}</Table.Td>
                      <Table.Td>
                        {isPlaceholder ? (
                          <Text size="xs" c="dimmed">Création...</Text>
                        ) : (
                          <Group gap="xs" wrap="nowrap">
                            <Link href={`/dashboard/products/${p.id}`} style={{ textDecoration: 'none' }}>
                              <Button variant="subtle" size="xs" leftSection={<IconPencil size={14} />}>
                                Modifier
                              </Button>
                            </Link>
                            <Menu shadow="md" width={180} position="bottom-end">
                              <Menu.Target>
                                <ActionIcon variant="subtle" size="sm">
                                  <IconDots size={16} />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item
                                  component={Link}
                                  href={`/dashboard/products/${p.id}`}
                                  leftSection={<IconPencil size={14} />}
                                >
                                  Modifier
                                </Menu.Item>
                                <Menu.Item
                                  leftSection={<IconArchive size={14} />}
                                  onClick={() => archiveMutation.mutate(p.id)}
                                  disabled={archiveMutation.isPending || p.status === 'ARCHIVED'}
                                >
                                  Archiver
                                </Menu.Item>
                                <Menu.Item
                                  leftSection={<IconCopy size={14} />}
                                  onClick={() => duplicateMutation.mutate(p)}
                                  disabled={duplicateMutation.isPending}
                                >
                                  Dupliquer
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Item
                                  leftSection={<IconTrash size={14} />}
                                  color="red"
                                  onClick={() => setProductToDelete(p)}
                                >
                                  Supprimer
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </Group>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </Card>
        </>
      )}
    </Container>
  );
}
