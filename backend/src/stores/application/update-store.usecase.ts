import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import {
  IStoreRepository,
  UpdateStoreData,
} from '../domain/store.repository';
import { Store } from '../domain/store.entity';

@Injectable()
export class UpdateStoreUseCase {
  constructor(
    @Inject('IStoreRepository')
    private storeRepository: IStoreRepository,
  ) {}

  async execute(
    id: string,
    ownerId: string,
    data: UpdateStoreData,
  ): Promise<Store> {
    const store = await this.storeRepository.findById(id);
    if (!store || store.ownerId !== ownerId) {
      throw new ForbiddenException('Accès non autorisé');
    }
    return this.storeRepository.update(id, data);
  }
}
