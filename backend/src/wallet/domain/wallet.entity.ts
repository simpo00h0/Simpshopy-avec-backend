export interface Wallet {
  id: string;
  storeId: string;
  balance: number;
  currency: string;
  pendingPayout: number;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: 'credit' | 'debit' | 'fee' | 'payout' | 'refund';
  amount: number;
  balance: number;
  orderId?: string;
  description?: string;
  reference?: string;
}

export interface CreditWalletInput {
  storeId: string;
  amount: number;
  type: 'credit' | 'fee' | 'refund';
  orderId?: string;
  description?: string;
}

export interface DebitWalletInput {
  storeId: string;
  amount: number;
  type: 'debit' | 'payout';
  description?: string;
}
