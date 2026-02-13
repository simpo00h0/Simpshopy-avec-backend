'use client';

import { useEffect, useLayoutEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Box,
  Button,
  Group,
  Title,
  Text,
  ScrollArea,
  Stack,
  TextInput,
  Textarea,
  ColorInput,
  ActionIcon,
  Divider,
  SegmentedControl,
  NumberInput,
  Tooltip,
  Paper,
  Modal,
  Select,
  Badge,
  Switch,
  Alert,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconArrowLeft,
  IconPlus,
  IconTrash,
  IconDeviceFloppy,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconEye,
  IconEyeOff,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconGripVertical,
  IconRefresh,
  IconKeyboard,
  IconLayout2,
  IconSettings,
  IconX,
  IconAlertTriangle,
  IconUpload,
  IconPhoto,
} from '@tabler/icons-react';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { api, UPLOAD_BASE_URL } from '@/lib/api';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useStoreStore, type ThemeCustomization, type Store } from '@/stores/storeStore';
import styles from './editor.module.css';

const SIMPSHOPY_EDITOR_EVENT = 'simpshopy-block-select';
const SIMPSHOPY_BLOCK_DELETE = 'simpshopy-block-delete';
const SIMPSHOPY_THEME_UPDATE = 'simpshopy-theme-update';
const SIMPSHOPY_SCROLL_TO_BLOCK = 'simpshopy-scroll-to-block';
const SIMPSHOPY_SELECTED_BLOCK = 'simpshopy-selected-block';
const EDITOR_CACHED_KEY = 'simpshopy-editor-cached';

const DEFAULT_SECTION_ORDER = [
  'promoBanner', 'hero', 'richText', 'categories', 'featuredCarousel', 'featuredProducts',
  'countdown', 'video', 'imageText', 'separator', 'ctaButtons', 'testimonials', 'faq',
  'socialLinks', 'trustBadges', 'newsletter',
];

const BLOCK_CATEGORIES = [
  { id: 'header', label: 'En-tête', icon: '📐' },
  { id: 'content', label: 'Contenu page', icon: '📄' },
  { id: 'footer', label: 'Pied de page', icon: '🦶' },
  { id: 'pages', label: 'Pages', icon: '📑' },
  { id: 'theme', label: 'Thème', icon: '🎨' },
] as const;

const HOME_BLOCKS = [
  { id: 'header', label: 'En-tête & logo', template: 'all', category: 'header' as const },
  { id: 'promoBanner', label: 'Bannière promo', template: 'home', category: 'content' as const },
  { id: 'hero', label: 'Bannière principale', template: 'home', category: 'content' as const },
  { id: 'richText', label: 'Texte enrichi', template: 'home', category: 'content' as const },
  { id: 'categories', label: 'Catégories', template: 'home', category: 'content' as const },
  { id: 'featuredCarousel', label: 'Carousel produits', template: 'home', category: 'content' as const },
  { id: 'featuredProducts', label: 'Grille produits', template: 'home', category: 'content' as const },
  { id: 'countdown', label: 'Countdown', template: 'home', category: 'content' as const },
  { id: 'video', label: 'Vidéo', template: 'home', category: 'content' as const },
  { id: 'imageText', label: 'Image + Texte', template: 'home', category: 'content' as const },
  { id: 'separator', label: 'Séparateur', template: 'home', category: 'content' as const },
  { id: 'ctaButtons', label: 'Boutons CTA', template: 'home', category: 'content' as const },
  { id: 'testimonials', label: 'Témoignages', template: 'home', category: 'content' as const },
  { id: 'faq', label: 'FAQ', template: 'home', category: 'content' as const },
  { id: 'socialLinks', label: 'Réseaux sociaux', template: 'home', category: 'content' as const },
  { id: 'trustBadges', label: 'Badges de confiance', template: 'home', category: 'content' as const },
  { id: 'newsletter', label: 'Newsletter', template: 'home', category: 'content' as const },
  { id: 'footer', label: 'Pied de page', template: 'all', category: 'footer' as const },
  { id: 'contact', label: 'Contact', template: 'contact', category: 'pages' as const },
  { id: 'about', label: 'Page À propos', template: 'about', category: 'pages' as const },
  { id: 'colors', label: 'Couleurs', template: 'all', category: 'theme' as const },
] as const;

/** Palette de blocs pour la page Accueil : chaque type une fois, pour drag & drop sur le canvas */
const HOME_PALETTE = HOME_BLOCKS.filter(
  (b) => b.template === 'home' || b.template === 'all'
);

const TEMPLATES = [
  { id: 'home', label: 'Accueil', path: '' },
  { id: 'products', label: 'Produits', path: '/products' },
  { id: 'about', label: 'À propos', path: '/about' },
  { id: 'contact', label: 'Contact', path: '/contact' },
] as const;

const DRAG_SOURCE_LIBRARY = 'library';
const DRAG_SOURCE_CANVAS = 'canvas';

type BlockId = (typeof HOME_BLOCKS)[number]['id'];

const LEAVE_FADE_MS = 180;

interface LeaveConfirmPortalProps {
  hasUnsavedChanges: boolean;
  leaveSaveInProgress: boolean;
  showAsUnsaved: boolean;
  isLeaving: boolean;
  onClose: () => void;
  onLeaveWithoutSave: () => void;
  onSaveAndLeave: () => Promise<void>;
}

