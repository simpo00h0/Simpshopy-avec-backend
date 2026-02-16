import { reportError } from './error-handler';

jest.mock('@mantine/notifications', () => ({
  notifications: {
    show: jest.fn(),
  },
}));

describe('reportError', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'test';
  });

  afterAll(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('extrait le message depuis err.message', () => {
    const { notifications } = require('@mantine/notifications');
    reportError(new Error('Erreur réseau'));

    expect(notifications.show).toHaveBeenCalledWith({
      title: 'Erreur',
      message: 'Erreur réseau',
      color: 'red',
    });
  });

  it('extrait le message depuis response.data.message', () => {
    const { notifications } = require('@mantine/notifications');
    reportError({
      response: { data: { message: 'Validation échouée' } },
    });

    expect(notifications.show).toHaveBeenCalledWith({
      title: 'Erreur',
      message: 'Validation échouée',
      color: 'red',
    });
  });

  it('utilise le message par défaut si non trouvé', () => {
    const { notifications } = require('@mantine/notifications');
    reportError({});

    expect(notifications.show).toHaveBeenCalledWith({
      title: 'Erreur',
      message: 'Une erreur est survenue',
      color: 'red',
    });
  });

  it('n\'affiche pas de notification si showNotification: false', () => {
    const { notifications } = require('@mantine/notifications');
    reportError(new Error('Test'), { showNotification: false });

    expect(notifications.show).not.toHaveBeenCalled();
  });
});
