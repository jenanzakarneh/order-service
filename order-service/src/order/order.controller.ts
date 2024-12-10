import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Create an order
  @Post()
  @ApiBody({
    description: 'Data required to create an order',
    type: CreateOrderDto,
  })
  @ApiCreatedResponse({
    description: 'Order created successfully',
    schema: {
      example: {
        id: 1,
        totalPrice: 400, 
        orderItems: [
          {
            id: 1,
            productId: 1,
            quantity: 2,
            price: 150, 
          },
          {
            id: 2,
            productId: 2,
            quantity: 1,
            price: 100, 
          },
        ],
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation error or insufficient stock',
  })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }
  @Get('/all-products')
  @ApiOkResponse({
    description: 'List of all products',
  })
  @ApiNotFoundResponse({
    description: 'Products not found',
  })
  async getAllProducts() {
    return this.orderService.getAllProducts();
  }

  // Get all orders
  @Get()
  @ApiOkResponse({
    description: 'List of all orders',
  })
  findAll() {
    return this.orderService.findAll();
  }

  // Get a single order by ID
  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'ID of the order to retrieve',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Details of the order',
    schema: {
      example: {
        id: 1,
        totalPrice: 400,
        orderItems: [
          {
            id: 1,
            productId: 1,
            quantity: 2,
            price: 150,
          },
          {
            id: 2,
            productId: 2,
            quantity: 1,
            price: 100,
          },
        ],
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Order not found' })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  // Update an order
  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: 'ID of the order to update',
    example: 1,
  })
  @ApiBody({
    description: 'Data to update the order',
    type: UpdateOrderDto,
  })
  @ApiOkResponse({
    description: 'Order successfully updated',
    schema: {
      example: {
        id: 1,
        totalPrice: 300, 
        orderItems: [
          {
            id: 1,
            productId: 1,
            quantity: 1,
            price: 150,
          },
          {
            id: 2,
            productId: 2,
            quantity: 1,
            price: 100,
          },
        ],
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation error or insufficient stock',
  })
  @ApiNotFoundResponse({ description: 'Order not found' })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  // Delete an order
  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'ID of the order to delete',
    example: 1,
  })
  @ApiOkResponse({ description: 'Order successfully deleted' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  delete(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
