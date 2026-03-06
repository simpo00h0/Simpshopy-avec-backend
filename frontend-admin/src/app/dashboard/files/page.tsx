'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Box,
  Group,
  Card,
  ActionIcon,
} from '@mantine/core';
import { IconPhoto, IconTrash } from '@tabler/icons-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import { uploadMediaToLibrary } from '@/lib/upload-service';
import { LoadingScreen } from '@/components/LoadingScreen';
import { EmptyState } from '@/components/EmptyState';
import { getApiErrorMessage } from '@/lib/api-utils';
import type { PendingUpload } from '@/lib/types/upload';
import { UploadProgressOverlay } from '@/components/UploadProgressOverlay';

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size?: number;
  altText?: string;
  createdAt: string;
}

export default function FilesPage() {
  const queryClient = useQueryClient();
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const pendingRef = useRef<PendingUpload[]>([]);
  pendingRef.current = pendingUploads;

  useEffect(() => {
    return () => {
      pendingRef.current.forEach((p) => URL.revokeObjectURL(p.blobUrl));
    };
  }, []);

  const { data: mediaList = [], isLoading } = useQuery({
    queryKey: ['media'],
    queryFn: () => api.get<MediaItem[]>('/media').then((r) => r.data || []),
    staleTime: 30_000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/media/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      notifications.show({ title: 'Fichier supprimé', message: '', color: 'green' });
    },
    onError: (err) => {
      notifications.show({ title: 'Erreur', message: getApiErrorMessage(err), color: 'red' });
    },
  });

  const startUploads = useCallback(
    (files: File[]) => {
      const newPending: PendingUpload[] = files.map((file, idx) => ({
        id: `pending-${Date.now()}-${idx}-${Math.random().toString(36).slice(2)}`,
        file,
        blobUrl: URL.createObjectURL(file),
        status: 'uploading' as const,
        progress: 0,
      }));
      setPendingUploads((prev) => [...prev, ...newPending]);

      const removePending = (id: string, blobUrl: string) => {
        URL.revokeObjectURL(blobUrl);
        setPendingUploads((prev) => prev.filter((p) => p.id !== id));
      };

      Promise.all(
        newPending.map(async (p) => {
          try {
            const media = await uploadMediaToLibrary(p.file, undefined, {
              onProgress: (percent) => {
                setPendingUploads((prev) =>
                  prev.map((item) => (item.id === p.id ? { ...item, progress: percent } : item))
                );
              },
            });
            if (media) {
              queryClient.invalidateQueries({ queryKey: ['media'] });
              setTimeout(() => removePending(p.id, p.blobUrl), 300);
              return true;
            }
          } catch {
            notifications.show({ title: 'Échec', message: p.file.name, color: 'red' });
          }
          removePending(p.id, p.blobUrl);
          return false;
        })
      ).then((results) => {
        const added = results.filter(Boolean).length;
        if (added > 0) {
          notifications.show({
            title: 'Images ajoutées',
            message: `${added} image(s) ajoutée(s) à la bibliothèque`,
            color: 'green',
          });
        }
      });
    },
    [queryClient]
  );

  const handleDrop = (files: File[]) => {
    if (files.length > 0) startUploads(Array.from(files));
  };

  const displayItems = [
    ...mediaList.map((m) => ({ ...m, isPending: false })),
    ...pendingUploads.map((p) => ({
      id: p.id,
      url: p.blobUrl,
      filename: p.file.name,
      mimeType: p.file.type,
      isPending: true,
      status: p.status,
      progress: p.progress,
    })),
  ];

  return (
    <Container fluid py="xl">
      <Title order={2} mb="xl">
        Fichiers
      </Title>

      <Card shadow="sm" padding="md" radius="md" withBorder mb="xl">
        <Dropzone onDrop={handleDrop} maxSize={5 * 1024 * 1024} accept={IMAGE_MIME_TYPE}>
          <Group justify="center" gap="xs" py="xl" style={{ pointerEvents: 'none' }}>
            <IconPhoto size={40} color="var(--mantine-color-dimmed)" stroke={1.5} />
            <Text size="sm" c="dimmed">
              Glissez des images ici ou cliquez pour uploader
            </Text>
            <Text size="xs" c="dimmed">
              JPEG, PNG, GIF, WebP — max 5 Mo. Les images s&apos;affichent immédiatement, l&apos;upload se fait en arrière-plan.
            </Text>
          </Group>
        </Dropzone>
      </Card>

      {isLoading && displayItems.length === 0 ? (
        <LoadingScreen />
      ) : displayItems.length === 0 ? (
        <EmptyState
          icon={IconPhoto}
          title="Aucun fichier"
          description="Uploadez des images pour les réutiliser dans vos produits et pages"
        />
      ) : (
        <SimpleGrid cols={{ base: 2, sm: 4, md: 6 }} spacing="md">
          {displayItems.map((item) => (
            <Card key={item.id} shadow="sm" padding="xs" radius="md" withBorder>
              <Box
                pos="relative"
                style={{
                  aspectRatio: '1',
                  borderRadius: 4,
                  overflow: 'hidden',
                  backgroundColor: 'var(--mantine-color-gray-1)',
                  border: item.isPending ? '2px solid var(--mantine-color-blue-4)' : undefined,
                  boxShadow: item.isPending ? '0 0 12px rgba(59, 130, 246, 0.3)' : undefined,
                }}
              >
                <Box
                  component="img"
                  src={item.url}
                  alt={item.filename}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                {item.isPending && item.status === 'uploading' && (
                  <UploadProgressOverlay progress={'progress' in item ? item.progress : 0} />
                )}
                {!item.isPending && (
                  <ActionIcon
                    size="sm"
                    color="red"
                    variant="filled"
                    aria-label="Supprimer"
                    onClick={() => deleteMutation.mutate(item.id)}
                    loading={deleteMutation.isPending && deleteMutation.variables === item.id}
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                    }}
                  >
                    <IconTrash size={12} />
                  </ActionIcon>
                )}
              </Box>
              <Text size="xs" c="dimmed" mt="xs" lineClamp={1} title={item.filename}>
                {item.filename}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}
