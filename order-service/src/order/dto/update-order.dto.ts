import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  ValidateNested,
  IsInt,
  Min,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOrderItemDto {
  @ApiProperty({
    description: 'ID of the product to update in the order',
    example: 1,
  })
  @IsInt()
  @Min(1)
  productId: number;

  @ApiProperty({
    description: 'Updated quantity of the product',
    example: 3,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class UpdateOrderDto {
  @ApiProperty({
    description: 'List of updated products and their quantities for the order',
    type: [UpdateOrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  @IsOptional()
  items?: UpdateOrderItemDto[];
}
