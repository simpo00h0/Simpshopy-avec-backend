import { renderHook, act } from '@testing-library/react';
import { useEditorState } from './useEditorState';

describe('useEditorState', () => {
  it('setSelectedBlock met à jour le bloc sélectionné', () => {
    const { result } = renderHook(() => useEditorState());

    act(() => {
      result.current.setSelectedBlock('hero');
    });

    expect(result.current.selectedBlock).toBe('hero');
  });

  it('update modifie la customization', () => {
    const { result } = renderHook(() => useEditorState());

    act(() => {
      result.current.update('sectionOrder', ['hero', 'promoBanner']);
    });

    expect(result.current.customization.sectionOrder).toEqual(['hero', 'promoBanner']);
  });

  it('updateNested met à jour une propriété imbriquée', async () => {
    const { result } = renderHook(() => useEditorState());

    await act(async () => {
      result.current.updateNested('hero', 'title', 'Mon titre');
    });

    expect(result.current.customization.hero).toEqual({ title: 'Mon titre' });
  });
});
