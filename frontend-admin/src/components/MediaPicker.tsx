'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Modal, Tabs, SimpleGrid, Box, Text, Group, Loader, Button, Checkbox } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconPhoto, IconUpload } from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import { uploadMediaToLibrary } from '@/lib/upload-service';
import type { PendingUpload } from '@/lib/types/upload';
import { UploadProgressOverlay } from './UploadProgressOverlay';

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
  /** Mode single : clic = sélection et fermeture. Mode multiple : sélection par cases puis bouton Valider. */
  mode?: 'single' | 'multiple';
  onSelect?: (url: string) => void;
  onSelectMultiple?: (urls: string[]) => void;
}

export function MediaPicker({
  opened,
  onClose,
  mode = 'single',
  onSelect,
  onSelectMultiple,
}: MediaPickerProps) {
  const queryClient = useQueryClient();
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
  const pendingRef = useRef<PendingUpload[]>([]);
  pendingRef.current = pendingUploads;

  const handleClose = () => {
    setSelectedUrls(new Set());
    onClose();
  };

  const toggleSelect = (url: string) => {
    setSelectedUrls((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  };

  const handleValidateMultiple = () => {
    const urls = Array.from(selectedUrls);
    if (urls.length > 0 && onSelectMultiple) {
      onSelectMultiple(urls);
      handleClose();
    }
  };

  const { data: mediaList = [], isLoading } = useQuery({
    queryKey: ['media'],
    queryFn: () => api.get<MediaItem[]>('/media').then((r) => r.data || []),
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
            notifications.show({ title: 'Image ajoutée à la bibliothèque', message: '', color: 'green' });
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
    [queryClient]
  );

  const handleDrop = (files: File[]) => {
    files.forEach((file) => startUpload(file));
  };

  useEffect(() => {
    return () => {
      pendingRef.current.forEach((p) => URL.revokeObjectURL(p.blobUrl));
    };
  }, []);

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
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
            <>
              {mode === 'multiple' && selectedUrls.size > 0 && (
                <Group justify="space-between" mb="sm">
                  <Text size="sm" c="dimmed">
                    {selectedUrls.size} image{selectedUrls.size > 1 ? 's' : ''} sélectionnée
                    {selectedUrls.size > 1 ? 's' : ''}
                  </Text>
                  <Button size="sm" onClick={handleValidateMultiple}>
                    Ajouter {selectedUrls.size} image{selectedUrls.size > 1 ? 's' : ''}
                  </Button>
                </Group>
              )}
              <SimpleGrid cols={{ base: 3, sm: 4, md: 5 }} spacing="sm">
                {mediaList.map((m) => {
                  const isSelected = mode === 'multiple' && selectedUrls.has(m.url);
                  return (
                    <Box
                      key={m.id}
                      pos="relative"
                      style={{
                        aspectRatio: '1',
                        borderRadius: 8,
                        overflow: 'hidden',
                        border: `2px solid ${isSelected ? 'var(--mantine-color-green-5)' : 'transparent'}`,
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        if (mode === 'single' && onSelect) {
                          onSelect(m.url);
                          handleClose();
                        } else if (mode === 'multiple') {
                          toggleSelect(m.url);
                        }
                      }}
                      onMouseEnter={(e) => {
                        if (mode === 'single') {
                          e.currentTarget.style.borderColor = 'var(--mantine-color-green-5)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (mode === 'single') {
                          e.currentTarget.style.borderColor = 'transparent';
                        }
                      }}
                    >
                      {mode === 'multiple' && (
                        <Checkbox
                          checked={isSelected}
                          onChange={() => toggleSelect(m.url)}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            zIndex: 1,
                          }}
                        />
                      )}
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
                  );
                })}
              </SimpleGrid>
            </>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="upload" pt="md">
          <Dropzone
            onDrop={handleDrop}
            maxSize={5 * 1024 * 1024}
            maxFiles={20}
            multiple
            accept={IMAGE_MIME_TYPE}
          >
            <Group justify="center" gap="xs" style={{ pointerEvents: 'none' }}>
              <IconUpload size={40} color="var(--mantine-color-dimmed)" stroke={1.5} />
              <Text size="sm" c="dimmed">
                Glissez des images ici ou cliquez pour choisir (jusqu&apos;à 20)
              </Text>
              <Text size="xs" c="dimmed">
                JPEG, PNG, GIF, WebP — max 5 Mo par image. Affichage immédiat, upload en arrière-plan.
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
                  {p.status === 'uploading' && <UploadProgressOverlay progress={p.progress} />}
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
}
