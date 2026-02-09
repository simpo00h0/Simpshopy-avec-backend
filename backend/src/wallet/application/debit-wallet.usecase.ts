import { Injectable, Inject } from '@nestjs/common';
import { IWalletRepository } from '../domain/wallet.repository';
import { DebitWalletInput, WalletTransaction } from '../domain/wallet.entity';
import { WalletPolicy } from '../domain/wallet.policy';

@Injectable()
export class DebitWalletUseCase {
  constructor(
    @Inject('IWalletRepository')
    private walletRepository: IWalletRepository,
  ) {}

  async execute(input: DebitWalletInput): Promise<WalletTransaction> {
    WalletPolicy.validatePositiveAmount(input.amount);

    const wallet = await this.walletRepository.findByStoreId(input.storeId);

    if (!wallet) {
      throw new Error('Wallet introuvable');
    }

    WalletPolicy.validateSufficientBalance(wallet.balance, input.amount);

    const newBalance = wallet.balance - input.amount;

    const transaction = await this.walletRepository.createTransaction({
      walletId: wallet.id,
      type: input.type,
      amount: -input.amount,
      balance: newBalance,
      description: input.description,
    });

    await this.walletRepository.updateBalance(wallet.id, newBalance);

    return transaction;
  }
}
