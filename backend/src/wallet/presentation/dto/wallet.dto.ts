import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreditWalletDto {
  @ApiProperty({ example: 50000, description: 'Montant en XOF' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ enum: ['credit', 'fee', 'refund'], example: 'credit' })
  @IsEnum(['credit', 'fee', 'refund'])
  type: 'credit' | 'fee' | 'refund';

  @ApiProperty({ required: false, example: 'order-uuid-123' })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiProperty({ required: false, example: 'Paiement commande #123' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class DebitWalletDto {
  @ApiProperty({ example: 10000, description: 'Montant en XOF' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ enum: ['debit', 'payout'], example: 'payout' })
  @IsEnum(['debit', 'payout'])
  type: 'debit' | 'payout';

  @ApiProperty({ required: false, example: 'Retrait vers compte bancaire' })
  @IsOptional()
  @IsString()
  description?: string;
}
