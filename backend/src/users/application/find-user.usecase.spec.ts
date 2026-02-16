import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FindUserUseCase } from './find-user.usecase';
import { IUserRepository } from '../domain/user.repository';
import { User } from '../domain/user.entity';

describe('FindUserUseCase', () => {
  let useCase: FindUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  const mockUser: User = {
    id: 'user-1',
    email: 'test@example.com',
    firstName: 'Jean',
    lastName: 'Dupont',
    role: 'SELLER',
    status: 'ACTIVE',
    emailVerified: true,
    phoneVerified: false,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    userRepository = {
      findById: jest.fn(),
      findByAuthUserId: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      updateAuthUser: jest.fn(),
      updateLastLogin: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserUseCase,
        { provide: 'IUserRepository', useValue: userRepository },
      ],
    }).compile();

    useCase = module.get<FindUserUseCase>(FindUserUseCase);
  });

  it('doit retourner l\'utilisateur quand il existe', async () => {
    userRepository.findById.mockResolvedValue(mockUser);

    const result = await useCase.execute('user-1');

    expect(result).toEqual(mockUser);
    expect(userRepository.findById).toHaveBeenCalledWith('user-1');
  });

  it('doit lever NotFoundException quand l\'utilisateur n\'existe pas', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('inexistant')).rejects.toThrow(NotFoundException);
    await expect(useCase.execute('inexistant')).rejects.toThrow('Utilisateur non trouvé');
  });
});
