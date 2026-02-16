import { notifications } from '@mantine/notifications';

export interface ReportErrorOptions {
  /** Afficher une notification à l'utilisateur (défaut: true) */
  showNotification?: boolean;
  /** Contexte pour les logs (ex: 'auth.signup') */
  context?: string;
}

function extractMessage(err: unknown): string {
  if (err && typeof err === 'object') {
    const obj = err as Record<string, unknown>;
    if (typeof obj.message === 'string') return obj.message;
    const res = obj.response as Record<string, unknown> | undefined;
    const data = res?.data as Record<string, unknown> | undefined;
    if (data && typeof data.message === 'string') return data.message;
  }
  return 'Une erreur est survenue';
}

/**
 * Couche centralisée de gestion des erreurs.
 * Journalise et affiche les erreurs. Ne propage pas.
 */
export function reportError(err: unknown, options: ReportErrorOptions = {}): void {
  const { showNotification = true, context } = options;
  const message = extractMessage(err);

  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.error(context ? `[${context}]` : '[Error]', err);
  }

  if (showNotification) {
    notifications.show({
      title: 'Erreur',
      message,
      color: 'red',
    });
  }
}
