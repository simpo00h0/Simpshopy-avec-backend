import {
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({ example: 'product-uuid-123' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ required: false, example: 'variant-uuid-123' })
  @IsOptional()
  @IsString()
  variantId?: string;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 25000, description: 'Prix unitaire en XOF' })
  @IsNumber()
  @Min(0)
  price: number;
}

export class AddressDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '+221771234567' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: '123 Rue de la République' })
  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @ApiProperty({ required: false, example: 'Appartement 4B' })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty({ example: 'Dakar' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ required: false, example: 'Dakar' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ required: false, example: '12345' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ example: 'SN', default: 'SN' })
  @IsString()
  @IsNotEmpty()
  country: string;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'store-uuid-123' })
  @IsString()
  @IsNotEmpty()
  storeId: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress: AddressDto;

  @ApiProperty({ required: false, type: AddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  billingAddress?: AddressDto;

  @ApiProperty({
    enum: ['MOBILE_MONEY', 'CARD', 'BANK_TRANSFER', 'CASH_ON_DELIVERY'],
    example: 'MOBILE_MONEY',
  })
  @IsEnum(['MOBILE_MONEY', 'CARD', 'BANK_TRANSFER', 'CASH_ON_DELIVERY'])
  paymentMethod: string;

  @ApiProperty({ required: false, example: 'shipping-zone-uuid' })
  @IsOptional()
  @IsString()
  shippingZoneId?: string;

  @ApiProperty({ required: false, example: 'shipping-method-uuid' })
  @IsOptional()
  @IsString()
  shippingMethodId?: string;

  @ApiProperty({ required: false, example: 'Livrer le matin si possible' })
  @IsOptional()
  @IsString()
  customerNote?: string;
}
