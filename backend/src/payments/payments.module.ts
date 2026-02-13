import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './presentation/payments.controller';
import { PaymentRepository } from './infrastructure/payment.repository';
import { IPaymentRepository } from './domain/payment.repository';

@Module({
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    PaymentRepository,
    {
      provide: 'IPaymentRepository',
      useClass: PaymentRepository,
    },
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
