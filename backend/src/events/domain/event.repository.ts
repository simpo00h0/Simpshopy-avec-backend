import { EventLog, CreateEventInput } from './event.entity';

export interface ListEventsFilters {
  storeId?: string;
  type?: string;
  limit?: number;
}

export interface IEventRepository {
  create(event: CreateEventInput): Promise<EventLog>;
  findByStoreId(storeId: string, limit: number): Promise<EventLog[]>;
  findByType(type: string, limit: number): Promise<EventLog[]>;
  findByActorId(actorId: string, limit: number): Promise<EventLog[]>;
  findMany(filters: ListEventsFilters): Promise<EventLog[]>;
}
