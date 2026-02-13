import { Injectable, Inject } from '@nestjs/common';
import { IStoreRepository } from '../domain/store.repository';
import { StorePublic } from '../domain/store.entity';

@Injectable()
export class FindStoreBySlugPublicUseCase {
  constructor(
    @Inject('IStoreRepository')
    private storeRepository: IStoreRepository,
  ) {}

  async execute(slug: string): Promise<StorePublic | null> {
    return this.storeRepository.findBySlugPublic(slug);
  }
}
