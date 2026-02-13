import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePageDto {
  @ApiProperty({ example: 'Ma Page' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'ma-page' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ description: 'Configuration JSON du page builder' })
  content: unknown;
}

export class UpdatePageDto {
  @ApiProperty({ required: false, example: 'Ma Page Modifiée' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false, description: 'Configuration JSON du page builder' })
  @IsOptional()
  content?: unknown;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
