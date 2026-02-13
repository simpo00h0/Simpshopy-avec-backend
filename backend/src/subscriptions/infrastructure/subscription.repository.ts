import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ISubscriptionRepository } from '../domain/subscription.repository';

@Injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(private prisma: PrismaService) {}
}
