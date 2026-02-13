import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ICartRepository } from '../domain/cart.repository';

@Injectable()
export class CartRepository implements ICartRepository {
  constructor(private prisma: PrismaService) {}
}
