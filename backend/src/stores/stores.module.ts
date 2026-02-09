import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { StoresPublicController } from './stores-public.controller';

@Module({
  imports: [AuthModule],
  controllers: [StoresController, StoresPublicController],
  providers: [StoresService],
  exports: [StoresService],
})
export class StoresModule {}
