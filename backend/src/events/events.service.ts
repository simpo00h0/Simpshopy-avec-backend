import { Injectable } from '@nestjs/common';
import { CreateEventUseCase } from './application/create-event.usecase';
import { CreateEventInput, EventLog } from './domain/event.entity';

@Injectable()
export class EventsService {
  constructor(private createEventUseCase: CreateEventUseCase) {}

  async log(input: CreateEventInput): Promise<EventLog> {
    return this.createEventUseCase.execute(input);
  }

  async logOrderCreated(orderId: string, storeId: string, customerId: string) {
    return this.log({
      type: 'ORDER_CREATED',
      storeId,
      actorId: customerId,
      actorType: 'user',
      payload: { orderId },
    });
  }

  async logPaymentCompleted(orderId: string, storeId: string, paymentId: string) {
    return this.log({
      type: 'PAYMENT_COMPLETED',
      storeId,
      actorType: 'system',
      payload: { orderId, paymentId },
    });
  }

  async logPaymentFailed(orderId: string, storeId: string, reason: string) {
    return this.log({
      type: 'PAYMENT_FAILED',
      storeId,
      actorType: 'system',
      payload: { orderId, reason },
    });
  }
}
