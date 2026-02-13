import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  IWalletRepository,
} from '../domain/wallet.repository';
import { Wallet, WalletTransaction } from '../domain/wallet.entity';

@Injectable()
export class WalletRepository implements IWalletRepository {
  constructor(private prisma: PrismaService) {}

  async findByStoreId(storeId: string): Promise<Wallet | null> {
    const wallet = await this.prisma.wallet.findUnique({
      where: { storeId },
    });

    if (!wallet) {
      return null;
    }

    return this.mapToEntity(wallet);
  }

  async create(wallet: Partial<Wallet>): Promise<Wallet> {
    const created = await this.prisma.wallet.create({
      data: {
        storeId: wallet.storeId!,
        balance: wallet.balance || 0,
        currency: wallet.currency || 'XOF',
        pendingPayout: wallet.pendingPayout || 0,
      },
    });

    return this.mapToEntity(created);
  }

  async updateBalance(walletId: string, balance: number): Promise<void> {
    await this.prisma.wallet.update({
      where: { id: walletId },
      data: { balance },
    });
  }

  async createTransaction(
    transaction: Partial<WalletTransaction>,
  ): Promise<WalletTransaction> {
    const created = await this.prisma.walletTransaction.create({
      data: {
        walletId: transaction.walletId!,
        type: transaction.type!,
        amount: transaction.amount!,
        balance: transaction.balance!,
        orderId: transaction.orderId,
        description: transaction.description,
        reference: transaction.reference,
      },
    });

    return this.mapTransactionToEntity(created);
  }

  async findTransactionsByWalletId(
    walletId: string,
    limit: number,
  ): Promise<WalletTransaction[]> {
    const transactions = await this.prisma.walletTransaction.findMany({
      where: { walletId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return transactions.map((t) => this.mapTransactionToEntity(t));
  }

  private mapToEntity(wallet: { id: string; storeId: string; balance: number; currency: string; pendingPayout: number }): Wallet {
    return {
      id: wallet.id,
      storeId: wallet.storeId,
      balance: wallet.balance,
      currency: wallet.currency,
      pendingPayout: wallet.pendingPayout,
    };
  }

  private mapTransactionToEntity(transaction: { id: string; walletId: string; type: string; amount: number; balance: number; orderId?: string | null; description?: string | null; reference?: string | null }): WalletTransaction {
    return {
      id: transaction.id,
      walletId: transaction.walletId,
      type: transaction.type as WalletTransaction['type'],
      amount: transaction.amount,
      balance: transaction.balance,
      orderId: transaction.orderId ?? undefined,
      description: transaction.description ?? undefined,
      reference: transaction.reference ?? undefined,
    };
  }
}
