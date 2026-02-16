import { act } from '@testing-library/react';
import { useAuthStore } from './authStore';

describe('authStore', () => {
  beforeEach(() => {
    act(() => {
      useAuthStore.getState().setUser(null);
    });
  });

  it('setUser met à jour l\'utilisateur', () => {
    const user = {
      id: 'u1',
      email: 'test@example.com',
      firstName: 'Jean',
      lastName: 'Dupont',
      role: 'SELLER',
    };

    act(() => {
      useAuthStore.getState().setUser(user);
    });

    expect(useAuthStore.getState().user).toEqual(user);
  });

  it('logout remet user à null', () => {
    act(() => {
      useAuthStore.getState().setUser({
        id: 'u1',
        email: 'a@b.com',
        firstName: 'A',
        lastName: 'B',
        role: 'SELLER',
      });
    });

    act(() => {
      useAuthStore.getState().logout();
    });

    expect(useAuthStore.getState().user).toBeNull();
  });
});
