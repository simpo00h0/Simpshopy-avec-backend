import { act } from '@testing-library/react';
import { useStoreStore } from './storeStore';

describe('storeStore', () => {
  beforeEach(() => {
    act(() => {
      useStoreStore.getState().setCurrentStore(null);
    });
  });

  it('setCurrentStore met à jour la boutique', () => {
    const store = {
      id: 's1',
      name: 'Ma Boutique',
      subdomain: 'ma-boutique',
      email: 'contact@boutique.com',
      status: 'ACTIVE',
    };

    act(() => {
      useStoreStore.getState().setCurrentStore(store);
    });

    expect(useStoreStore.getState().currentStore).toEqual(store);
  });

  it('setCurrentStore(null) remet à null', () => {
    act(() => {
      useStoreStore.getState().setCurrentStore({
        id: 's1',
        name: 'Test',
        subdomain: 'test',
        email: 'a@b.com',
        status: 'ACTIVE',
      });
    });

    act(() => {
      useStoreStore.getState().setCurrentStore(null);
    });

    expect(useStoreStore.getState().currentStore).toBeNull();
  });
});
