import { PrismaService } from '../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrderService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getProduct(productId: number): Promise<any>;
    create(data: CreateOrderDto): Promise<{
        productId: number;
        quantity: number;
        totalPrice: number;
        createdAt: Date;
        id: number;
    }>;
    findAll(): Promise<{
        productId: number;
        quantity: number;
        totalPrice: number;
        createdAt: Date;
        id: number;
    }[]>;
    findOne(id: number): Promise<{
        productId: number;
        quantity: number;
        totalPrice: number;
        createdAt: Date;
        id: number;
    }>;
    update(id: number, data: UpdateOrderDto): Promise<{
        productId: number;
        quantity: number;
        totalPrice: number;
        createdAt: Date;
        id: number;
    }>;
    remove(id: number): Promise<{
        productId: number;
        quantity: number;
        totalPrice: number;
        createdAt: Date;
        id: number;
    }>;
}
