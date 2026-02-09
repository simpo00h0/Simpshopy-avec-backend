import { IsString, IsEmail, IsOptional, MinLength, Matches, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
  @ApiProperty({ example: 'Ma Boutique Africaine' })
  @IsString()
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  name: string;

  @ApiProperty({ example: 'ma-boutique-africaine', required: false })
  @IsOptional()
  @ValidateIf((o) => o.slug != null && o.slug !== '')
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Le slug doit être en minuscules, tirets uniquement (ex: ma-boutique)',
  })
  slug?: string;

  @ApiProperty({ example: 'contact@maboutique.sn' })
  @IsEmail({}, { message: 'Email de contact invalide' })
  email: string;

  @ApiProperty({ example: '+221771234567' })
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Format de téléphone invalide' })
  phone: string;

  @ApiProperty({ example: 'Dakar', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'SN', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: 'Rue 10, Plateau', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Vendez vos produits en ligne', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
