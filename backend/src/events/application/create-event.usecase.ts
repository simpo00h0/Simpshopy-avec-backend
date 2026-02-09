import { Injectable, Inject } from '@nestjs/common';
import {
  IEventRepository,
} from '../domain/event.repository';
import { CreateEventInput, EventLog } from '../domain/event.entity';

@Injectable()
export class CreateEventUseCase {
  constructor(
    @Inject('IEventRepository')
    private eventRepository: IEventRepository,
  ) {}

  async execute(input: CreateEventInput): Promise<EventLog> {
    return this.eventRepository.create(input);
  }
}
