import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import axios from 'axios';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async getProduct(productId: number) {
    try {
      const response = await axios.get(
        `http://localhost:3001/products/${productId}`,
      );
      return response.data;
    } catch (error) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
  }

  async create(data: CreateOrderDto) {
    const product = await this.getProduct(data.productId);
    if (!product) {
      throw new NotFoundException(
        `Product with ID ${data.productId} not found`,
      );
    }

    if (data.quantity > product.data.stock) {
      throw new BadRequestException(
        `Insufficient stock for product with ID ${data.productId}. Available stock: ${product.data.stock}`,
      );
    }

    const totalPrice = data.quantity * product.data.price;

    await axios.patch(
      `http://localhost:3001/products/${product.data.id}`,
      {
        stock: Number(product.data.stock) - Number(data.quantity),
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return this.prisma.order.create({
      data: {
        productId: data.productId,
        quantity: data.quantity,
        totalPrice,
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany();
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: number, data: UpdateOrderDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    if (data.productId || data.quantity) {
      const product = await this.getProduct(data.productId || order.productId);
      if (product.data == null)
        throw new NotFoundException(
          `Product with ID ${data.productId} not found`,
        );
      const newQuantity = data.quantity || order.quantity;
      if (newQuantity > product.data.stock) {
        throw new BadRequestException(
          `Insufficient stock for product with ID ${product.data.id}. Available stock: ${product.data.stock}`,
        );
      }

      await axios.patch(
        `http://localhost:3001/products/${product.data.id}`,
        {
          stock:
            Number(product.data.stock) - Number(newQuantity) + order.quantity, 
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    return this.prisma.order.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const product = await this.getProduct(order.productId);
    await axios.patch(
      `http://localhost:3001/products/${product.data.id}`,
      {
        stock: Number(product.data.stock) + Number(order.quantity),
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return this.prisma.order.delete({ where: { id } });
  }
}
