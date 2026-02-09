import { Injectable, Inject } from '@nestjs/common';
import { IWalletRepository } from '../domain/wallet.repository';
import { CreditWalletInput, WalletTransaction } from '../domain/wallet.entity';
import { WalletPolicy } from '../domain/wallet.policy';

@Injectable()
export class CreditWalletUseCase {
  constructor(
    @Inject('IWalletRepository')
    private walletRepository: IWalletRepository,
  ) {}

  async execute(input: CreditWalletInput): Promise<WalletTransaction> {
    WalletPolicy.validatePositiveAmount(input.amount);

    let wallet = await this.walletRepository.findByStoreId(input.storeId);

    if (!wallet) {
      wallet = await this.walletRepository.create({
        storeId: input.storeId,
        balance: 0,
        currency: 'XOF',
      });
    }

    const newBalance = WalletPolicy.calculateNewBalance(
      wallet.balance,
      input.amount,
    );

    const transaction = await this.walletRepository.createTransaction({
      walletId: wallet.id,
      type: input.type,
      amount: input.amount,
      balance: newBalance,
      orderId: input.orderId,
      description: input.description,
    });

    await this.walletRepository.updateBalance(wallet.id, newBalance);

    return transaction;
  }
}
