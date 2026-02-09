import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { CreditWalletUseCase } from './application/credit-wallet.usecase';
import { DebitWalletUseCase } from './application/debit-wallet.usecase';
import { GetWalletBalanceUseCase } from './application/get-wallet-balance.usecase';
import { WalletRepository } from './infrastructure/wallet.repository';
import { IWalletRepository } from './domain/wallet.repository';

@Module({
  imports: [AuthModule],
  controllers: [WalletController],
  providers: [
    WalletService,
    CreditWalletUseCase,
    DebitWalletUseCase,
    GetWalletBalanceUseCase,
    {
      provide: 'IWalletRepository',
      useClass: WalletRepository,
    },
  ],
  exports: [WalletService],
})
export class WalletModule {}
