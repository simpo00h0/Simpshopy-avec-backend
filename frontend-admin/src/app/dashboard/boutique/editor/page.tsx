'use client';

import { useLayoutEffect, useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Box, Button, Group, Text, Alert } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useStoreStore } from '@/stores/storeStore';
import { useEditorState, useEditorLoad, useEditorSave, useEditorIframe, useEditorDragDrop, useEditorKeyboardShortcuts } from './hooks';
import { LeaveConfirmPortal } from './components/LeaveConfirmPortal';
import { EditorToolbar } from './components/EditorToolbar';
import { BlockLibrary } from './components/BlockLibrary';
import { EditorCanvas } from './components/EditorCanvas';
import { BlockSettingsPanel } from './components/BlockSettingsPanel';
import { ShortcutsModal, AddBlockModal } from './components/EditorModals';
import { EDITOR_CACHED_KEY, DEFAULT_SECTION_ORDER, TEMPLATES, LEAVE_FADE_MS } from './editor-constants';
import { getEditorIframeSrc } from './editor-utils';
import { useEditorUIStore } from './editor-ui-store';
import type { BlockId } from './editor-types';
import styles from './editor.module.css';

export default function BoutiqueEditorPage() {
  const searchParams = useSearchParams();
  const storeId = searchParams.get('storeId');
  const currentStore = useStoreStore((s) => s.currentStore);
  const subdomain = currentStore?.subdomain ?? searchParams.get('subdomain') ?? '';

  const editorState = useEditorState();
  const { handleSave, saving, saved, lastSavedRef, hasUnsavedChanges } = useEditorSave(
    editorState.customization,
    currentStore,
    undefined,
    editorState.setCustomization
  );
  useEditorLoad({
    storeId,
    subdomain,
    setCustomization: editorState.setCustomization,
    setHistory: editorState.setHistory,
    setHistoryIndex: editorState.setHistoryIndex,
    lastSavedRef,
  });

  const ui = useEditorUIStore();
  const [cachedFromSession, setCachedFromSession] = useState(false);
  const allowLeaveRef = useRef(false);

  const selectBlockCore = useCallback(
    (blockId: string) => {
      editorState.setSelectedBlock(blockId);
      useEditorUIStore.getState().closeLibrary();
      useEditorUIStore.getState().openSettings();
    },
    [editorState]
  );

  const dragDrop = useEditorDragDrop({
    orderedHomeBlocks: editorState.orderedHomeBlocks,
    selectedBlock: editorState.selectedBlock,
    addBlockAt: editorState.addBlockAt,
    removeBlock: editorState.removeBlock,
    reorderBlocks: editorState.reorderBlocks,
    setSelectedBlock: editorState.setSelectedBlock,
    onLogoBlockSelect: () => {
      const instanceId = editorState.ensureLogoBlock();
      selectBlockCore(instanceId);
      useEditorUIStore.getState().openSettings();
    },
  });

  const iframe = useEditorIframe(
    getEditorIframeSrc(subdomain, ui.currentTemplate.path),
    editorState.customization,
    ui.previewMode,
    editorState.selectedBlock,
    selectBlockCore,
    editorState.removeBlock
  );

  const selectBlock = useCallback(
    (blockId: string) => {
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
      if (mq.matches) useEditorUIStore.getState().closePanels();
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEditorKeyboardShortcuts({
    handleSave,
    undo: editorState.undo,
    redo: editorState.redo,
    toggleShortcuts: ui.toggleShortcuts,
    setAddBlockOpen: ui.setAddBlockOpen,
    customization: editorState.customization,
    lastSavedRef,
    allowLeaveRef,
  });

  useEffect(() => {
    if (!ui.autoSaveEnabled) return;
    const t = setTimeout(() => handleSave(), 4000);
    return () => clearTimeout(t);
  }, [ui.autoSaveEnabled, editorState.customization, handleSave]);

  const handleLeaveWithoutSave = useCallback(() => {
    allowLeaveRef.current = true;
    useEditorUIStore.getState().setIsLeaving(true);
    setTimeout(() => {
      window.location.href = '/dashboard/boutique';
    }, LEAVE_FADE_MS + 20);
  }, []);

  const handleSaveAndLeave = useCallback(async () => {
    const store = useEditorUIStore.getState();
    store.setSaveAndLeaveFlow(true);
    store.setLeaveSaveInProgress(true);
    const ok = await handleSave();
    store.setLeaveSaveInProgress(false);
    if (ok) handleLeaveWithoutSave();
    else store.setSaveAndLeaveFlow(false);
  }, [handleSave, handleLeaveWithoutSave]);

  const openLibraryOnly = useCallback(() => useEditorUIStore.getState().openLibrary(), []);
  const openSettingsOnly = useCallback(() => useEditorUIStore.getState().openSettings(), []);

  if (!subdomain) {
    return (
      <Box p="xl">
        <Text c="dimmed">{storeId ? 'Chargement de la boutique...' : 'Aucune boutique sélectionnée. Retournez à la boutique pour en choisir une.'}</Text>
        <Button component={Link} href="/dashboard/boutique" variant="subtle" mt="md">
          Retour à la boutique
        </Button>
      </Box>
    );
  }

  const iframeSrc = getEditorIframeSrc(subdomain, ui.currentTemplate.path);
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
          onLeave={() => ui.setLeaveConfirmOpen(true)}
          onSave={() => handleSave()}
          saving={saving}
          saved={saved}
          hasUnsavedChanges={hasUnsavedChanges}
          isLeaving={ui.isLeaving}
          historyIndex={editorState.historyIndex}
          historyLength={editorState.history.length}
          onUndo={editorState.undo}
          onRedo={editorState.redo}
          onShortcuts={ui.openShortcuts}
          onAddBlock={() => ui.setAddBlockOpen(true)}
          selectedBlock={editorState.selectedBlock}
          onLibrary={openLibraryOnly}
          onSettings={openSettingsOnly}
          autoSaveEnabled={ui.autoSaveEnabled}
          onAutoSaveChange={ui.setAutoSaveEnabled}
          currentTemplateId={ui.currentTemplate.id}
          onTemplateChange={(v) => ui.setCurrentTemplate(TEMPLATES.find((t) => t.id === v) ?? TEMPLATES[0])}
          viewport={ui.viewport}
          onViewportChange={ui.setViewport}
          previewMode={ui.previewMode}
          onPreviewToggle={() => ui.setPreviewMode(!ui.previewMode)}
        />

        {hasUnsavedChanges && !ui.isLeaving && (
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
            className={`${styles.sidePanel} ${styles.sidePanelLeft} ${ui.libraryOpen ? styles.sidePanelOpen : styles.sidePanelClosed}`}
            panelCloseClassName={styles.panelCloseBtn}
            blockSearch={ui.blockSearch}
            onBlockSearchChange={ui.setBlockSearch}
            draggedId={dragDrop.draggedId}
            onSelectBlock={(id) => {
              if (id === 'logo') {
                const instanceId = editorState.ensureLogoBlock();
                selectBlockCore(instanceId);
                useEditorUIStore.getState().openSettings();
                return;
              }
              const instanceId = id.startsWith('b-') ? id : editorState.addBlock(id as BlockId);
              selectBlock(instanceId);
              iframe.scrollToBlock(instanceId);
            }}
            onLibraryDragStart={dragDrop.handleLibraryDragStart}
            onDragEnd={dragDrop.handleDragEnd}
            onResetOrder={editorState.resetToDefaults}
            onClose={ui.closeLibrary}
          />

          <EditorCanvas
            className={styles.canvasWrapper}
            iframeRef={iframe.iframeRef}
            iframeSrc={iframeSrc}
            currentTemplatePath={ui.currentTemplate.path}
            viewport={ui.viewport}
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
            className={`${styles.sidePanel} ${styles.sidePanelRight} ${ui.settingsOpen ? styles.sidePanelOpen : styles.sidePanelClosed}`}
            panelCloseClassName={styles.panelCloseBtn}
            selectedBlock={editorState.selectedBlock}
            customization={editorState.customization}
            update={editorState.update}
            updateNested={editorState.updateNested}
            updateBlockData={editorState.updateBlockData}
            updateBlockNested={editorState.updateBlockNested}
            blocks={editorState.blocks}
            onClose={() => {
              ui.closeSettings();
              editorState.setSelectedBlock(null);
            }}
            onDeselect={() => editorState.setSelectedBlock(null)}
          />
        </Group>

        {typeof document !== 'undefined' && ui.leaveConfirmOpen && createPortal(
          <LeaveConfirmPortal
            hasUnsavedChanges={hasUnsavedChanges}
            leaveSaveInProgress={ui.leaveSaveInProgress}
            showAsUnsaved={hasUnsavedChanges || ui.saveAndLeaveFlow}
            isLeaving={ui.isLeaving}
            onClose={() => !ui.leaveSaveInProgress && ui.setLeaveConfirmOpen(false)}
            onLeaveWithoutSave={handleLeaveWithoutSave}
            onSaveAndLeave={handleSaveAndLeave}
          />,
          document.body
        )}

        <ShortcutsModal opened={ui.shortcutsOpen} onClose={ui.closeShortcuts} />

        <AddBlockModal
          opened={ui.addBlockOpen}
          onClose={() => ui.setAddBlockOpen(false)}
          onAddBlock={(typeId) => {
            if (typeId === 'logo') {
              const instanceId = editorState.ensureLogoBlock();
              ui.setAddBlockOpen(false);
              selectBlockCore(instanceId);
              useEditorUIStore.getState().openSettings();
              return;
            }
            const instanceId = editorState.addBlock(typeId);
            ui.setAddBlockOpen(false);
            selectBlock(instanceId);
            iframe.scrollToBlock(instanceId);
          }}
        />
      </Box>
    </>
  );
}
