import { Injectable, Inject } from '@nestjs/common';
import { IPaymentRepository } from './domain/payment.repository';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject('IPaymentRepository')
    private paymentRepository: IPaymentRepository,
  ) {}
}
