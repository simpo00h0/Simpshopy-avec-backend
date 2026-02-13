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
} from '../domain/exceptions';

@Catch(
  InsufficientBalanceException,
  InvalidAmountException,
  DomainNotFoundException,
)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(
    exception:
      | InsufficientBalanceException
      | InvalidAmountException
      | DomainNotFoundException,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof DomainNotFoundException
        ? HttpStatus.NOT_FOUND
        : HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error:
        status === HttpStatus.NOT_FOUND ? 'Not Found' : 'Bad Request',
    });
  }
}
