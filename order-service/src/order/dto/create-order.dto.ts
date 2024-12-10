import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'ID of the product to include in the order',
    example: 1,
  })
  @IsInt()
  @Min(1)
  productId: number;

  @ApiProperty({
    description: 'Quantity of the product to order',
    example: 2,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'List of products and their quantities for the order',
    type: [CreateOrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
