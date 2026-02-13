import { Injectable, Inject } from '@nestjs/common';
import { ISubscriptionRepository } from './domain/subscription.repository';

@Injectable()
export class SubscriptionsService {
  constructor(
    @Inject('ISubscriptionRepository')
    private subscriptionRepository: ISubscriptionRepository,
  ) {}
}
