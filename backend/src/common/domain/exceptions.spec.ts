import {
  DomainException,
  NotFoundException,
  InsufficientBalanceException,
  InvalidAmountException,
  ConflictException,
} from './exceptions';

describe('Domain Exceptions', () => {
  describe('DomainException', () => {
    it('doit créer une exception avec le message fourni', () => {
      const ex = new DomainException('Erreur métier');
      expect(ex).toBeInstanceOf(Error);
      expect(ex).toBeInstanceOf(DomainException);
      expect(ex.message).toBe('Erreur métier');
      expect(ex.name).toBe('DomainException');
    });
  });

  describe('NotFoundException', () => {
    it('doit hériter de DomainException', () => {
      const ex = new NotFoundException('Ressource introuvable');
      expect(ex).toBeInstanceOf(DomainException);
      expect(ex).toBeInstanceOf(Error);
      expect(ex.message).toBe('Ressource introuvable');
      expect(ex.name).toBe('NotFoundException');
    });
  });

  describe('InsufficientBalanceException', () => {
    it('doit utiliser le message par défaut si non fourni', () => {
      const ex = new InsufficientBalanceException();
      expect(ex.message).toBe('Solde insuffisant');
    });

    it('doit accepter un message personnalisé', () => {
      const ex = new InsufficientBalanceException('Fonds insuffisants');
      expect(ex.message).toBe('Fonds insuffisants');
    });
  });

  describe('InvalidAmountException', () => {
    it('doit utiliser le message par défaut si non fourni', () => {
      const ex = new InvalidAmountException();
      expect(ex.message).toBe('Le montant doit être positif');
    });

    it('doit accepter un message personnalisé', () => {
      const ex = new InvalidAmountException('Montant invalide');
      expect(ex.message).toBe('Montant invalide');
    });
  });

  describe('ConflictException', () => {
    it('doit créer une exception avec le message fourni', () => {
      const ex = new ConflictException('Email déjà utilisé');
      expect(ex).toBeInstanceOf(DomainException);
      expect(ex.message).toBe('Email déjà utilisé');
      expect(ex.name).toBe('ConflictException');
    });
  });
});
