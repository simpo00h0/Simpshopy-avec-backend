import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { EventsService } from './events.service';
import { EventsController } from './presentation/events.controller';
import { CreateEventUseCase } from './application/create-event.usecase';
import { EventRepository } from './infrastructure/event.repository';
import { IEventRepository } from './domain/event.repository';

@Module({
  imports: [AuthModule],
  controllers: [EventsController],
  providers: [
    EventsService,
    CreateEventUseCase,
    {
      provide: 'IEventRepository',
      useClass: EventRepository,
    },
  ],
  exports: [EventsService],
})
export class EventsModule {}
