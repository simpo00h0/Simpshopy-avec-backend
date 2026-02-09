import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmPaymentDto {
  @ApiProperty({ example: 'payment-id-123' })
  @IsString()
  @IsNotEmpty()
  paymentId: string;
}
