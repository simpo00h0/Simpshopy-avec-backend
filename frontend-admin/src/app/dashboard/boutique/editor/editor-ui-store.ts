'use client';

import { create } from 'zustand';
import type { Template } from './editor-types';
import { TEMPLATES } from './editor-constants';

type Viewport = 'desktop' | 'tablet' | 'mobile';

interface EditorUIState {
  viewport: Viewport;
  blockSearch: string;
  currentTemplate: Template;
  previewMode: boolean;
  libraryOpen: boolean;
  settingsOpen: boolean;
  addBlockOpen: boolean;
  shortcutsOpen: boolean;
  leaveConfirmOpen: boolean;
  leaveSaveInProgress: boolean;
  saveAndLeaveFlow: boolean;
  isLeaving: boolean;
  autoSaveEnabled: boolean;
}

interface EditorUIActions {
  setViewport: (v: Viewport) => void;
  setBlockSearch: (v: string) => void;
  setCurrentTemplate: (t: Template) => void;
  setPreviewMode: (v: boolean) => void;
  openLibrary: () => void;
  closeLibrary: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  closePanels: () => void;
  setAddBlockOpen: (v: boolean) => void;
  openShortcuts: () => void;
  closeShortcuts: () => void;
  toggleShortcuts: () => void;
  setLeaveConfirmOpen: (v: boolean) => void;
  setLeaveSaveInProgress: (v: boolean) => void;
  setSaveAndLeaveFlow: (v: boolean) => void;
  setIsLeaving: (v: boolean) => void;
  setAutoSaveEnabled: (v: boolean) => void;
}

const initialState: EditorUIState = {
  viewport: 'desktop',
  blockSearch: '',
  currentTemplate: TEMPLATES[0],
  previewMode: false,
  libraryOpen: false,
  settingsOpen: false,
  addBlockOpen: false,
  shortcutsOpen: false,
  leaveConfirmOpen: false,
  leaveSaveInProgress: false,
  saveAndLeaveFlow: false,
  isLeaving: false,
  autoSaveEnabled: false,
};

export const useEditorUIStore = create<EditorUIState & EditorUIActions>((set) => ({
  ...initialState,
  setViewport: (v) => set({ viewport: v }),
  setBlockSearch: (v) => set({ blockSearch: v }),
  setCurrentTemplate: (t) => set({ currentTemplate: t }),
  setPreviewMode: (v) => set({ previewMode: v }),
  openLibrary: () => set({ libraryOpen: true, settingsOpen: false }),
  closeLibrary: () => set({ libraryOpen: false }),
  openSettings: () => set({ settingsOpen: true, libraryOpen: false }),
  closeSettings: () => set({ settingsOpen: false }),
  closePanels: () => set({ libraryOpen: false, settingsOpen: false }),
  setAddBlockOpen: (v) => set({ addBlockOpen: v }),
  openShortcuts: () => set({ shortcutsOpen: true }),
  closeShortcuts: () => set({ shortcutsOpen: false }),
  toggleShortcuts: () => set((s) => ({ shortcutsOpen: !s.shortcutsOpen })),
  setLeaveConfirmOpen: (v) => set({ leaveConfirmOpen: v }),
  setLeaveSaveInProgress: (v) => set({ leaveSaveInProgress: v }),
  setSaveAndLeaveFlow: (v) => set({ saveAndLeaveFlow: v }),
  setIsLeaving: (v) => set({ isLeaving: v }),
  setAutoSaveEnabled: (v) => set({ autoSaveEnabled: v }),
}));
