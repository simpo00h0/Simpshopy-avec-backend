import { Injectable, Inject } from '@nestjs/common';
import { IReviewRepository } from './domain/review.repository';

@Injectable()
export class ReviewsService {
  constructor(
    @Inject('IReviewRepository')
    private reviewRepository: IReviewRepository,
  ) {}
}
