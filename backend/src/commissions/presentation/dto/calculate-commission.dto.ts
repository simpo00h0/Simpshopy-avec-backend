import { IsString, IsNumber, IsEnum, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CalculateCommissionDto {
  @ApiProperty({ example: 'store-uuid-123' })
  @IsString()
  @IsNotEmpty()
  storeId: string;

  @ApiProperty({ example: 50000, description: 'Montant en XOF' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ enum: ['order', 'product', 'payment'], example: 'order' })
  @IsEnum(['order', 'product', 'payment'])
  appliesTo: 'order' | 'product' | 'payment';
}
