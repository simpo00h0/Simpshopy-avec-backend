import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EventType } from '@prisma/client';

export class CreateEventDto {
  @ApiProperty({ required: false, example: 'user-uuid-123' })
  @IsOptional()
  @IsString()
  actorId?: string;

  @ApiProperty({ enum: ['user', 'system', 'admin'], required: false })
  @IsOptional()
  @IsEnum(['user', 'system', 'admin'])
  actorType?: 'user' | 'system' | 'admin';

  @ApiProperty({ required: false, example: 'store-uuid-123' })
  @IsOptional()
  @IsString()
  storeId?: string;

  @ApiProperty({ enum: EventType, example: 'ORDER_CREATED' })
  @IsEnum(EventType)
  type: EventType;

  @ApiProperty({ required: false, description: 'Payload JSON' })
  @IsOptional()
  payload?: unknown;
}
