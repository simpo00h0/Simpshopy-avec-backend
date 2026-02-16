import { getApiErrorMessage } from './api-utils';

describe('getApiErrorMessage', () => {
  it('retourne le message de response.data.message', () => {
    const err = {
      response: { data: { message: 'Email déjà utilisé' } },
    };
    expect(getApiErrorMessage(err)).toBe('Email déjà utilisé');
  });

  it('retourne le fallback si pas de message', () => {
    expect(getApiErrorMessage({})).toBe('Erreur');
    expect(getApiErrorMessage(null)).toBe('Erreur');
    expect(getApiErrorMessage(undefined)).toBe('Erreur');
  });

  it('retourne le fallback personnalisé', () => {
    expect(getApiErrorMessage({}, 'Échec')).toBe('Échec');
  });

  it('retourne le fallback si response.data.message est vide', () => {
    const err = { response: { data: {} } };
    expect(getApiErrorMessage(err, 'Custom')).toBe('Custom');
  });
});
