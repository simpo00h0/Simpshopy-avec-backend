import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  IEventRepository,
} from '../domain/event.repository';
import { EventLog, CreateEventInput } from '../domain/event.entity';

@Injectable()
export class EventRepository implements IEventRepository {
  constructor(private prisma: PrismaService) {}

  async create(event: CreateEventInput): Promise<EventLog> {
    const created = await this.prisma.eventLog.create({
      data: {
        actorId: event.actorId,
        actorType: event.actorType,
        storeId: event.storeId,
        type: event.type,
        payload: event.payload,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
        metadata: event.metadata,
      },
    });

    return this.mapToEntity(created);
  }

  async findByStoreId(storeId: string, limit: number): Promise<EventLog[]> {
    const events = await this.prisma.eventLog.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return events.map((e) => this.mapToEntity(e));
  }

  async findByType(type: string, limit: number): Promise<EventLog[]> {
    const events = await this.prisma.eventLog.findMany({
      where: { type: type as any },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return events.map((e) => this.mapToEntity(e));
  }

  async findByActorId(actorId: string, limit: number): Promise<EventLog[]> {
    const events = await this.prisma.eventLog.findMany({
      where: { actorId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return events.map((e) => this.mapToEntity(e));
  }

  private mapToEntity(event: any): EventLog {
    return {
      id: event.id,
      actorId: event.actorId ?? undefined,
      actorType: event.actorType ?? undefined,
      storeId: event.storeId ?? undefined,
      type: event.type,
      payload: event.payload,
      ipAddress: event.ipAddress ?? undefined,
      userAgent: event.userAgent ?? undefined,
      metadata: event.metadata,
      createdAt: event.createdAt,
    };
  }
}
