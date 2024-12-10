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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const order_service_1 = require("./order.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const update_order_dto_1 = require("./dto/update-order.dto");
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    create(createOrderDto) {
        return this.orderService.create(createOrderDto);
    }
    async getAllProducts() {
        return this.orderService.getAllProducts();
    }
    findAll() {
        return this.orderService.findAll();
    }
    findOne(id) {
        return this.orderService.findOne(+id);
    }
    update(id, updateOrderDto) {
        return this.orderService.update(+id, updateOrderDto);
    }
    delete(id) {
        return this.orderService.remove(+id);
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBody)({
        description: 'Data required to create an order',
        type: create_order_dto_1.CreateOrderDto,
    }),
    (0, swagger_1.ApiCreatedResponse)({
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
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Validation error or insufficient stock',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/all-products'),
    (0, swagger_1.ApiOkResponse)({
        description: 'List of all products',
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Products not found',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getAllProducts", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOkResponse)({
        description: 'List of all orders',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID of the order to retrieve',
        example: 1,
    }),
    (0, swagger_1.ApiOkResponse)({
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
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Order not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID of the order to update',
        example: 1,
    }),
    (0, swagger_1.ApiBody)({
        description: 'Data to update the order',
        type: update_order_dto_1.UpdateOrderDto,
    }),
    (0, swagger_1.ApiOkResponse)({
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
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Validation error or insufficient stock',
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Order not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_dto_1.UpdateOrderDto]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID of the order to delete',
        example: 1,
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Order successfully deleted' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Order not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "delete", null);
exports.OrderController = OrderController = __decorate([
    (0, swagger_1.ApiTags)('orders'),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map