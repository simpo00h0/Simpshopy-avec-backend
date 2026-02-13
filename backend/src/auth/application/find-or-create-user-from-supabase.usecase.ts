import { Injectable, Inject } from '@nestjs/common';
import { IUserAuthRepository, UserAuthResult } from '../domain/user-auth.repository';

export interface SupabaseAuthUser {
  authUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  emailVerified?: boolean;
}

@Injectable()
export class FindOrCreateUserFromSupabaseUseCase {
  constructor(
    @Inject('IUserAuthRepository')
    private userAuthRepository: IUserAuthRepository,
  ) {}

  async execute(data: SupabaseAuthUser): Promise<UserAuthResult> {
    let user = await this.userAuthRepository.findByAuthUserId(data.authUserId);

    if (!user) {
      const existingByEmail = await this.userAuthRepository.findByEmail(
        data.email,
      );
      if (existingByEmail) {
        user = await this.userAuthRepository.updateAuthUser(existingByEmail.id, {
          authUserId: data.authUserId,
          emailVerified: data.emailVerified ?? existingByEmail.emailVerified,
        });
      } else {
        user = await this.userAuthRepository.create({
          authUserId: data.authUserId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          emailVerified: data.emailVerified ?? false,
        });
      }
    } else {
      await this.userAuthRepository.updateLastLogin(user.id);
    }

    return user;
  }
}
