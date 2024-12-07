import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(createOrderDto: CreateOrderDto): Promise<{
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
    findOne(id: string): Promise<{
        productId: number;
        quantity: number;
        totalPrice: number;
        createdAt: Date;
        id: number;
    }>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<{
        productId: number;
        quantity: number;
        totalPrice: number;
        createdAt: Date;
        id: number;
    }>;
    delete(id: string): Promise<{
        productId: number;
        quantity: number;
        totalPrice: number;
        createdAt: Date;
        id: number;
    }>;
}
