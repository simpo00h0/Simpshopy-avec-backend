import { Injectable } from '@nestjs/common';
import { FindUserUseCase } from './application/find-user.usecase';
import { UpdateUserUseCase } from './application/update-user.usecase';
import { UpdateUserData } from './domain/user.repository';

@Injectable()
export class UsersService {
  constructor(
    private findUserUseCase: FindUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
  ) {}

  async findOne(id: string) {
    return this.findUserUseCase.execute(id);
  }

  async update(id: string, data: UpdateUserData) {
    return this.updateUserUseCase.execute(id, data);
  }
}
