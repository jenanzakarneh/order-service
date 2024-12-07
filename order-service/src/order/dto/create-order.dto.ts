import { IsInt, IsPositive, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ description: 'ID of the product to order' })
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiProperty({ description: 'Quantity of the product to order' })
  @IsInt()
  @IsPositive()
  quantity: number;
}
