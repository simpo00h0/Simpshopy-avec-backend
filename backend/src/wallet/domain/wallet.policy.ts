export class WalletPolicy {
  static validateSufficientBalance(currentBalance: number, amount: number): void {
    if (currentBalance < amount) {
      throw new Error('Solde insuffisant');
    }
  }

  static calculateNewBalance(currentBalance: number, amount: number): number {
    return currentBalance + amount;
  }

  static validatePositiveAmount(amount: number): void {
    if (amount <= 0) {
      throw new Error('Le montant doit être positif');
    }
  }
}
