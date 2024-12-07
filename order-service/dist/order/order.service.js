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
    async getProduct(productId) {
        try {
            const response = await axios_1.default.get(`http://localhost:3001/products/${productId}`);
            return response.data;
        }
        catch (error) {
            throw new common_1.NotFoundException(`Product with ID ${productId} not found`);
        }
    }
    async create(data) {
        const product = await this.getProduct(data.productId);
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${data.productId} not found`);
        }
        if (data.quantity > product.data.stock) {
            throw new common_1.BadRequestException(`Insufficient stock for product with ID ${data.productId}. Available stock: ${product.data.stock}`);
        }
        const totalPrice = data.quantity * product.data.price;
        await axios_1.default.patch(`http://localhost:3001/products/${product.data.id}`, {
            stock: Number(product.data.stock) - Number(data.quantity),
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
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
    async findOne(id) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }
    async update(id, data) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        if (data.productId || data.quantity) {
            const product = await this.getProduct(data.productId || order.productId);
            if (product.data == null)
                throw new common_1.NotFoundException(`Product with ID ${data.productId} not found`);
            const newQuantity = data.quantity || order.quantity;
            if (newQuantity > product.data.stock) {
                throw new common_1.BadRequestException(`Insufficient stock for product with ID ${product.data.id}. Available stock: ${product.data.stock}`);
            }
            await axios_1.default.patch(`http://localhost:3001/products/${product.data.id}`, {
                stock: Number(product.data.stock) - Number(newQuantity) + order.quantity,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        return this.prisma.order.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        const product = await this.getProduct(order.productId);
        await axios_1.default.patch(`http://localhost:3001/products/${product.data.id}`, {
            stock: Number(product.data.stock) + Number(order.quantity),
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return this.prisma.order.delete({ where: { id } });
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrderService);
//# sourceMappingURL=order.service.js.map