import { Injectable } from '@nestjs/common';
import { CreditWalletUseCase } from './application/credit-wallet.usecase';
import { DebitWalletUseCase } from './application/debit-wallet.usecase';
import { GetWalletBalanceUseCase } from './application/get-wallet-balance.usecase';
import { CreditWalletInput, DebitWalletInput } from './domain/wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    private creditWalletUseCase: CreditWalletUseCase,
    private debitWalletUseCase: DebitWalletUseCase,
    private getWalletBalanceUseCase: GetWalletBalanceUseCase,
  ) {}

  async credit(input: CreditWalletInput) {
    return this.creditWalletUseCase.execute(input);
  }

  async debit(input: DebitWalletInput) {
    return this.debitWalletUseCase.execute(input);
  }

  async getBalance(storeId: string): Promise<number> {
    return this.getWalletBalanceUseCase.execute(storeId);
  }
}
