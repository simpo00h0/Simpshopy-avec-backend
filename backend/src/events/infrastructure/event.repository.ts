import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  IEventRepository,
  ListEventsFilters,
} from '../domain/event.repository';
import { EventLog, CreateEventInput } from '../domain/event.entity';
import { EventType } from '@prisma/client';

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
        payload: event.payload as object,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
        metadata: event.metadata as object,
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
      where: { type: type as EventType },
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

  async findMany(filters: ListEventsFilters): Promise<EventLog[]> {
    const where: Record<string, unknown> = {};
    if (filters.storeId) where.storeId = filters.storeId;
    if (filters.type) where.type = filters.type;

    const events = await this.prisma.eventLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters.limit ?? 50,
    });

    return events.map((e) => this.mapToEntity(e));
  }

  private mapToEntity(event: {
    id: string;
    actorId?: string | null;
    actorType?: string | null;
    storeId?: string | null;
    type: string;
    payload?: unknown;
    ipAddress?: string | null;
    userAgent?: string | null;
    metadata?: unknown;
    createdAt: Date;
  }): EventLog {
    return {
      id: event.id,
      actorId: event.actorId ?? undefined,
      actorType: event.actorType ?? undefined,
      storeId: event.storeId ?? undefined,
      type: event.type as EventLog['type'],
      payload: event.payload,
      ipAddress: event.ipAddress ?? undefined,
      userAgent: event.userAgent ?? undefined,
      metadata: event.metadata,
      createdAt: event.createdAt,
    };
  }
}
