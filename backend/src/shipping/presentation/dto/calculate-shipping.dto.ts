import { IsString, IsNumber, IsOptional, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CalculateShippingDto {
  @ApiProperty({ example: 'store-uuid-123' })
  @IsString()
  @IsNotEmpty()
  storeId: string;

  @ApiProperty({ example: 'SN', description: 'Code pays ISO' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ required: false, example: 'Dakar' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false, example: 2.5, description: 'Poids en kg' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;
}
