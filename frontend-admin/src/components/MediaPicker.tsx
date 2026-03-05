'use client';

import { useState } from 'react';
import { Modal, Tabs, SimpleGrid, Box, Text, Group, Loader } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconPhoto, IconUpload } from '@tabler/icons-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import { uploadMediaToLibrary } from '@/lib/upload-service';

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size?: number;
  altText?: string;
  createdAt: string;
}

export interface MediaPickerProps {
  opened: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export function MediaPicker({ opened, onClose, onSelect }: MediaPickerProps) {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data: mediaList = [], isLoading } = useQuery({
    queryKey: ['media'],
    queryFn: () => api.get<MediaItem[]>('/media').then((r) => r.data || []),
    enabled: opened,
    staleTime: 30_000,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => uploadMediaToLibrary(file),
    onMutate: () => setUploading(true),
    onSettled: () => setUploading(false),
    onSuccess: (media) => {
      if (media) {
        queryClient.invalidateQueries({ queryKey: ['media'] });
        onSelect(media.url);
        notifications.show({ title: 'Image ajoutée à la bibliothèque', message: '', color: 'green' });
      }
    },
  });

  const handleDrop = (files: File[]) => {
    const file = files[0];
    if (file) uploadMutation.mutate(file);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Bibliothèque média"
      size="xl"
    >
      <Tabs defaultValue="library">
        <Tabs.List>
          <Tabs.Tab value="library" leftSection={<IconPhoto size={16} />}>
            Bibliothèque
          </Tabs.Tab>
          <Tabs.Tab value="upload" leftSection={<IconUpload size={16} />}>
            Upload
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="library" pt="md">
          {isLoading ? (
            <Group justify="center" py="xl">
              <Loader size="sm" />
            </Group>
          ) : mediaList.length === 0 ? (
            <Text size="sm" c="dimmed" py="xl" ta="center">
              Aucune image dans la bibliothèque. Uploadez des images depuis l’onglet « Upload ».
            </Text>
          ) : (
            <SimpleGrid cols={{ base: 3, sm: 4, md: 5 }} spacing="sm">
              {mediaList.map((m) => (
                <Box
                  key={m.id}
                  style={{
                    aspectRatio: '1',
                    borderRadius: 8,
                    overflow: 'hidden',
                    border: '2px solid transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    onSelect(m.url);
                    onClose();
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--mantine-color-green-5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
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
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="upload" pt="md">
          <Dropzone
            onDrop={handleDrop}
            maxSize={5 * 1024 * 1024}
            accept={IMAGE_MIME_TYPE}
            loading={uploading}
          >
            <Group justify="center" gap="xs" style={{ pointerEvents: 'none' }}>
              <IconUpload size={40} color="var(--mantine-color-dimmed)" stroke={1.5} />
              <Text size="sm" c="dimmed">
                Glissez une image ici ou cliquez pour choisir
              </Text>
              <Text size="xs" c="dimmed">
                JPEG, PNG, GIF, WebP — max 5 Mo
              </Text>
            </Group>
          </Dropzone>
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
}
