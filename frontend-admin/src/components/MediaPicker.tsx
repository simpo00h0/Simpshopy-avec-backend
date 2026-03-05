'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Modal, Tabs, SimpleGrid, Box, Text, Group } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconPhoto, IconUpload, IconCloudUpload } from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import { uploadMediaToLibrary } from '@/lib/upload-service';
import type { Media } from '@/lib/upload-service';

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size?: number;
  altText?: string;
  createdAt: string;
}

interface PendingUpload {
  id: string;
  file: File;
  blobUrl: string;
  status: 'uploading' | 'done' | 'error';
  progress: number;
  media?: Media | null;
}

export interface MediaPickerProps {
  opened: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export function MediaPicker({ opened, onClose, onSelect }: MediaPickerProps) {
  const queryClient = useQueryClient();
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const pendingRef = useRef<PendingUpload[]>([]);
  pendingRef.current = pendingUploads;

  const { data: mediaList = [], isLoading } = useQuery({
    queryKey: ['media'],
    queryFn: () => api.get<MediaItem[]>('/media').then((r) => r.data || []),
    enabled: opened,
    staleTime: 30_000,
  });

  const startUpload = useCallback(
    (file: File) => {
      const blobUrl = URL.createObjectURL(file);
      const id = `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const pending: PendingUpload = { id, file, blobUrl, status: 'uploading', progress: 0 };
      setPendingUploads((prev) => [...prev, pending]);

      uploadMediaToLibrary(file, undefined, {
        onProgress: (percent) => {
          setPendingUploads((prev) =>
            prev.map((p) => (p.id === id ? { ...p, progress: percent } : p))
          );
        },
      })
        .then((media) => {
          setPendingUploads((prev) =>
            prev.map((p) => (p.id === id ? { ...p, status: 'done' as const, media } : p))
          );
          if (media) {
            queryClient.invalidateQueries({ queryKey: ['media'] });
            onSelect(media.url);
            onClose();
            notifications.show({ title: 'Image ajoutée', message: '', color: 'green' });
          }
          URL.revokeObjectURL(blobUrl);
          setPendingUploads((prev) => prev.filter((p) => p.id !== id));
        })
        .catch(() => {
          notifications.show({ title: 'Échec de l\'upload', message: '', color: 'red' });
          URL.revokeObjectURL(blobUrl);
          setPendingUploads((prev) => prev.filter((p) => p.id !== id));
        });
    },
    [queryClient, onSelect, onClose]
  );

  const handleDrop = (files: File[]) => {
    const file = files[0];
    if (file) startUpload(file);
  };

  useEffect(() => {
    return () => {
      pendingRef.current.forEach((p) => URL.revokeObjectURL(p.blobUrl));
    };
  }, []);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Bibliothèque média"
      size="xl"
      zIndex={10000}
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
          >
            <Group justify="center" gap="xs" style={{ pointerEvents: 'none' }}>
              <IconUpload size={40} color="var(--mantine-color-dimmed)" stroke={1.5} />
              <Text size="sm" c="dimmed">
                Glissez une image ici ou cliquez pour choisir
              </Text>
              <Text size="xs" c="dimmed">
                JPEG, PNG, GIF, WebP — max 5 Mo. L&apos;image s&apos;affiche immédiatement, l&apos;upload se fait en arrière-plan.
              </Text>
            </Group>
          </Dropzone>
          {pendingUploads.length > 0 && (
            <SimpleGrid cols={{ base: 3, sm: 4, md: 5 }} spacing="sm" mt="md">
              {pendingUploads.map((p) => (
                <Box
                  key={p.id}
                  pos="relative"
                  style={{
                    aspectRatio: '1',
                    borderRadius: 8,
                    overflow: 'hidden',
                    border: '2px solid var(--mantine-color-blue-4)',
                    boxShadow: '0 0 12px rgba(59, 130, 246, 0.3)',
                    backgroundColor: 'var(--mantine-color-gray-1)',
                  }}
                >
                  <Box
                    component="img"
                    src={p.blobUrl}
                    alt={p.file.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  {p.status === 'uploading' && (
                    <Box
                      pos="absolute"
                      inset={0}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                        padding: 10,
                      }}
                    >
                      <Box>
                        <Box
                          pos="relative"
                          style={{
                            height: 12,
                            borderRadius: 6,
                            backgroundColor: '#fff',
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: `${p.progress}%`,
                              backgroundColor: 'var(--mantine-color-blue-5)',
                              borderRadius: 6,
                              transition: 'width 0.2s ease',
                            }}
                          />
                          <Box
                            pos="absolute"
                            style={{
                              left: `clamp(0px, ${p.progress}% - 10px, calc(100% - 20px))`,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              transition: 'left 0.2s ease',
                              zIndex: 1,
                            }}
                          >
                            <IconCloudUpload size={20} color="var(--mantine-color-blue-5)" stroke={2.5} />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
}
