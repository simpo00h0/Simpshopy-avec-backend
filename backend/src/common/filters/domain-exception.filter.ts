import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  InsufficientBalanceException,
  InvalidAmountException,
  NotFoundException as DomainNotFoundException,
  ConflictException,
} from '../domain/exceptions';

@Catch(
  InsufficientBalanceException,
  InvalidAmountException,
  DomainNotFoundException,
  ConflictException,
)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(
    exception:
      | InsufficientBalanceException
      | InvalidAmountException
      | DomainNotFoundException
      | ConflictException,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof DomainNotFoundException
        ? HttpStatus.NOT_FOUND
        : exception instanceof ConflictException
          ? HttpStatus.CONFLICT
          : HttpStatus.BAD_REQUEST;

    const errorLabel =
      status === HttpStatus.NOT_FOUND
        ? 'Not Found'
        : status === HttpStatus.CONFLICT
          ? 'Conflict'
          : 'Bad Request';

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: errorLabel,
    });
  }
}
