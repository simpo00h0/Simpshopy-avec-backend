import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from './users.service';
import { UsersController } from './presentation/users.controller';
import { FindUserUseCase } from './application/find-user.usecase';
import { UpdateUserUseCase } from './application/update-user.usecase';
import { UserRepository } from './infrastructure/user.repository';
import { IUserRepository } from './domain/user.repository';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    FindUserUseCase,
    UpdateUserUseCase,
    UserRepository,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
