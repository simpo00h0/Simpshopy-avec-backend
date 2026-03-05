'use client';

import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Box,
  Group,
  Card,
  ActionIcon,
  Loader,
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
  const [uploading, setUploading] = useState(false);

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

  const handleDrop = async (files: File[]) => {
    setUploading(true);
    let added = 0;
    for (const file of files) {
      const media = await uploadMediaToLibrary(file);
      if (media) added++;
    }
    setUploading(false);
    if (added > 0) {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      notifications.show({
        title: 'Images ajoutées',
        message: `${added} image(s) ajoutée(s) à la bibliothèque`,
        color: 'green',
      });
    }
  };

  return (
    <Container fluid py="xl">
      <Title order={2} mb="xl">
        Fichiers
      </Title>

      <Card shadow="sm" padding="md" radius="md" withBorder mb="xl">
        <Dropzone onDrop={handleDrop} maxSize={5 * 1024 * 1024} accept={IMAGE_MIME_TYPE} loading={uploading}>
          <Group justify="center" gap="xs" py="xl" style={{ pointerEvents: 'none' }}>
            <IconPhoto size={40} color="var(--mantine-color-dimmed)" stroke={1.5} />
            <Text size="sm" c="dimmed">
              Glissez des images ici ou cliquez pour uploader
            </Text>
            <Text size="xs" c="dimmed">
              JPEG, PNG, GIF, WebP — max 5 Mo par fichier
            </Text>
          </Group>
        </Dropzone>
      </Card>

      {isLoading ? (
        <LoadingScreen />
      ) : mediaList.length === 0 ? (
        <EmptyState
          icon={IconPhoto}
          title="Aucun fichier"
          description="Uploadez des images pour les réutiliser dans vos produits et pages"
        />
      ) : (
        <SimpleGrid cols={{ base: 2, sm: 4, md: 6 }} spacing="md">
          {mediaList.map((m) => (
            <Card key={m.id} shadow="sm" padding="xs" radius="md" withBorder>
              <Box
                pos="relative"
                style={{
                  aspectRatio: '1',
                  borderRadius: 4,
                  overflow: 'hidden',
                  backgroundColor: 'var(--mantine-color-gray-1)',
                }}
              >
                <Box
                  component="img"
                  src={m.url}
                  alt={m.altText || m.filename}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <ActionIcon
                  size="sm"
                  color="red"
                  variant="filled"
                  aria-label="Supprimer"
                  onClick={() => deleteMutation.mutate(m.id)}
                  loading={deleteMutation.isPending && deleteMutation.variables === m.id}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                  }}
                >
                  <IconTrash size={12} />
                </ActionIcon>
              </Box>
              <Text size="xs" c="dimmed" mt="xs" lineClamp={1} title={m.filename}>
                {m.filename}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}
