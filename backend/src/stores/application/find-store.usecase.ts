import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { IStoreRepository } from '../domain/store.repository';
import { Store } from '../domain/store.entity';

@Injectable()
export class FindStoreUseCase {
  constructor(
    @Inject('IStoreRepository')
    private storeRepository: IStoreRepository,
  ) {}

  async execute(id: string, ownerId: string): Promise<Store> {
    const store = await this.storeRepository.findById(id);
    if (!store) {
      throw new ForbiddenException('Boutique non trouvée');
    }
    if (store.ownerId !== ownerId) {
      throw new ForbiddenException(
        'Vous ne pouvez pas accéder à cette boutique',
      );
    }
    return store;
  }
}
