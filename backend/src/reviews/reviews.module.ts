import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './presentation/reviews.controller';
import { ReviewRepository } from './infrastructure/review.repository';
import { IReviewRepository } from './domain/review.repository';

@Module({
  controllers: [ReviewsController],
  providers: [
    ReviewsService,
    ReviewRepository,
    {
      provide: 'IReviewRepository',
      useClass: ReviewRepository,
    },
  ],
  exports: [ReviewsService],
})
export class ReviewsModule {}
