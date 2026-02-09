import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { CreateOrderUseCase } from './application/create-order.usecase';
import { ConfirmPaymentUseCase } from './application/confirm-payment.usecase';
import { CommissionsModule } from '../commissions/commissions.module';
import { WalletModule } from '../wallet/wallet.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [AuthModule, CommissionsModule, WalletModule, EventsModule],
  controllers: [OrdersController],
  providers: [OrdersService, CreateOrderUseCase, ConfirmPaymentUseCase],
  exports: [OrdersService],
})
export class OrdersModule {}
