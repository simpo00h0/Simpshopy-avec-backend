import { Injectable, Inject } from '@nestjs/common';
import {
  IUserRepository,
  UpdateUserData,
} from '../domain/user.repository';
import { User } from '../domain/user.entity';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private userRepository: IUserRepository,
  ) {}

  async execute(id: string, data: UpdateUserData): Promise<User> {
    return this.userRepository.update(id, data);
  }
}
