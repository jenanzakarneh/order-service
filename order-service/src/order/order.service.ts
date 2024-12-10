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

  async getProductsFromProductService(productIds: number[]) {
    const products = await Promise.all(
      productIds.map(async (productId) => {
        try {
          const response = await axios.get(
            `http://localhost:3001/products/${productId}`,
          );
          return response.data;
        } catch (error) {
          throw new NotFoundException(
            `Product with ID ${productId} not found in Product Service`,
          );
        }
      }),
    );
    return products;
  }

  async create(data: CreateOrderDto) {
    const productIds = data.items.map((item) => item.productId);
    const products = await this.getProductsFromProductService(productIds);
    const orderItems = data.items.map((item) => {
      const product = products.find((p) => p.data.id === item.productId);
      if (!product) {
        throw new BadRequestException(
          `Product with ID ${item.productId} not found`,
        );
      }
      if (product.data.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product with ID ${item.productId}. Available stock: ${product.data.stock}`,
        );
      }

      return {
        productId: product.data.id,
        quantity: item.quantity,
        price: product.data.price,
      };
    });

    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const resp = await Promise.all(
      orderItems.map((item) => {
        const product = products.find((p) => p.data.id === item.productId);
        if (!product) return;

        const updatedStock = product.data.stock - item.quantity;
        return axios.patch(
          `http://localhost:3001/products/${item.productId}`,
          { stock: updatedStock },
          { headers: { 'Content-Type': 'application/json' } },
        );
      }),
    );

    const createdOrder = await this.prisma.order.create({
      data: {
        totalPrice,
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: true,
      },
    });

    return {
      ...createdOrder,
      totalPrice,
    };
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        orderItems: true,
      },
    });
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: number, data: UpdateOrderDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { orderItems: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const productIds = data.items.map((item) => item.productId);
    const products = await this.getProductsFromProductService(productIds);

    const orderItems = data.items.map((item) => {
      const product = products.find((p) => p.data.id === item.productId);
      const existingOrderItem = order.orderItems.find(
        (oi) => oi.productId === item.productId,
      );

      const previousQuantity = existingOrderItem?.quantity || 0;
      const newQuantity = item.quantity;

      if (!product || product.stock + previousQuantity < newQuantity) {
        throw new BadRequestException(
          `Insufficient stock for product with ID ${item.productId}`,
        );
      }

      return {
        productId: product.data.id,
        quantity: newQuantity,
        price: product.data.price,
      };
    });

    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    await Promise.all(
      orderItems.map((item) => {
        const product = products.find((p) => p.data.id === item.productId);
        const existingOrderItem = order.orderItems.find(
          (oi) => oi.productId === item.productId,
        );

        const previousQuantity = existingOrderItem?.quantity || 0;
        const updatedStock =
          product.data.stock + previousQuantity - item.quantity;

        return axios.patch(
          `http://localhost:3001/products/${item.productId}`,
          { stock: updatedStock }, // Correctly adjust stock
          { headers: { 'Content-Type': 'application/json' } },
        );
      }),
    );

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        totalPrice,
        orderItems: {
          deleteMany: {}, 
          create: orderItems, 
        },
      },
      include: {
        orderItems: true,
      },
    });

    return {
      ...updatedOrder,
      totalPrice,
    };
  }

  async getAllProducts() {
    try {
      const response = await axios.get('http://localhost:3001/products');
      return response.data;
    } catch (error) {
      throw new NotFoundException('Products not found');
    }
  }
  async remove(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { orderItems: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    await Promise.all(
      order.orderItems.map((item) =>
        axios.patch(
          `http://localhost:3001/products/${item.productId}`,
          { stock: item.quantity },
          { headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    );

    return this.prisma.order.delete({
      where: { id },
    });
  }
}
