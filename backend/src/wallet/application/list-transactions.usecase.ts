import { Injectable, Inject } from '@nestjs/common';
import { IWalletRepository } from '../domain/wallet.repository';
import { WalletTransaction } from '../domain/wallet.entity';

@Injectable()
export class ListTransactionsUseCase {
  constructor(
    @Inject('IWalletRepository')
    private walletRepository: IWalletRepository,
  ) {}

  async execute(storeId: string, limit: number = 50): Promise<WalletTransaction[]> {
    const wallet = await this.walletRepository.findByStoreId(storeId);

    if (!wallet) {
      return [];
    }

    return this.walletRepository.findTransactionsByWalletId(wallet.id, limit);
  }
}
