import { Injectable, Inject } from '@nestjs/common';
import { ICartRepository } from './domain/cart.repository';

@Injectable()
export class CartService {
  constructor(
    @Inject('ICartRepository')
    private cartRepository: ICartRepository,
  ) {}
}
