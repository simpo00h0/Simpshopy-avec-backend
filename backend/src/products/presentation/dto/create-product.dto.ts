import {
  IsString,
  IsNumber,
  IsOptional,
  MinLength,
  Min,
  IsArray,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'T-shirt imprimé' })
  @IsString()
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  name: string;

  @ApiProperty({ example: 't-shirt-imprime', required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ example: 'Description du produit', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(0, { message: 'Le prix doit être positif' })
  price: number;

  @ApiProperty({ example: 7000, required: false })
  @IsOptional()
  @IsNumber()
  compareAtPrice?: number;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  inventoryQty?: number;

  @ApiProperty({ example: 'SKU-001', required: false })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiProperty({
    enum: ['DRAFT', 'ACTIVE', 'OUT_OF_STOCK', 'ARCHIVED'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['DRAFT', 'ACTIVE', 'OUT_OF_STOCK', 'ARCHIVED'])
  status?: 'DRAFT' | 'ACTIVE' | 'OUT_OF_STOCK' | 'ARCHIVED';
}
