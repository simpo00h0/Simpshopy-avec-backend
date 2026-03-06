import { IsString, IsNumber, IsOptional, Min, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVariantDto {
  @ApiProperty({ example: { size: 'M', color: 'Rouge' }, description: 'Attributs de la variante (option name -> value)' })
  @IsObject()
  attributes: Record<string, string>;

  @ApiProperty({ example: 5000, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  inventoryQty?: number;

  @ApiProperty({ example: 'SKU-M-ROUGE', required: false })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ description: 'URL image de la variante (ex. couleur)', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
