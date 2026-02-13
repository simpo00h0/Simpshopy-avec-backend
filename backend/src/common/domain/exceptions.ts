export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
    Object.setPrototypeOf(this, DomainException.prototype);
  }
}

export class NotFoundException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundException';
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}

export class InsufficientBalanceException extends DomainException {
  constructor(message = 'Solde insuffisant') {
    super(message);
    this.name = 'InsufficientBalanceException';
    Object.setPrototypeOf(this, InsufficientBalanceException.prototype);
  }
}

export class InvalidAmountException extends DomainException {
  constructor(message = 'Le montant doit être positif') {
    super(message);
    this.name = 'InvalidAmountException';
    Object.setPrototypeOf(this, InvalidAmountException.prototype);
  }
}

export class ConflictException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictException';
    Object.setPrototypeOf(this, ConflictException.prototype);
  }
}
