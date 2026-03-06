/**
 * Formate un montant avec la devise de la boutique.
 * @param amount - Montant numérique
 * @param currency - Code devise (ex. EUR, USD, XOF). Si vide, seul le montant est affiché.
 */
export function formatMoney(amount: number, currency?: string | null): string {
  const formatted = amount.toLocaleString('fr-FR');
  if (currency?.trim()) {
    return `${formatted} ${currency.trim()}`;
  }
  return formatted;
}
