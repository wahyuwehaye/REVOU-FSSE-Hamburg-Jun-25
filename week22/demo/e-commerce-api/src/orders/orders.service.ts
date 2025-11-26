import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private productsService: ProductsService,
  ) {}

  async create(userId: number, createOrderDto: CreateOrderDto): Promise<Order> {
    // Calculate totals
    let subtotal = 0;
    const orderItems: Partial<OrderItem>[] = [];

    // Validate products and calculate totals
    for (const item of createOrderDto.items) {
      const product = await this.productsService.findOne(item.productId);

      // Check stock
      if (!await this.productsService.checkStock(product.id, item.quantity)) {
        throw new BadRequestException(`Insufficient stock for ${product.name}`);
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product,
        quantity: item.quantity,
        price: product.price,
        productName: product.name,
      });
    }

    const tax = subtotal * 0.1; // 10% tax
    const shippingCost = 10; // Flat shipping
    const total = subtotal + tax + shippingCost;

    // Create order
    const order = this.ordersRepository.create({
      user: { id: userId },
      subtotal,
      tax,
      shippingCost,
      total,
      shippingAddress: createOrderDto.shippingAddress,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.ordersRepository.save(order);

    // Create order items
    for (const item of orderItems) {
      const orderItem = this.orderItemsRepository.create({
        ...item,
        order: savedOrder,
      });
      await this.orderItemsRepository.save(orderItem);

      // Reduce stock
      await this.productsService.reduceStock(item.product.id, item.quantity);
    }

    return await this.findOne(savedOrder.id);
  }

  async findAll(userId?: number): Promise<Order[]> {
    const where = userId ? { user: { id: userId } } : {};
    
    return await this.ordersRepository.find({
      where,
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'user'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async updateStatus(id: number, status: OrderStatus, trackingNumber?: string): Promise<Order> {
    const order = await this.findOne(id);
    
    order.status = status;
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    return await this.ordersRepository.save(order);
  }
}
