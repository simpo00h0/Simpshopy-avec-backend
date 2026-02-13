import { Injectable } from '@nestjs/common';
import { CreateEventUseCase } from './application/create-event.usecase';
import { ListEventsUseCase } from './application/list-events.usecase';
import { CreateEventInput, EventLog } from './domain/event.entity';
import { ListEventsFilters } from './domain/event.repository';

@Injectable()
export class EventsService {
  constructor(
    private createEventUseCase: CreateEventUseCase,
    private listEventsUseCase: ListEventsUseCase,
  ) {}

  async list(filters: ListEventsFilters): Promise<EventLog[]> {
    return this.listEventsUseCase.execute(filters);
  }

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
