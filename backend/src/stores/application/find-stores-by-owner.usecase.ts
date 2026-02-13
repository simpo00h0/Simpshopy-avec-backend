import { Injectable, Inject } from '@nestjs/common';
import { IStoreRepository } from '../domain/store.repository';
import { Store } from '../domain/store.entity';

@Injectable()
export class FindStoresByOwnerUseCase {
  constructor(
    @Inject('IStoreRepository')
    private storeRepository: IStoreRepository,
  ) {}

  async execute(ownerId: string): Promise<Store[]> {
    return this.storeRepository.findByOwner(ownerId);
  }
}
