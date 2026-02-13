import { Injectable, Inject } from '@nestjs/common';
import { IEventRepository, ListEventsFilters } from '../domain/event.repository';
import { EventLog } from '../domain/event.entity';

@Injectable()
export class ListEventsUseCase {
  constructor(
    @Inject('IEventRepository')
    private eventRepository: IEventRepository,
  ) {}

  async execute(filters: ListEventsFilters): Promise<EventLog[]> {
    return this.eventRepository.findMany({
      storeId: filters.storeId,
      type: filters.type,
      limit: filters.limit ?? 50,
    });
  }
}
