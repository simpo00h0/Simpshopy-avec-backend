import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStoreDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  country?: string;
}

export class UpdateStoreSettingsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  enableMobileMoney?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  enableCardPayment?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  enableBankTransfer?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  enableCashOnDelivery?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  enableShipping?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  freeShippingThreshold?: number;

  @ApiProperty({
    required: false,
    description: 'ID du thème (ex: classique, mode, tech)',
  })
  @IsOptional()
  @IsString()
  themeId?: string;

  @ApiProperty({
    required: false,
    description:
      'Personnalisation du thème (couleurs, hero, about, etc.)',
  })
  @IsOptional()
  @IsObject()
  themeCustomization?: Record<string, unknown>;
}
