import { EventType } from '@prisma/client';

export interface CreateEventInput {
  actorId?: string;
  actorType?: 'user' | 'system' | 'admin';
  storeId?: string;
  type: EventType;
  payload?: any;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
}

export interface EventLog {
  id: string;
  actorId?: string;
  actorType?: string;
  storeId?: string;
  type: EventType;
  payload?: any;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
  createdAt: Date;
}
