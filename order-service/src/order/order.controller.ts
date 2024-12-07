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
} from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Create a new order
  @Post()
  @ApiCreatedResponse({ description: 'Order successfully created' })
  @ApiBadRequestResponse({
    description: 'Invalid product or insufficient stock',
  })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  // Get all orders
  @Get()
  @ApiOkResponse({ description: 'List of all orders' })
  findAll() {
    return this.orderService.findAll();
  }

  // Get a single order by ID
  @Get(':id')
  @ApiOkResponse({ description: 'Details of the order' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  // Update an order
  @Patch(':id')
  @ApiOkResponse({ description: 'Order successfully updated' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiBadRequestResponse({
    description: 'Invalid update or insufficient stock',
  })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  // Delete an order
  @Delete(':id')
  @ApiOkResponse({ description: 'Order successfully deleted' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  delete(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
