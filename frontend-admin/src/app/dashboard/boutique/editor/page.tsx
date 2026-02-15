'use client';

import { useLayoutEffect, useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Box, Button, Group, Text, Alert } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAlertTriangle } from '@tabler/icons-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useStoreStore } from '@/stores/storeStore';
import { useEditorState, useEditorLoad, useEditorSave, useEditorIframe, useEditorDragDrop } from './hooks';
import { LeaveConfirmPortal } from './components/LeaveConfirmPortal';
import { EditorToolbar } from './components/EditorToolbar';
import { BlockLibrary } from './components/BlockLibrary';
import { EditorCanvas } from './components/EditorCanvas';
import { BlockSettingsPanel } from './components/BlockSettingsPanel';
import { ShortcutsModal, AddBlockModal } from './components/EditorModals';
import { EDITOR_CACHED_KEY, DEFAULT_SECTION_ORDER, HOME_BLOCKS, TEMPLATES, LEAVE_FADE_MS } from './editor-constants';
import type { BlockId, Template } from './editor-types';
import styles from './editor.module.css';

export default function BoutiqueEditorPage() {
  const searchParams = useSearchParams();
  const storeId = searchParams.get('storeId');
  const currentStore = useStoreStore((s) => s.currentStore);
  const slug = currentStore?.slug ?? searchParams.get('slug') ?? '';

  const editorState = useEditorState();
  const { handleSave, saving, saved, lastSavedRef, hasUnsavedChanges } = useEditorSave(
    editorState.customization,
    currentStore
  );
  useEditorLoad({
    storeId,
    slug,
    setCustomization: editorState.setCustomization,
    setHistory: editorState.setHistory,
    setHistoryIndex: editorState.setHistoryIndex,
    lastSavedRef,
  });

  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [blockSearch, setBlockSearch] = useState('');
  const [shortcutsOpen, { open: openShortcuts, close: closeShortcuts, toggle: toggleShortcuts }] = useDisclosure(false);
  const [currentTemplate, setCurrentTemplate] = useState<Template>(TEMPLATES[0]);
  const [libraryOpen, { open: openLibrary, close: closeLibrary }] = useDisclosure(false);
  const [settingsOpen, { open: openSettings, close: closeSettings }] = useDisclosure(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [cachedFromSession, setCachedFromSession] = useState(false);
  const [addBlockOpen, setAddBlockOpen] = useState(false);
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);
  const [leaveSaveInProgress, setLeaveSaveInProgress] = useState(false);
  const [saveAndLeaveFlow, setSaveAndLeaveFlow] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const allowLeaveRef = useRef(false);

  const dragDrop = useEditorDragDrop({
    orderedHomeBlocks: editorState.orderedHomeBlocks,
    selectedBlock: editorState.selectedBlock,
    update: editorState.update,
    setSelectedBlock: editorState.setSelectedBlock,
  });

  const selectBlockCore = useCallback(
    (blockId: BlockId) => {
      editorState.setSelectedBlock(blockId);
      closeLibrary();
      openSettings();
    },
    [closeLibrary, openSettings, editorState]
  );

  const iframe = useEditorIframe(
    slug ? `${process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3002'}/s/${slug}${currentTemplate.path}?editor=1` : '',
    editorState.customization,
    previewMode,
    editorState.selectedBlock,
    selectBlockCore,
    dragDrop.removeBlockAtIndex
  );

  const selectBlock = useCallback(
    (blockId: BlockId) => {
      selectBlockCore(blockId);
      iframe.scrollToBlock(blockId);
    },
    [selectBlockCore, iframe]
  );

  useLayoutEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage?.getItem(EDITOR_CACHED_KEY) === '1') {
        setCachedFromSession(true);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 64em)');
    const handler = () => {
      if (mq.matches) {
        closeLibrary();
        closeSettings();
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [closeLibrary, closeSettings]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        e.shiftKey ? editorState.redo() : editorState.undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        toggleShortcuts();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setAddBlockOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSave, editorState.undo, editorState.redo, toggleShortcuts]);

  useEffect(() => {
    if (!autoSaveEnabled) return;
    const t = setTimeout(() => handleSave(), 4000);
    return () => clearTimeout(t);
  }, [autoSaveEnabled, editorState.customization, handleSave]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (allowLeaveRef.current) return;
      if (JSON.stringify(editorState.customization) !== lastSavedRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [editorState.customization, lastSavedRef]);

  const handleLeaveWithoutSave = useCallback(() => {
    allowLeaveRef.current = true;
    setIsLeaving(true);
    setTimeout(() => {
      window.location.href = '/dashboard/boutique';
    }, LEAVE_FADE_MS + 20);
  }, []);

  const handleSaveAndLeave = useCallback(async () => {
    setSaveAndLeaveFlow(true);
    setLeaveSaveInProgress(true);
    const ok = await handleSave();
    setLeaveSaveInProgress(false);
    if (ok) handleLeaveWithoutSave();
    else setSaveAndLeaveFlow(false);
  }, [handleSave, handleLeaveWithoutSave]);

  const openLibraryOnly = useCallback(() => {
    closeSettings();
    openLibrary();
  }, [closeSettings, openLibrary]);

  const openSettingsOnly = useCallback(() => {
    closeLibrary();
    openSettings();
  }, [closeLibrary, openSettings]);

  if (!slug) {
    return (
      <Box p="xl">
        <Text c="dimmed">Chargement...</Text>
        <Button component={Link} href="/dashboard/boutique" variant="subtle" mt="md">
          Retour à la boutique
        </Button>
      </Box>
    );
  }

  const iframeSrc = slug ? `${process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3002'}/s/${slug}${currentTemplate.path}?editor=1` : '';
  const showEditorContent = cachedFromSession || iframe.canvasReady;

  return (
    <>
      {!showEditorContent && (
        <Box
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--mantine-color-gray-0)',
          }}
        >
          <LoadingScreen />
        </Box>
      )}
      <Box className={styles.root}>
        <EditorToolbar
          className={styles.toolbar}
          currentStoreName={currentStore?.name ?? null}
          onLeave={() => setLeaveConfirmOpen(true)}
          onSave={() => handleSave()}
          saving={saving}
          saved={saved}
          hasUnsavedChanges={hasUnsavedChanges}
          isLeaving={isLeaving}
          historyIndex={editorState.historyIndex}
          historyLength={editorState.history.length}
          onUndo={editorState.undo}
          onRedo={editorState.redo}
          onShortcuts={openShortcuts}
          onAddBlock={() => setAddBlockOpen(true)}
          selectedBlock={editorState.selectedBlock}
          onLibrary={openLibraryOnly}
          onSettings={openSettingsOnly}
          autoSaveEnabled={autoSaveEnabled}
          onAutoSaveChange={setAutoSaveEnabled}
          currentTemplateId={currentTemplate.id}
          onTemplateChange={(v) => setCurrentTemplate(TEMPLATES.find((t) => t.id === v) ?? TEMPLATES[0])}
          viewport={viewport}
          onViewportChange={setViewport}
          previewMode={previewMode}
          onPreviewToggle={() => setPreviewMode((p) => !p)}
        />

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
          <BlockLibrary
            className={`${styles.sidePanel} ${styles.sidePanelLeft} ${libraryOpen ? styles.sidePanelOpen : styles.sidePanelClosed}`}
            panelCloseClassName={styles.panelCloseBtn}
            blockSearch={blockSearch}
            onBlockSearchChange={setBlockSearch}
            selectedBlock={editorState.selectedBlock}
            draggedId={dragDrop.draggedId}
            onSelectBlock={(id) => {
              selectBlock(id);
              iframe.scrollToBlock(id);
            }}
            onLibraryDragStart={dragDrop.handleLibraryDragStart}
            onDragEnd={dragDrop.handleDragEnd}
            onResetOrder={() => editorState.update('sectionOrder', undefined)}
            onClose={closeLibrary}
          />

          <EditorCanvas
            className={styles.canvasWrapper}
            iframeRef={iframe.iframeRef}
            iframeSrc={iframeSrc}
            currentTemplatePath={currentTemplate.path}
            viewport={viewport}
            showCanvasLoader={iframe.showCanvasLoader}
            canvasReady={iframe.canvasReady}
            onIframeLoad={iframe.onIframeLoad}
            draggedId={dragDrop.draggedId}
            dropOverIndex={dragDrop.dropOverIndex}
            orderedHomeBlocks={editorState.orderedHomeBlocks}
            setDropOverIndex={dragDrop.setDropOverIndex}
            onCanvasDrop={dragDrop.handleCanvasDrop}
          />

          <BlockSettingsPanel
            className={`${styles.sidePanel} ${styles.sidePanelRight} ${settingsOpen ? styles.sidePanelOpen : styles.sidePanelClosed}`}
            panelCloseClassName={styles.panelCloseBtn}
            selectedBlock={editorState.selectedBlock}
            customization={editorState.customization}
            update={editorState.update}
            updateNested={editorState.updateNested}
            onClose={() => {
              closeSettings();
              editorState.setSelectedBlock(null);
            }}
            onDeselect={() => editorState.setSelectedBlock(null)}
          />
        </Group>

        {typeof document !== 'undefined' && leaveConfirmOpen && createPortal(
          <LeaveConfirmPortal
            hasUnsavedChanges={hasUnsavedChanges}
            leaveSaveInProgress={leaveSaveInProgress}
            showAsUnsaved={hasUnsavedChanges || saveAndLeaveFlow}
            isLeaving={isLeaving}
            onClose={() => !leaveSaveInProgress && setLeaveConfirmOpen(false)}
            onLeaveWithoutSave={handleLeaveWithoutSave}
            onSaveAndLeave={handleSaveAndLeave}
          />,
          document.body
        )}

        <ShortcutsModal opened={shortcutsOpen} onClose={closeShortcuts} />

        <AddBlockModal
          opened={addBlockOpen}
          onClose={() => setAddBlockOpen(false)}
          onAddBlock={(blockId) => {
            const currentOrder = editorState.customization.sectionOrder ?? DEFAULT_SECTION_ORDER;
            editorState.update('sectionOrder', [...currentOrder, blockId]);
            setAddBlockOpen(false);
            selectBlock(blockId);
            iframe.scrollToBlock(blockId);
          }}
        />
      </Box>
    </>
  );
}