function LeaveConfirmPortal({
  hasUnsavedChanges,
  leaveSaveInProgress,
  showAsUnsaved,
  isLeaving,
  onClose,
  onLeaveWithoutSave,
  onSaveAndLeave,
}: LeaveConfirmPortalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !leaveSaveInProgress) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [leaveSaveInProgress, onClose]);

  return (
    <Box
      role="dialog"
      aria-modal="true"
      aria-labelledby="leave-confirm-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        opacity: isLeaving ? 0 : 1,
        transition: `opacity ${LEAVE_FADE_MS}ms ease-out`,
        pointerEvents: isLeaving ? 'none' : 'auto',
      }}
    >
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
        onClick={() => !leaveSaveInProgress && onClose()}
        aria-hidden
      />
      <Paper
        id="leave-confirm-dialog"
        shadow="lg"
        p="md"
        radius="md"
        withBorder
        style={{
          position: 'relative',
          zIndex: 10001,
          maxWidth: 400,
          width: '100%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Title order={4} id="leave-confirm-title" mb="md">
          {showAsUnsaved ? 'Modifications non enregistrées' : 'Quitter le constructeur'}
        </Title>
        <Stack gap="md">
          {showAsUnsaved ? (
            <>
              <Text size="sm" c="dimmed">
                Si vous quittez sans enregistrer, vous perdrez vos modifications. Vous pouvez enregistrer d&apos;abord ou quitter quand même.
              </Text>
              <Group justify="flex-end" wrap="wrap" gap="xs">
                <Button variant="default" size="sm" onClick={onClose} disabled={leaveSaveInProgress}>
                  Annuler
                </Button>
                <Button variant="filled" color="red" size="sm" onClick={onLeaveWithoutSave} disabled={leaveSaveInProgress}>
                  Quitter sans enregistrer
                </Button>
                <Button variant="filled" color="green" size="sm" loading={leaveSaveInProgress} onClick={onSaveAndLeave}>
                  Enregistrer et quitter
                </Button>
              </Group>
            </>
          ) : (
            <>
              <Text size="sm" c="dimmed">
                Voulez-vous vraiment quitter le constructeur ?
              </Text>
              <Group justify="flex-end" gap="xs">
                <Button variant="default" size="sm" onClick={onClose}>
                  Annuler
                </Button>
                <Button variant="filled" color="green" size="sm" onClick={onLeaveWithoutSave}>
                  Quitter
                </Button>
              </Group>
            </>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}

export default function BoutiqueEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeId = searchParams.get('storeId');
  const currentStore = useStoreStore((s) => s.currentStore);
  const setCurrentStore = useStoreStore((s) => s.setCurrentStore);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [selectedBlock, setSelectedBlock] = useState<BlockId | null>(null);
  const [customization, setCustomization] = useState<ThemeCustomization>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [blockSearch, setBlockSearch] = useState('');
  const [shortcutsOpen, { open: openShortcuts, close: closeShortcuts, toggle: toggleShortcuts }] = useDisclosure(false);
  const [currentTemplate, setCurrentTemplate] = useState<(typeof TEMPLATES)[number]>(TEMPLATES[0]);
  const [history, setHistory] = useState<ThemeCustomization[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropOverIndex, setDropOverIndex] = useState<number | null>(null);
  const [libraryOpen, { open: openLibrary, close: closeLibrary }] = useDisclosure(false);
  const [settingsOpen, { open: openSettings, close: closeSettings }] = useDisclosure(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [showCanvasLoader, setShowCanvasLoader] = useState(false);
  const [cachedFromSession, setCachedFromSession] = useState(false);
  const [addBlockOpen, setAddBlockOpen] = useState(false);

  useLayoutEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage?.getItem(EDITOR_CACHED_KEY) === '1') {
        setCachedFromSession(true);
      }
    } catch {
      // ignore
    }
  }, []);
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);
  const [leaveSaveInProgress, setLeaveSaveInProgress] = useState(false);
  const [saveAndLeaveFlow, setSaveAndLeaveFlow] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const lastSavedRef = useRef<string>('');
  const allowLeaveRef = useRef(false);
  const hasUnsavedChanges =
    lastSavedRef.current !== '' && JSON.stringify(customization) !== lastSavedRef.current;

  const storefrontUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3002';
  const slug = currentStore?.slug ?? searchParams.get('slug') ?? '';
  const iframeSrc = slug ? `${storefrontUrl}/s/${slug}${currentTemplate.path}?editor=1` : '';

  useEffect(() => {
    if (!iframeSrc) return;
    setCanvasReady(false);
    setShowCanvasLoader(false);
    const t = setTimeout(() => {
      if (typeof window !== 'undefined' && window.sessionStorage?.getItem(EDITOR_CACHED_KEY) !== '1') {
        setShowCanvasLoader(true);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [iframeSrc]);

  useEffect(() => {
    if (!iframeSrc) return;
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'simpshopy-editor-ready') {
        setCanvasReady(true);
        try {
          window.sessionStorage?.setItem(EDITOR_CACHED_KEY, '1');
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [iframeSrc]);

  const isUndoRedoRef = useRef(false);

  const sectionOrder = customization.sectionOrder ?? DEFAULT_SECTION_ORDER;
  const orderedHomeBlocks = sectionOrder.filter((id) =>
    HOME_BLOCKS.some((b) => b.id === id && (b.template === 'all' || b.template === 'home'))
  );

  const pushHistory = useCallback((cust: ThemeCustomization) => {
    if (isUndoRedoRef.current) return;
    setHistory((h) => {
      const next = [...h.slice(0, historyIndex + 1), JSON.parse(JSON.stringify(cust))].slice(-50);
      queueMicrotask(() => setHistoryIndex(next.length - 1));
      return next;
    });
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    isUndoRedoRef.current = true;
    setHistoryIndex(historyIndex - 1);
    setCustomization(JSON.parse(JSON.stringify(history[historyIndex - 1])));
    setTimeout(() => { isUndoRedoRef.current = false; }, 0);
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    isUndoRedoRef.current = true;
    setHistoryIndex(historyIndex + 1);
    setCustomization(JSON.parse(JSON.stringify(history[historyIndex + 1])));
    setTimeout(() => { isUndoRedoRef.current = false; }, 0);
  }, [history, historyIndex]);

  const update = useCallback(
    <K extends keyof ThemeCustomization>(key: K, value: ThemeCustomization[K]) => {
      const next = { ...customization, [key]: value };
      setCustomization(next);
      pushHistory(next);
    },
    [customization, pushHistory]
  );

  const updateNested = useCallback(
    <K extends keyof ThemeCustomization>(key: K, subKey: string, value: string | number) => {
      setCustomization((prev) => {
        const obj = prev[key];
        const n = {
          ...prev,
          [key]: typeof obj === 'object' && obj !== null ? { ...obj, [subKey]: value } : { [subKey]: value },
        };
        pushHistory(n);
        return n;
      });
    },
    [pushHistory]
  );

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedId(blockId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', blockId);
    (e.target as HTMLElement).style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.opacity = '1';
    setDraggedId(null);
    setDropOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain');
    if (!sourceId || sourceId === targetId) return;
    const order = [...orderedHomeBlocks];
    const srcIdx = order.indexOf(sourceId);
    const tgtIdx = order.indexOf(targetId);
    if (srcIdx === -1 || tgtIdx === -1) return;
    order.splice(srcIdx, 1);
    order.splice(tgtIdx, 0, sourceId);
    update('sectionOrder', order);
  };

  const removeBlockAtIndex = (index: number) => {
    const order = [...orderedHomeBlocks];
    order.splice(index, 1);
    update('sectionOrder', order);
    if (selectedBlock === orderedHomeBlocks[index]) setSelectedBlock(null);
  };

  const CANVAS_SOURCE_INDEX_KEY = 'application/x-simpshopy-source-index';

  const handleCanvasDrop = (e: React.DragEvent, insertIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    const sourceId = e.dataTransfer.getData('text/plain');
    const source = e.dataTransfer.getData('application/x-simpshopy-source');
    if (!sourceId) return;
    const order = [...orderedHomeBlocks];
    if (source === DRAG_SOURCE_LIBRARY) {
      order.splice(insertIndex, 0, sourceId);
    } else {
      const rawIdx = e.dataTransfer.getData(CANVAS_SOURCE_INDEX_KEY);
      const srcIdx = rawIdx !== '' ? parseInt(rawIdx, 10) : order.indexOf(sourceId);
      if (srcIdx === -1 || Number.isNaN(srcIdx)) return;
      order.splice(srcIdx, 1);
      const newIdx = srcIdx < insertIndex ? insertIndex - 1 : insertIndex;
      order.splice(Math.max(0, newIdx), 0, sourceId);
    }
    update('sectionOrder', order);
    setDraggedId(null);
    setDropOverIndex(null);
  };

  const handleLibraryDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedId(blockId);
    e.dataTransfer.effectAllowed = 'copyMove';
    e.dataTransfer.setData('text/plain', blockId);
    e.dataTransfer.setData('application/x-simpshopy-source', DRAG_SOURCE_LIBRARY);
    (e.target as HTMLElement).style.opacity = '0.5';
  };

  const handleCanvasDragStart = (e: React.DragEvent, blockId: string, sourceIndex: number) => {
    setDraggedId(blockId);
    e.dataTransfer.effectAllowed = 'copyMove';
    e.dataTransfer.setData('text/plain', blockId);
    e.dataTransfer.setData('application/x-simpshopy-source', DRAG_SOURCE_CANVAS);
    e.dataTransfer.setData(CANVAS_SOURCE_INDEX_KEY, String(sourceIndex));
    (e.target as HTMLElement).style.opacity = '0.5';
  };

  useEffect(() => {
    const paramSlug = searchParams.get('slug');
    const cached = useStoreStore.getState().currentStore;
    const cacheMatches = cached && (cached.id === storeId || cached.slug === (paramSlug ?? cached.slug));
    if (cacheMatches && cached.settings !== undefined) {
      const cust = (cached.settings.themeCustomization ?? {}) as ThemeCustomization;
      setCustomization(cust);
      setHistory([JSON.parse(JSON.stringify(cust))]);
      setHistoryIndex(0);
      lastSavedRef.current = JSON.stringify(cust);
      return;
    }
    const load = async () => {
      try {
        const res = await api.get<{ id: string; slug: string; settings?: { themeCustomization?: ThemeCustomization } }[]>('/stores');
        const s = res.data?.find((x: { id: string; slug: string }) => x.id === storeId || x.slug === (paramSlug ?? slug)) ?? res.data?.[0];
        if (s) {
          useStoreStore.getState().setCurrentStore(s as Store);
          const cust = (s.settings as { themeCustomization?: ThemeCustomization })?.themeCustomization ?? {};
          setCustomization(cust);
          setHistory([JSON.parse(JSON.stringify(cust))]);
          setHistoryIndex(0);
          lastSavedRef.current = JSON.stringify(cust);
        }
      } catch {
        router.replace('/dashboard/boutique');
      }
    };
    load();
  }, [storeId, slug, router, searchParams]);

  useEffect(() => {
    const win = iframeRef.current?.contentWindow;
    if (win) {
      win.postMessage({ type: SIMPSHOPY_THEME_UPDATE, customization }, '*');
      win.postMessage({ type: 'simpshopy-preview-mode', preview: previewMode }, '*');
    }
  }, [customization, previewMode]);

  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage({ type: SIMPSHOPY_SELECTED_BLOCK, blockId: selectedBlock }, '*');
  }, [selectedBlock]);

  const selectBlock = useCallback((blockId: BlockId) => {
    setSelectedBlock(blockId);
    closeLibrary();
    openSettings();
    iframeRef.current?.contentWindow?.postMessage({ type: SIMPSHOPY_SCROLL_TO_BLOCK, blockId }, '*');
  }, [closeLibrary, openSettings]);

  const openLibraryOnly = useCallback(() => {
    closeSettings();
    openLibrary();
  }, [closeSettings, openLibrary]);

  const openSettingsOnly = useCallback(() => {
    closeLibrary();
    openSettings();
  }, [closeLibrary, openSettings]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 64em)');
    const handler = () => { if (mq.matches) { closeLibrary(); closeSettings(); } };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [closeLibrary, closeSettings]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === SIMPSHOPY_EDITOR_EVENT && e.data.blockId) selectBlock(e.data.blockId as BlockId);
      if (e.data?.type === SIMPSHOPY_BLOCK_DELETE && typeof e.data.indexInOrder === 'number') removeBlockAtIndex(e.data.indexInOrder);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [selectBlock, removeBlockAtIndex]);

  const handleSave = useCallback(async (): Promise<boolean> => {
    if (!currentStore?.id) return false;
    setSaving(true);
    setSaved(false);
    try {
      const res = await api.patch(`/stores/${currentStore.id}/settings`, { themeCustomization: customization });
      const updated = res.data as Store | undefined;
      if (updated) setCurrentStore(updated);
      setSaved(true);
      lastSavedRef.current = JSON.stringify(customization);
      setTimeout(() => setSaved(false), 2000);
      return true;
    } catch {
      setSaved(false);
      return false;
    } finally {
      setSaving(false);
    }
  }, [currentStore, customization, setCurrentStore]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSave(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === '/') { e.preventDefault(); toggleShortcuts(); }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') { e.preventDefault(); setAddBlockOpen(true); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSave, redo, undo, toggleShortcuts]);

  useEffect(() => {
    if (!autoSaveEnabled) return;
    const t = setTimeout(() => { handleSave(); }, 4000);
    return () => clearTimeout(t);
  }, [autoSaveEnabled, customization, handleSave]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (allowLeaveRef.current) return;
      if (JSON.stringify(customization) !== lastSavedRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [customization]);

  const toggleSectionVisibility = (blockId: string) => {
    const vis = { ...(customization.sectionVisibility ?? {}) };
    vis[blockId] = vis[blockId] === false;
    update('sectionVisibility', vis);
  };

  if (!slug) {
    return (
      <Box p="xl">
        <Text c="dimmed">Chargement...</Text>
        <Button component={Link} href="/dashboard/boutique" variant="subtle" mt="md">Retour à la boutique</Button>
      </Box>
    );
  }

  const showEditorContent = cachedFromSession || canvasReady;

  return (
    <>
      {!showEditorContent && (
        <Box style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--mantine-color-gray-0)' }}>
          <LoadingScreen />
        </Box>
      )}
      <Box className={styles.root}>
      {/* Barre supérieure - responsive avec hiddenFrom/visibleFrom (pas de useMediaQuery = pas de hydration mismatch) */}
      <Box className={styles.toolbar} p={{ base: 'xs', md: 'sm' }}>
        <Group justify="space-between" wrap="wrap" gap="xs" mb="xs">
          <Group wrap="wrap" gap="xs" style={{ minWidth: 0, flex: 1 }}>
            <Button
              variant="subtle"
              size="xs"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => setLeaveConfirmOpen(true)}
            >
              Quitter
            </Button>
            <Divider orientation="vertical" hiddenFrom="md" />
            <Title order={6} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>Constructeur</Title>
            <Text size="xs" c="dimmed" visibleFrom="lg">{currentStore?.name}</Text>
            <Tooltip label="Bibliothèque de blocs" hiddenFrom="lg">
              <ActionIcon variant="filled" color="green" size="lg" onClick={openLibraryOnly} aria-label="Bibliothèque de blocs"><IconLayout2 size={20} /></ActionIcon>
            </Tooltip>
            <Tooltip label="Paramètres du bloc" hiddenFrom="lg">
              <ActionIcon variant={selectedBlock ? 'light' : 'default'} size="lg" onClick={openSettingsOnly} aria-label="Paramètres"><IconSettings size={20} /></ActionIcon>
            </Tooltip>
          </Group>
          <Group wrap="nowrap" gap={4}>
            <Tooltip label="Annuler"><ActionIcon variant="subtle" size="md" onClick={undo} disabled={historyIndex <= 0}><IconArrowBackUp size={18} /></ActionIcon></Tooltip>
            <Tooltip label="Rétablir"><ActionIcon variant="subtle" size="md" onClick={redo} disabled={historyIndex >= history.length - 1}><IconArrowForwardUp size={18} /></ActionIcon></Tooltip>
            <Tooltip label="Raccourcis"><ActionIcon variant="subtle" size="md" onClick={openShortcuts}><IconKeyboard size={18} /></ActionIcon></Tooltip>
            {hasUnsavedChanges && !isLeaving ? (
              <Tooltip label="Des modifications ne sont pas enregistrées. Cliquez sur Sauvegarder ou utilisez Ctrl+S.">
                <Badge size="sm" color="orange" variant="filled" style={{ cursor: 'help' }}>Non enregistré</Badge>
              </Tooltip>
            ) : (
              <Tooltip label="Toutes les modifications sont enregistrées.">
                <Badge size="sm" color="green" variant="light">Enregistré</Badge>
              </Tooltip>
            )}
            <Button size="xs" leftSection={<IconDeviceFloppy size={16} />} color="green" onClick={handleSave} loading={saving}>{saved ? '✓' : 'Sauvegarder'}</Button>
          </Group>
        </Group>
        <Group gap="xs" wrap="wrap">
          <Switch size="xs" label="Sauvegarde auto (4 s)" checked={autoSaveEnabled} onChange={(e) => setAutoSaveEnabled(e.currentTarget.checked)} />
          <Select size="xs" value={currentTemplate.id} onChange={(v) => setCurrentTemplate(TEMPLATES.find((t) => t.id === v) ?? TEMPLATES[0])} data={TEMPLATES.map((t) => ({ label: t.label, value: t.id }))} style={{ flex: 1, minWidth: 100 }} hiddenFrom="lg" />
          <SegmentedControl size="xs" value={currentTemplate.id} onChange={(v) => setCurrentTemplate(TEMPLATES.find((t) => t.id === v) ?? TEMPLATES[0])} data={TEMPLATES.map((t) => ({ label: t.label, value: t.id }))} visibleFrom="lg" />
          <SegmentedControl size="xs" value={viewport} onChange={(v) => setViewport(v as 'desktop' | 'tablet' | 'mobile')} data={[{ label: <IconDeviceDesktop size={14} />, value: 'desktop' }, { label: 'T', value: 'tablet' }, { label: <IconDeviceMobile size={14} />, value: 'mobile' }]} />
            <Tooltip label={previewMode ? 'Quitter l’aperçu' : 'Aperçu sans bordures'}>
              <ActionIcon size="md" variant={previewMode ? 'filled' : 'subtle'} color="blue" onClick={() => setPreviewMode((p) => !p)} aria-label="Aperçu">
                <IconEye size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Ajouter un bloc">
              <ActionIcon size="md" variant="subtle" color="green" onClick={() => setAddBlockOpen(true)} aria-label="Ajouter un bloc">
                <IconPlus size={18} />
              </ActionIcon>
            </Tooltip>
        </Group>
      </Box>

      {hasUnsavedChanges && !isLeaving && (
        <Alert
          color="orange"
          variant="light"
          title="Modifications non enregistrées"
          icon={<IconAlertTriangle size={20} />}
          style={{ borderRadius: 0, margin: 0 }}
        >
          Enregistrez vos modifications pour ne pas les perdre (bouton Sauvegarder ou Ctrl+S). Si vous quittez ou rafraîchissez la page sans enregistrer, elles seront perdues.
        </Alert>
      )}

      <Group align="stretch" className={styles.content} gap={0}>
        {/* GAUCHE : Bibliothèque - sur mobile: affichage latéral avec croix, un seul panneau à la fois */}
        <Paper
          className={`${styles.sidePanel} ${styles.sidePanelLeft} ${libraryOpen ? styles.sidePanelOpen : styles.sidePanelClosed}`}
          p="md"
          style={{ minHeight: 0, borderRight: '1px solid var(--mantine-color-gray-2)', flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          radius={0}
        >
            <Group justify="space-between" mb="sm" wrap="nowrap">
              <Text size="sm" fw={600} style={{ minWidth: 0 }}>Bibliothèque</Text>
              <ActionIcon variant="subtle" size="sm" onClick={closeLibrary} className={styles.panelCloseBtn} aria-label="Fermer">
                <IconX size={18} />
              </ActionIcon>
            </Group>
            <TextInput size="xs" placeholder="Rechercher..." value={blockSearch} onChange={(e) => setBlockSearch(e.target.value)} mb="sm" styles={{ input: { minWidth: 0 } }} />
            <Text size="xs" c="dimmed" mb="sm">Glissez un bloc sur le canvas pour l&apos;ajouter. Même type plusieurs fois possible.</Text>
            <Box style={{ flex: '1 1 0', minHeight: 0, overflowY: 'scroll', overflowX: 'hidden', scrollbarGutter: 'stable' }}>
              <Stack gap={4}>
                {HOME_PALETTE.filter((b) => !blockSearch || b.label.toLowerCase().includes(blockSearch.toLowerCase())).map((b) => (
                  <Paper
                    key={b.id}
                    p="xs"
                    radius="sm"
                    style={{
                      cursor: 'grab',
                      border: selectedBlock === b.id ? '2px solid var(--mantine-color-green-6)' : '1px solid var(--mantine-color-gray-2)',
                      backgroundColor: selectedBlock === b.id ? 'var(--mantine-color-green-0)' : draggedId === b.id ? 'var(--mantine-color-gray-1)' : undefined,
                      opacity: draggedId === b.id ? 0.7 : 1,
                    }}
                    onClick={() => selectBlock(b.id as BlockId)}
                    draggable
                    onDragStart={(e) => handleLibraryDragStart(e, b.id)}
                    onDragEnd={handleDragEnd}
                  >
                    <Group gap="xs" wrap="nowrap">
                      <IconGripVertical size={14} style={{ color: 'var(--mantine-color-gray-5)' }} />
                      <Text size="sm" style={{ flex: 1 }} truncate>{b.label}</Text>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </Box>
            <Button size="xs" variant="light" leftSection={<IconRefresh size={14} />} mt="md" onClick={() => update('sectionOrder', undefined)}>Réinitialiser l&apos;ordre</Button>
        </Paper>

        {/* CENTRE : Canvas (preview) - CSS responsive pour largeur */}
        <Box className={styles.canvasWrapper}>
          <Box className={styles.canvasInner} style={{ width: viewport === 'mobile' ? 375 : viewport === 'tablet' ? 768 : '100%', maxWidth: '100%', boxShadow: viewport !== 'desktop' ? '0 0 20px rgba(0,0,0,0.15)' : 'none' }}>
            {iframeSrc && showCanvasLoader && !canvasReady && (
              <Box style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--mantine-color-gray-0)' }}>
                <LoadingScreen />
              </Box>
            )}
            <iframe
              ref={iframeRef}
              id="store-iframe"
              key={currentTemplate.path}
              src={iframeSrc}
              title="Ma boutique"
              style={{ width: '100%', height: '100%', border: 'none' }}
              onLoad={() => setCanvasReady(true)}
            />
            {draggedId && (
              <Box
                style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', pointerEvents: 'auto', zIndex: 50, minHeight: 200 }}
                onDragEnter={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
                onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
                onDragLeave={() => setDropOverIndex(null)}
              >
                <Text size="xs" c="dimmed" ta="center" py={4} style={{ background: 'rgba(255,255,255,0.9)', flexShrink: 0 }}>Glissez ici pour ajouter ou repositionner un bloc</Text>
                {orderedHomeBlocks.map((_, i) => (
                  <Box
                    key={`drop-${i}`}
                    style={{
                      flex: 1,
                      minHeight: 24,
                      border: dropOverIndex === i ? '2px dashed var(--mantine-color-green-6)' : 'none',
                      backgroundColor: dropOverIndex === i ? 'rgba(64, 192, 87, 0.08)' : 'transparent',
                      transition: 'border 0.1s, background 0.1s',
                    }}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy'; setDropOverIndex(i); }}
                    onDragLeave={() => setDropOverIndex((prev) => (prev === i ? null : prev))}
                    onDrop={(e) => handleCanvasDrop(e, i)}
                  >
                    {dropOverIndex === i && <Text size="xs" c="green" ta="center" mt={2}>Déposer ici</Text>}
                  </Box>
                ))}
                <Box
                  style={{
                    flex: 1,
                    minHeight: 24,
                    border: dropOverIndex === orderedHomeBlocks.length ? '2px dashed var(--mantine-color-green-6)' : 'none',
                    backgroundColor: dropOverIndex === orderedHomeBlocks.length ? 'rgba(64, 192, 87, 0.08)' : 'transparent',
                    transition: 'border 0.1s, background 0.1s',
                  }}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy'; setDropOverIndex(orderedHomeBlocks.length); }}
                  onDragLeave={() => setDropOverIndex((prev) => (prev === orderedHomeBlocks.length ? null : prev))}
                  onDrop={(e) => handleCanvasDrop(e, orderedHomeBlocks.length)}
                >
                  {dropOverIndex === orderedHomeBlocks.length && <Text size="xs" c="green" ta="center" mt={4}>Déposer ici</Text>}
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        {/* DROITE : Paramètres - sur mobile: affichage latéral avec croix, un seul panneau à la fois */}
        <Paper
          className={`${styles.sidePanel} ${styles.sidePanelRight} ${settingsOpen ? styles.sidePanelOpen : styles.sidePanelClosed}`}
          p="md"
          style={{ minHeight: 0, borderLeft: '1px solid var(--mantine-color-gray-2)', flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          radius={0}
        >
          {selectedBlock ? (
            <>
              <Group justify="space-between" mb="sm" wrap="nowrap">
                <Text size="sm" fw={600}>Paramètres du bloc</Text>
                <ActionIcon variant="subtle" size="sm" onClick={() => { closeSettings(); setSelectedBlock(null); }} className={styles.panelCloseBtn} aria-label="Fermer">
                  <IconX size={18} />
                </ActionIcon>
              </Group>
              <Text size="xs" c="dimmed" mb="md">Modifier : {HOME_BLOCKS.find((b) => b.id === selectedBlock)?.label}</Text>
              <Box style={{ flex: '1 1 0', minHeight: 0, overflowY: 'scroll', overflowX: 'hidden', scrollbarGutter: 'stable' }}>
                <BlockSettings selectedBlock={selectedBlock} customization={customization} update={update} updateNested={updateNested} />
              </Box>
              <Button size="xs" variant="subtle" mt="md" fullWidth onClick={() => setSelectedBlock(null)}>Désélectionner</Button>
            </>
          ) : (
            <Text size="sm" c="dimmed" mt="xl">Cliquez sur un bloc à gauche pour le modifier.</Text>
          )}
        </Paper>
      </Group>

      {typeof document !== 'undefined' &&
        leaveConfirmOpen &&
        createPortal(
          <LeaveConfirmPortal
            hasUnsavedChanges={hasUnsavedChanges}
            leaveSaveInProgress={leaveSaveInProgress}
            showAsUnsaved={hasUnsavedChanges || saveAndLeaveFlow}
            isLeaving={isLeaving}
            onClose={() => !leaveSaveInProgress && setLeaveConfirmOpen(false)}
            onLeaveWithoutSave={() => {
              allowLeaveRef.current = true;
              setIsLeaving(true);
              setTimeout(() => { window.location.href = '/dashboard/boutique'; }, LEAVE_FADE_MS + 20);
            }}
            onSaveAndLeave={async () => {
              setSaveAndLeaveFlow(true);
              setLeaveSaveInProgress(true);
              const ok = await handleSave();
              setLeaveSaveInProgress(false);
              if (ok) {
                allowLeaveRef.current = true;
                setIsLeaving(true);
                setTimeout(() => { window.location.href = '/dashboard/boutique'; }, LEAVE_FADE_MS + 20);
              } else {
                setSaveAndLeaveFlow(false);
              }
            }}
          />,
          document.body
        )}

      <Modal opened={shortcutsOpen} onClose={closeShortcuts} title="Raccourcis clavier" size="sm">
        <Stack gap="sm">
          <Group justify="space-between"><Text size="sm">Enregistrer</Text><Text size="xs" c="dimmed">Ctrl + S</Text></Group>
          <Group justify="space-between"><Text size="sm">Annuler</Text><Text size="xs" c="dimmed">Ctrl + Z</Text></Group>
          <Group justify="space-between"><Text size="sm">Rétablir</Text><Text size="xs" c="dimmed">Ctrl + Shift + Z</Text></Group>
          <Group justify="space-between"><Text size="sm">Ajouter un bloc</Text><Text size="xs" c="dimmed">Ctrl + Shift + A</Text></Group>
          <Group justify="space-between"><Text size="sm">Afficher les raccourcis</Text><Text size="xs" c="dimmed">Ctrl + /</Text></Group>
        </Stack>
      </Modal>

      <Modal opened={addBlockOpen} onClose={() => setAddBlockOpen(false)} title="Ajouter un bloc" size="sm">
        <Text size="sm" c="dimmed" mb="md">Choisissez un bloc à ajouter à la fin de la page. Même type plusieurs fois possible.</Text>
        <Stack gap={4}>
          {HOME_BLOCKS.filter((b) => b.template === 'home').map((b) => {
            const currentOrder = customization.sectionOrder ?? DEFAULT_SECTION_ORDER;
            return (
              <Button
                key={b.id}
                variant="light"
                size="sm"
                fullWidth
                onClick={() => {
                  update('sectionOrder', [...currentOrder, b.id]);
                  setAddBlockOpen(false);
                  selectBlock(b.id as BlockId);
                }}
              >
                {b.label}
              </Button>
            );
          })}
        </Stack>
      </Modal>
    </Box>
    </>
  );
}

function BlockSettings({
  selectedBlock,
  customization,
  update,
  updateNested,
}: {
  selectedBlock: BlockId;
  customization: ThemeCustomization;
  update: <K extends keyof ThemeCustomization>(k: K, v: ThemeCustomization[K]) => void;
  updateNested: <K extends keyof ThemeCustomization>(k: K, sk: string, v: string | number) => void;
}) {
  const [heroUploadLoading, setHeroUploadLoading] = useState(false);
  const defaultTestimonials = [
    { name: 'Amina K.', text: 'Excellente boutique !', rating: 5 },
    { name: 'Moussa D.', text: 'Livraison rapide.', rating: 5 },
    { name: 'Fatou S.', text: 'Très satisfaite.', rating: 5 },
  ];
  const testimonialItems = customization.testimonials?.items?.length ? customization.testimonials.items : defaultTestimonials;

  if (selectedBlock === 'header') return <Stack gap="sm"><TextInput label="URL du logo" placeholder="https://..." value={customization.logo ?? ''} onChange={(e) => update('logo', e.target.value)} /></Stack>;
  if (selectedBlock === 'promoBanner') return <Stack gap="sm"><TextInput label="Message promo" placeholder="Livraison gratuite dès 25 000 XOF" value={customization.promoBanner ?? ''} onChange={(e) => update('promoBanner', e.target.value)} /></Stack>;
  if (selectedBlock === 'hero') return (
    <Stack gap="sm">
      <TextInput label="Titre" placeholder="Bienvenue" value={customization.hero?.title ?? ''} onChange={(e) => updateNested('hero', 'title', e.target.value)} />
      <TextInput label="Sous-titre" placeholder="Découvrez..." value={customization.hero?.subtitle ?? ''} onChange={(e) => updateNested('hero', 'subtitle', e.target.value)} />
      <Text size="sm" fw={500}>Image bannière</Text>
      <Dropzone
        onDrop={async (files) => {
          const file = files[0];
          if (!file) return;
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error('Lecture impossible'));
            reader.readAsDataURL(file);
          });
          updateNested('hero', 'image', dataUrl);
          setHeroUploadLoading(true);
          try {
            const formData = new FormData();
            formData.append('file', file);
            const { data } = await api.post<{ url: string }>('/upload/image', formData);
            const fullUrl = data.url.startsWith('http') ? data.url : `${UPLOAD_BASE_URL}${data.url}`;
            updateNested('hero', 'image', fullUrl);
            notifications.show({ title: 'Image importée', color: 'green' });
          } catch (err: unknown) {
            const msg = err && typeof err === 'object' && 'response' in err
              ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
              : 'Erreur lors de l\'import';
            notifications.show({ title: 'Erreur', message: String(msg), color: 'red' });
            updateNested('hero', 'image', '');
          } finally {
            setHeroUploadLoading(false);
          }
        }}
        maxSize={5 * 1024 * 1024}
        accept={IMAGE_MIME_TYPE}
        loading={heroUploadLoading}
        maxFiles={1}
      >
        <Group justify="center" gap="xl" mih={80} style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload size={40} color="var(--mantine-color-blue-6)" stroke={1.5} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconUpload size={40} color="var(--mantine-color-red-6)" stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto size={40} color="var(--mantine-color-dimmed)" stroke={1.5} />
          </Dropzone.Idle>
          <div>
            <Text size="sm" inline>Glissez une image ici ou cliquez pour choisir</Text>
            <Text size="xs" c="dimmed" inline mt={4} display="block">JPEG, PNG, GIF ou WebP — max 5 Mo</Text>
          </div>
        </Group>
      </Dropzone>
      <TextInput label="Texte du bouton" placeholder="Voir les produits" value={customization.hero?.cta ?? ''} onChange={(e) => updateNested('hero', 'cta', e.target.value)} />
      <Select label="Alignement du texte" data={[{ value: 'left', label: 'Gauche' }, { value: 'center', label: 'Centre' }, { value: 'right', label: 'Droite' }]} value={customization.heroAlignment ?? 'center'} onChange={(v) => update('heroAlignment', (v as 'left' | 'center' | 'right') ?? 'center')} />
      <Select label="Hauteur de la bannière" data={[{ value: 'small', label: 'Petite' }, { value: 'medium', label: 'Moyenne' }, { value: 'large', label: 'Grande' }]} value={customization.heroHeight ?? 'medium'} onChange={(v) => update('heroHeight', (v as 'small' | 'medium' | 'large') ?? 'medium')} />
    </Stack>
  );
  if (selectedBlock === 'richText') return (
    <Stack gap="sm">
      <TextInput label="Titre" placeholder="À propos de nous" value={customization.richText?.heading ?? ''} onChange={(e) => updateNested('richText', 'heading', e.target.value)} />
      <Textarea label="Contenu" placeholder="Notre histoire..." rows={4} value={customization.richText?.content ?? ''} onChange={(e) => updateNested('richText', 'content', e.target.value)} />
    </Stack>
  );
  if (selectedBlock === 'featuredCarousel') return <Stack gap="sm"><TextInput label="Titre du carousel" placeholder="Nouveautés" value={customization.featuredCarousel?.title ?? ''} onChange={(e) => update('featuredCarousel', { ...customization.featuredCarousel, title: e.target.value })} /></Stack>;
  if (selectedBlock === 'featuredProducts') return (
    <Stack gap="sm">
      <TextInput label="Titre" placeholder="Tous nos produits" value={customization.featuredProducts?.title ?? ''} onChange={(e) => update('featuredProducts', { ...customization.featuredProducts, title: e.target.value })} />
      <NumberInput label="Nombre de produits" placeholder="6" min={2} max={24} value={customization.featuredProducts?.limit ?? 6} onChange={(v) => update('featuredProducts', { ...customization.featuredProducts, limit: typeof v === 'string' ? parseInt(v, 10) || 6 : v })} />
    </Stack>
  );
  if (selectedBlock === 'testimonials') return (
    <Stack gap="sm">
      <TextInput label="Titre" placeholder="Ce que disent nos clients" value={customization.testimonials?.title ?? ''} onChange={(e) => update('testimonials', { ...customization.testimonials, title: e.target.value })} />
      <Text size="xs" fw={500}>Témoignages</Text>
      {testimonialItems.map((item, idx) => (
        <Stack key={idx} gap="xs" p="xs" style={{ border: '1px solid var(--mantine-color-gray-2)', borderRadius: 8 }}>
          <TextInput size="xs" placeholder="Nom" value={item.name} onChange={(e) => { const items = [...testimonialItems]; items[idx] = { ...items[idx], name: e.target.value }; update('testimonials', { ...customization.testimonials, items }); }} />
          <Textarea size="xs" placeholder="Témoignage" rows={2} value={item.text} onChange={(e) => { const items = [...testimonialItems]; items[idx] = { ...items[idx], text: e.target.value }; update('testimonials', { ...customization.testimonials, items }); }} />
          <NumberInput size="xs" placeholder="Note 1-5" min={1} max={5} value={item.rating} onChange={(v) => { const items = [...testimonialItems]; items[idx] = { ...items[idx], rating: typeof v === 'string' ? parseInt(v, 10) || 5 : v }; update('testimonials', { ...customization.testimonials, items }); }} />
        </Stack>
      ))}
    </Stack>
  );
  if (selectedBlock === 'newsletter') return <TextInput label="Titre" placeholder="Restez informé" value={customization.newsletterTitle ?? ''} onChange={(e) => update('newsletterTitle', e.target.value)} />;
  if (selectedBlock === 'footer') return (
    <Stack gap="sm">
      <TextInput label="Tagline" placeholder="© Ma Boutique" value={customization.footer?.tagline ?? ''} onChange={(e) => update('footer', { ...customization.footer, tagline: e.target.value, links: customization.footer?.links ?? [] })} />
      <Text size="xs" fw={500}>Liens</Text>
      {(customization.footer?.links ?? []).map((link, idx) => (
        <Group key={idx} gap="xs" wrap="wrap" grow style={{ minWidth: 0 }}>
          <TextInput placeholder="Label" size="xs" value={link.label} onChange={(e) => { const links = [...(customization.footer?.links ?? [])]; links[idx] = { ...links[idx], label: e.target.value }; update('footer', { ...customization.footer, links }); }} style={{ minWidth: 0, flex: 1 }} />
          <TextInput placeholder="/products" size="xs" value={link.href} onChange={(e) => { const links = [...(customization.footer?.links ?? [])]; links[idx] = { ...links[idx], href: e.target.value }; update('footer', { ...customization.footer, links }); }} style={{ minWidth: 0, flex: 1 }} />
          <ActionIcon size="sm" color="red" variant="subtle" onClick={() => update('footer', { ...customization.footer, links: (customization.footer?.links ?? []).filter((_, i) => i !== idx) })}><IconTrash size={14} /></ActionIcon>
        </Group>
      ))}
      <Button size="xs" variant="light" leftSection={<IconPlus size={14} />} onClick={() => update('footer', { ...customization.footer, links: [...(customization.footer?.links ?? []), { label: '', href: '' }] })}>Ajouter un lien</Button>
    </Stack>
  );
  if (selectedBlock === 'colors') return (
    <Stack gap="sm">
      <ColorInput label="Couleur principale" value={customization.colors?.primary ?? ''} onChange={(v) => update('colors', { ...customization.colors, primary: v })} />
      <ColorInput label="Couleur secondaire" value={customization.colors?.secondary ?? ''} onChange={(v) => update('colors', { ...customization.colors, secondary: v })} />
      <ColorInput label="Accent" value={customization.colors?.accent ?? ''} onChange={(v) => update('colors', { ...customization.colors, accent: v })} />
      <ColorInput label="Fond" value={customization.colors?.bg ?? ''} onChange={(v) => update('colors', { ...customization.colors, bg: v })} />
      <ColorInput label="Texte" value={customization.colors?.text ?? ''} onChange={(v) => update('colors', { ...customization.colors, text: v })} />
    </Stack>
  );
  if (selectedBlock === 'contact') return (
    <Stack gap="sm">
      <TextInput label="Email" placeholder="contact@..." value={customization.contact?.email ?? ''} onChange={(e) => updateNested('contact', 'email', e.target.value)} />
      <TextInput label="Téléphone" placeholder="+221..." value={customization.contact?.phone ?? ''} onChange={(e) => updateNested('contact', 'phone', e.target.value)} />
    </Stack>
  );
  if (selectedBlock === 'about') return (
    <Stack gap="sm">
      <TextInput label="Titre" placeholder="À propos" value={customization.about?.title ?? ''} onChange={(e) => updateNested('about', 'title', e.target.value)} />
      <Textarea label="Contenu" placeholder="Notre histoire..." rows={4} value={customization.about?.content ?? ''} onChange={(e) => updateNested('about', 'content', e.target.value)} />
    </Stack>
  );
  if (selectedBlock === 'categories')
    return (
      <Stack gap="sm">
        <TextInput label="Titre" placeholder="Parcourir par catégorie" value={customization.categories?.title ?? ''} onChange={(e) => update('categories', { ...customization.categories, title: e.target.value })} />
        <NumberInput label="Nombre max de catégories" placeholder="Toutes" min={1} max={12} value={customization.categories?.limit ?? undefined} onChange={(v) => update('categories', { ...customization.categories, limit: typeof v === 'string' ? undefined : v })} />
      </Stack>
    );
  if (selectedBlock === 'video')
    return (
      <Stack gap="sm">
        <TextInput label="URL vidéo" placeholder="https://youtube.com/... ou https://vimeo.com/..." value={customization.video?.url ?? ''} onChange={(e) => update('video', { ...customization.video, url: e.target.value })} />
        <TextInput label="Titre (optionnel)" placeholder="Notre vidéo" value={customization.video?.title ?? ''} onChange={(e) => update('video', { ...customization.video, title: e.target.value })} />
      </Stack>
    );
  if (selectedBlock === 'imageText')
    return (
      <Stack gap="sm">
        <TextInput label="URL image" placeholder="https://..." value={customization.imageText?.imageUrl ?? ''} onChange={(e) => update('imageText', { ...customization.imageText, imageUrl: e.target.value })} />
        <TextInput label="Titre" placeholder="Notre histoire" value={customization.imageText?.title ?? ''} onChange={(e) => update('imageText', { ...customization.imageText, title: e.target.value })} />
        <Textarea label="Contenu" placeholder="Texte..." rows={3} value={customization.imageText?.content ?? ''} onChange={(e) => update('imageText', { ...customization.imageText, content: e.target.value })} />
        <Select label="Position image" data={[{ value: 'left', label: 'Gauche' }, { value: 'right', label: 'Droite' }]} value={customization.imageText?.position ?? 'left'} onChange={(v) => update('imageText', { ...customization.imageText, position: (v as 'left' | 'right') ?? 'left' })} />
        <TextInput label="Texte bouton (optionnel)" value={customization.imageText?.ctaText ?? ''} onChange={(e) => update('imageText', { ...customization.imageText, ctaText: e.target.value })} />
        <TextInput label="Lien bouton" placeholder="/products" value={customization.imageText?.ctaHref ?? ''} onChange={(e) => update('imageText', { ...customization.imageText, ctaHref: e.target.value })} />
      </Stack>
    );
  if (selectedBlock === 'separator')
    return (
      <Stack gap="sm">
        <Select label="Style" data={[{ value: 'line', label: 'Ligne' }, { value: 'dashed', label: 'Tirets' }, { value: 'dotted', label: 'Pointillé' }, { value: 'space', label: 'Espace' }]} value={customization.separator?.style ?? 'line'} onChange={(v) => update('separator', { ...customization.separator, style: (v as 'line' | 'space' | 'dotted' | 'dashed') ?? 'line' })} />
        <NumberInput label="Épaisseur (px)" min={1} max={100} value={customization.separator?.thickness ?? 2} onChange={(v) => update('separator', { ...customization.separator, thickness: typeof v === 'string' ? 2 : v })} />
        <TextInput label="Couleur (optionnel)" placeholder="#ccc" value={customization.separator?.color ?? ''} onChange={(e) => update('separator', { ...customization.separator, color: e.target.value })} />
      </Stack>
    );
  if (selectedBlock === 'countdown')
    return (
      <Stack gap="sm">
        <TextInput label="Date et heure de fin (ISO)" placeholder="2025-12-31T23:59:59" value={customization.countdown?.endDate ?? ''} onChange={(e) => update('countdown', { ...customization.countdown, endDate: e.target.value })} />
        <TextInput label="Titre (optionnel)" placeholder="Offre se termine dans" value={customization.countdown?.label ?? ''} onChange={(e) => update('countdown', { ...customization.countdown, label: e.target.value })} />
      </Stack>
    );
  if (selectedBlock === 'ctaButtons')
    return (
      <Stack gap="sm">
        <TextInput label="Bouton principal - Texte" placeholder="Voir les produits" value={customization.ctaButtons?.primaryText ?? ''} onChange={(e) => update('ctaButtons', { ...customization.ctaButtons, primaryText: e.target.value })} />
        <TextInput label="Bouton principal - Lien" placeholder="/products" value={customization.ctaButtons?.primaryHref ?? ''} onChange={(e) => update('ctaButtons', { ...customization.ctaButtons, primaryHref: e.target.value })} />
        <TextInput label="Bouton secondaire - Texte (optionnel)" value={customization.ctaButtons?.secondaryText ?? ''} onChange={(e) => update('ctaButtons', { ...customization.ctaButtons, secondaryText: e.target.value })} />
        <TextInput label="Bouton secondaire - Lien" value={customization.ctaButtons?.secondaryHref ?? ''} onChange={(e) => update('ctaButtons', { ...customization.ctaButtons, secondaryHref: e.target.value })} />
      </Stack>
    );
  if (selectedBlock === 'faq') {
    const faqItems = customization.faq?.items?.length ? customization.faq.items : [{ question: '', answer: '' }];
    return (
      <Stack gap="sm">
        <TextInput label="Titre section" placeholder="Questions fréquentes" value={customization.faq?.title ?? ''} onChange={(e) => update('faq', { ...customization.faq, title: e.target.value })} />
        <Text size="xs" fw={500}>Questions / Réponses</Text>
        {faqItems.map((item, idx) => (
          <Stack key={idx} gap="xs" p="xs" style={{ border: '1px solid var(--mantine-color-gray-2)', borderRadius: 8 }}>
            <TextInput size="xs" placeholder="Question" value={item.question} onChange={(e) => { const items = [...faqItems]; items[idx] = { ...items[idx], question: e.target.value }; update('faq', { ...customization.faq, items }); }} />
            <Textarea size="xs" placeholder="Réponse" rows={2} value={item.answer} onChange={(e) => { const items = [...faqItems]; items[idx] = { ...items[idx], answer: e.target.value }; update('faq', { ...customization.faq, items }); }} />
            <ActionIcon size="sm" color="red" variant="subtle" onClick={() => update('faq', { ...customization.faq, items: faqItems.filter((_, i) => i !== idx) })}><IconTrash size={14} /></ActionIcon>
          </Stack>
        ))}
        <Button size="xs" variant="light" leftSection={<IconPlus size={14} />} onClick={() => update('faq', { ...customization.faq, items: [...faqItems, { question: '', answer: '' }] })}>Ajouter une question</Button>
      </Stack>
    );
  }
  if (selectedBlock === 'socialLinks')
    return (
      <Stack gap="sm">
        <TextInput label="Facebook (URL)" placeholder="https://facebook.com/..." value={customization.socialLinks?.facebook ?? ''} onChange={(e) => update('socialLinks', { ...customization.socialLinks, facebook: e.target.value })} />
        <TextInput label="Instagram (URL)" placeholder="https://instagram.com/..." value={customization.socialLinks?.instagram ?? ''} onChange={(e) => update('socialLinks', { ...customization.socialLinks, instagram: e.target.value })} />
        <TextInput label="WhatsApp (URL ou numéro)" placeholder="+221771234567" value={customization.socialLinks?.whatsapp ?? ''} onChange={(e) => update('socialLinks', { ...customization.socialLinks, whatsapp: e.target.value })} />
        <TextInput label="Twitter / X (URL)" placeholder="https://twitter.com/..." value={customization.socialLinks?.twitter ?? ''} onChange={(e) => update('socialLinks', { ...customization.socialLinks, twitter: e.target.value })} />
      </Stack>
    );
  if (selectedBlock === 'trustBadges') {
    const badgeItems = customization.trustBadges?.items?.length ? customization.trustBadges.items : [{ icon: '🔒', text: 'Paiement sécurisé' }];
    return (
      <Stack gap="sm">
        <Text size="xs" c="dimmed">Ex. Paiement sécurisé, Livraison rapide</Text>
        {badgeItems.map((item, idx) => (
          <Stack key={idx} gap="xs" p="xs" style={{ border: '1px solid var(--mantine-color-gray-2)', borderRadius: 8 }}>
            <TextInput size="xs" placeholder="Emoji ou icône (optionnel)" value={item.icon ?? ''} onChange={(e) => { const items = [...badgeItems]; items[idx] = { ...items[idx], icon: e.target.value }; update('trustBadges', { items }); }} />
            <TextInput size="xs" placeholder="Texte" value={item.text} onChange={(e) => { const items = [...badgeItems]; items[idx] = { ...items[idx], text: e.target.value }; update('trustBadges', { items }); }} />
            <ActionIcon size="sm" color="red" variant="subtle" onClick={() => update('trustBadges', { items: badgeItems.filter((_, i) => i !== idx) })}><IconTrash size={14} /></ActionIcon>
          </Stack>
        ))}
        <Button size="xs" variant="light" leftSection={<IconPlus size={14} />} onClick={() => update('trustBadges', { items: [...badgeItems, { text: '' }] })}>Ajouter un badge</Button>
      </Stack>
    );
  }
  if (selectedBlock === 'colors') {
    const COLOR_PRESETS: Record<string, { primary: string; secondary: string; accent: string; bg: string; text: string }> = {
      classique: { primary: '#1a1a2e', secondary: '#16213e', accent: '#0f3460', bg: '#f8f9fa', text: '#212529' },
      mode: { primary: '#2d132c', secondary: '#801336', accent: '#c72c41', bg: '#faf5f6', text: '#2d132c' },
      tech: { primary: '#0d1b2a', secondary: '#1b263b', accent: '#00b4d8', bg: '#0d1b2a', text: '#e0e0e0' },
      nature: { primary: '#2d5016', secondary: '#7cb342', accent: '#ff8f00', bg: '#f5f5dc', text: '#2d5016' },
      luxe: { primary: '#1a1a1a', secondary: '#2d2d2d', accent: '#c9a227', bg: '#0d0d0d', text: '#e5e5e5' },
      minimal: { primary: '#212529', secondary: '#495057', accent: '#212529', bg: '#ffffff', text: '#212529' },
    };
    return (
      <Stack gap="sm">
        <Text size="xs" fw={600}>Presets (appliquer en un clic)</Text>
        <Group gap="xs">
          {Object.entries(COLOR_PRESETS).map(([name, c]) => (
            <Button key={name} size="xs" variant="light" onClick={() => update('colors', c)}>{name}</Button>
          ))}
        </Group>
        <Divider />
        <ColorInput label="Couleur principale" value={customization.colors?.primary ?? ''} onChange={(v) => update('colors', { ...customization.colors, primary: v })} />
        <ColorInput label="Couleur secondaire" value={customization.colors?.secondary ?? ''} onChange={(v) => update('colors', { ...customization.colors, secondary: v })} />
        <ColorInput label="Accent" value={customization.colors?.accent ?? ''} onChange={(v) => update('colors', { ...customization.colors, accent: v })} />
        <ColorInput label="Fond" value={customization.colors?.bg ?? ''} onChange={(v) => update('colors', { ...customization.colors, bg: v })} />
        <ColorInput label="Texte" value={customization.colors?.text ?? ''} onChange={(v) => update('colors', { ...customization.colors, text: v })} />
      </Stack>
    );
  }
  return null;
}
