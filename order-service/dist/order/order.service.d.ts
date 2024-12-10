import { PrismaService } from '../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrderService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getProductsFromProductService(productIds: number[]): Promise<any[]>;
    create(data: CreateOrderDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: number): Promise<any>;
    update(id: number, data: UpdateOrderDto): Promise<any>;
    getAllProducts(): Promise<any>;
    remove(id: number): Promise<any>;
}
