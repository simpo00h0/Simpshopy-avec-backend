type ApiError = { response?: { data?: { message?: string } } };

export function getApiErrorMessage(err: unknown, fallback = 'Erreur'): string {
  return (err as ApiError)?.response?.data?.message ?? fallback;
}
