import {
  IsString,
  IsNumber,
  IsOptional,
  MinLength,
  Min,
  IsArray,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateVariantDto } from './create-variant.dto';

export class UpdateProductDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  compareAtPrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  inventoryQty?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({
    enum: ['DRAFT', 'ACTIVE', 'OUT_OF_STOCK', 'ARCHIVED'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['DRAFT', 'ACTIVE', 'OUT_OF_STOCK', 'ARCHIVED'])
  status?: 'DRAFT' | 'ACTIVE' | 'OUT_OF_STOCK' | 'ARCHIVED';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  categoryId?: string | null;

  @ApiProperty({ example: 'T-shirt', required: false })
  @IsOptional()
  @IsString()
  productType?: string | null;

  @ApiProperty({ type: [CreateVariantDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants?: CreateVariantDto[];

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  metaTitle?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  metaDescription?: string | null;
}
