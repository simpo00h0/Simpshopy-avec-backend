import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IReviewRepository } from '../domain/review.repository';

@Injectable()
export class ReviewRepository implements IReviewRepository {
  constructor(private prisma: PrismaService) {}
}
