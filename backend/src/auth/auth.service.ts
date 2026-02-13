import { Injectable } from '@nestjs/common';
import { FindOrCreateUserFromSupabaseUseCase } from './application/find-or-create-user-from-supabase.usecase';

export interface SupabaseAuthUser {
  authUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  emailVerified?: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private findOrCreateUserFromSupabaseUseCase: FindOrCreateUserFromSupabaseUseCase,
  ) {}

  async findOrCreateFromSupabase(data: SupabaseAuthUser) {
    return this.findOrCreateUserFromSupabaseUseCase.execute(data);
  }
}
