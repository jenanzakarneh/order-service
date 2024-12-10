"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const axios_1 = require("axios");
let OrderService = class OrderService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProductsFromProductService(productIds) {
        const products = await Promise.all(productIds.map(async (productId) => {
            try {
                const response = await axios_1.default.get(`http://localhost:3001/products/${productId}`);
                return response.data;
            }
            catch (error) {
                throw new common_1.NotFoundException(`Product with ID ${productId} not found in Product Service`);
            }
        }));
        return products;
    }
    async create(data) {
        const productIds = data.items.map((item) => item.productId);
        const products = await this.getProductsFromProductService(productIds);
        const orderItems = data.items.map((item) => {
            const product = products.find((p) => p.data.id === item.productId);
            if (!product) {
                throw new common_1.BadRequestException(`Product with ID ${item.productId} not found`);
            }
            if (product.data.stock < item.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for product with ID ${item.productId}. Available stock: ${product.data.stock}`);
            }
            return {
                productId: product.data.id,
                quantity: item.quantity,
                price: product.data.price,
            };
        });
        const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const resp = await Promise.all(orderItems.map((item) => {
            const product = products.find((p) => p.data.id === item.productId);
            if (!product)
                return;
            const updatedStock = product.data.stock - item.quantity;
            return axios_1.default.patch(`http://localhost:3001/products/${item.productId}`, { stock: updatedStock }, { headers: { 'Content-Type': 'application/json' } });
        }));
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
    async findOne(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                orderItems: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }
    async update(id, data) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { orderItems: true },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        const productIds = data.items.map((item) => item.productId);
        const products = await this.getProductsFromProductService(productIds);
        const orderItems = data.items.map((item) => {
            const product = products.find((p) => p.data.id === item.productId);
            const existingOrderItem = order.orderItems.find((oi) => oi.productId === item.productId);
            const previousQuantity = existingOrderItem?.quantity || 0;
            const newQuantity = item.quantity;
            if (!product || product.stock + previousQuantity < newQuantity) {
                throw new common_1.BadRequestException(`Insufficient stock for product with ID ${item.productId}`);
            }
            return {
                productId: product.data.id,
                quantity: newQuantity,
                price: product.data.price,
            };
        });
        const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        await Promise.all(orderItems.map((item) => {
            const product = products.find((p) => p.data.id === item.productId);
            const existingOrderItem = order.orderItems.find((oi) => oi.productId === item.productId);
            const previousQuantity = existingOrderItem?.quantity || 0;
            const updatedStock = product.data.stock + previousQuantity - item.quantity;
            return axios_1.default.patch(`http://localhost:3001/products/${item.productId}`, { stock: updatedStock }, { headers: { 'Content-Type': 'application/json' } });
        }));
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
            const response = await axios_1.default.get('http://localhost:3001/products');
            return response.data;
        }
        catch (error) {
            throw new common_1.NotFoundException('Products not found');
        }
    }
    async remove(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { orderItems: true },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        await Promise.all(order.orderItems.map((item) => axios_1.default.patch(`http://localhost:3001/products/${item.productId}`, { stock: item.quantity }, { headers: { 'Content-Type': 'application/json' } })));
        return this.prisma.order.delete({
            where: { id },
        });
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrderService);
//# sourceMappingURL=order.service.js.map