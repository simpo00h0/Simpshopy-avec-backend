import { Wallet, WalletTransaction } from './wallet.entity';

export interface IWalletRepository {
  findByStoreId(storeId: string): Promise<Wallet | null>;
  create(wallet: Partial<Wallet>): Promise<Wallet>;
  updateBalance(walletId: string, balance: number): Promise<void>;
  createTransaction(transaction: Partial<WalletTransaction>): Promise<WalletTransaction>;
  findTransactionsByWalletId(walletId: string, limit: number): Promise<WalletTransaction[]>;
}
