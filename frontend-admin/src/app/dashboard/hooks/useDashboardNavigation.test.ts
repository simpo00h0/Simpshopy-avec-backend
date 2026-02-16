import { renderHook, act } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { useDashboardNavigation } from './useDashboardNavigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('useDashboardNavigation', () => {
  const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

  beforeEach(() => {
    mockUsePathname.mockReturnValue('/dashboard');
  });

  it('retourne navigatingTo null initialement', () => {
    const { result } = renderHook(() => useDashboardNavigation());

    expect(result.current.navigatingTo).toBeNull();
    expect(result.current.showNavLoader).toBe(false);
  });

  it('setNavigatingTo met à jour navigatingTo', () => {
    const { result } = renderHook(() => useDashboardNavigation());

    act(() => {
      result.current.setNavigatingTo('/dashboard/products');
    });

    expect(result.current.navigatingTo).toBe('/dashboard/products');
  });

  it('remet navigatingTo à null quand pathname correspond', () => {
    const { result, rerender } = renderHook(() => useDashboardNavigation());

    act(() => {
      result.current.setNavigatingTo('/dashboard/products');
    });

    mockUsePathname.mockReturnValue('/dashboard/products');
    rerender();

    expect(result.current.navigatingTo).toBeNull();
  });
});
