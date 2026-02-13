import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { CreateOrderUseCase } from './application/create-order.usecase';
import { ConfirmPaymentUseCase } from './application/confirm-payment.usecase';
import { ListOrdersUseCase } from './application/list-orders.usecase';
import { GetOrderUseCase } from './application/get-order.usecase';
import { OrderRepository } from './infrastructure/order.repository';
import { CommissionsModule } from '../commissions/commissions.module';
import { WalletModule } from '../wallet/wallet.module';
import { EventsModule } from '../events/events.module';
import { StoresModule } from '../stores/stores.module';

@Module({
  imports: [
    AuthModule,
    CommissionsModule,
    WalletModule,
    EventsModule,
    StoresModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    CreateOrderUseCase,
    ConfirmPaymentUseCase,
    ListOrdersUseCase,
    GetOrderUseCase,
    OrderRepository,
    {
      provide: 'IOrderRepository',
      useClass: OrderRepository,
    },
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
