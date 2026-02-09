import { Injectable, Inject } from '@nestjs/common';
import { IWalletRepository } from '../domain/wallet.repository';

@Injectable()
export class GetWalletBalanceUseCase {
  constructor(
    @Inject('IWalletRepository')
    private walletRepository: IWalletRepository,
  ) {}

  async execute(storeId: string): Promise<number> {
    let wallet = await this.walletRepository.findByStoreId(storeId);

    if (!wallet) {
      wallet = await this.walletRepository.create({
        storeId,
        balance: 0,
        currency: 'XOF',
      });
    }

    return wallet.balance;
  }
}
