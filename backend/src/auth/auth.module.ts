import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './presentation/auth.controller';
import { SupabaseJwtGuard } from './guards/supabase-jwt.guard';
import { FindOrCreateUserFromSupabaseUseCase } from './application/find-or-create-user-from-supabase.usecase';
import { UserAuthRepository } from './infrastructure/user-auth.repository';
import { IUserAuthRepository } from './domain/user-auth.repository';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    SupabaseJwtGuard,
    FindOrCreateUserFromSupabaseUseCase,
    UserAuthRepository,
    {
      provide: 'IUserAuthRepository',
      useClass: UserAuthRepository,
    },
  ],
  exports: [AuthService, SupabaseJwtGuard],
})
export class AuthModule {}
