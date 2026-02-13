import {
  InsufficientBalanceException,
  InvalidAmountException,
} from '../../common/domain/exceptions';

export class WalletPolicy {
  static validateSufficientBalance(currentBalance: number, amount: number): void {
    if (currentBalance < amount) {
      throw new InsufficientBalanceException();
    }
  }

  static calculateNewBalance(currentBalance: number, amount: number): number {
    return currentBalance + amount;
  }

  static validatePositiveAmount(amount: number): void {
    if (amount <= 0) {
      throw new InvalidAmountException();
    }
  }
}
