import { Commission } from './commission.entity';

export interface ICommissionRepository {
  findByStoreAndType(
    storeId: string,
    appliesTo: 'order' | 'product' | 'payment',
  ): Promise<Commission | null>;
}
