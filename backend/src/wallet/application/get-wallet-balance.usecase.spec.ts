import { Test, TestingModule } from '@nestjs/testing';
import { GetWalletBalanceUseCase } from './get-wallet-balance.usecase';
import { IWalletRepository } from '../domain/wallet.repository';

describe('GetWalletBalanceUseCase', () => {
  let useCase: GetWalletBalanceUseCase;
  let walletRepository: jest.Mocked<IWalletRepository>;

  beforeEach(async () => {
    walletRepository = {
      findByStoreId: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<IWalletRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetWalletBalanceUseCase,
        { provide: 'IWalletRepository', useValue: walletRepository },
      ],
    }).compile();

    useCase = module.get<GetWalletBalanceUseCase>(GetWalletBalanceUseCase);
  });

  it('doit retourner le solde quand le wallet existe', async () => {
    walletRepository.findByStoreId.mockResolvedValue({
      id: 'w1',
      storeId: 'store-1',
      balance: 50000,
      currency: 'XOF',
      pendingPayout: 0,
    });

    const result = await useCase.execute('store-1');

    expect(result).toBe(50000);
    expect(walletRepository.findByStoreId).toHaveBeenCalledWith('store-1');
    expect(walletRepository.create).not.toHaveBeenCalled();
  });

  it('doit créer un wallet avec solde 0 et le retourner quand il n\'existe pas', async () => {
    walletRepository.findByStoreId.mockResolvedValue(null);
    walletRepository.create.mockResolvedValue({
      id: 'w2',
      storeId: 'store-2',
      balance: 0,
      currency: 'XOF',
      pendingPayout: 0,
    });

    const result = await useCase.execute('store-2');

    expect(result).toBe(0);
    expect(walletRepository.create).toHaveBeenCalledWith({
      storeId: 'store-2',
      balance: 0,
      currency: 'XOF',
    });
  });
});
