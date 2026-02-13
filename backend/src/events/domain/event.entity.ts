import { EventType } from '@prisma/client';

export interface CreateEventInput {
  actorId?: string;
  actorType?: 'user' | 'system' | 'admin';
  storeId?: string;
  type: EventType;
  payload?: unknown;
  ipAddress?: string;
  userAgent?: string;
  metadata?: unknown;
}

export interface EventLog {
  id: string;
  actorId?: string;
  actorType?: string;
  storeId?: string;
  type: EventType;
  payload?: unknown;
  ipAddress?: string;
  userAgent?: string;
  metadata?: unknown;
  createdAt: Date;
}
