import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { StoresModule } from '../stores/stores.module';
import { ProductsService } from './products.service';
import { ProductsController } from './presentation/products.controller';
import { CreateProductUseCase } from './application/create-product.usecase';
import { FindProductsByStoreUseCase } from './application/find-products-by-store.usecase';
import { FindProductUseCase } from './application/find-product.usecase';
import { UpdateProductUseCase } from './application/update-product.usecase';
import { ProductRepository } from './infrastructure/product.repository';
import { IProductRepository } from './domain/product.repository';

@Module({
  imports: [AuthModule, StoresModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    CreateProductUseCase,
    FindProductsByStoreUseCase,
    FindProductUseCase,
    UpdateProductUseCase,
    ProductRepository,
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
