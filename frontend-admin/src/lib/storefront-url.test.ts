import { getStoreUrl } from './storefront-url';

describe('getStoreUrl', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('retourne http pour localhost', () => {
    process.env.NEXT_PUBLIC_STOREFRONT_DOMAIN = 'localhost:3002';
    expect(getStoreUrl('mastore')).toBe('http://mastore.localhost:3002');
  });

  it('utilise le domaine par défaut si non défini', () => {
    delete process.env.NEXT_PUBLIC_STOREFRONT_DOMAIN;
    expect(getStoreUrl('boutique')).toBe('http://boutique.localhost:3002');
  });

  it('retourne https pour un domaine de production', () => {
    process.env.NEXT_PUBLIC_STOREFRONT_DOMAIN = 'simpshopy.com';
    expect(getStoreUrl('mastore')).toBe('https://mastore.simpshopy.com');
  });
});
