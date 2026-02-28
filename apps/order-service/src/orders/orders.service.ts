import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
  ) {}

  async create(userId: string, data: {
    items: any[];
    shippingAddressId: string;
    shippingAddress: string;
    couponCode?: string;
  }): Promise<Order> {
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const subtotal = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const shipping = subtotal > 100 ? 0 : 10;
    const discount = 0;
    const total = subtotal + tax + shipping - discount;

    const order = this.ordersRepository.create({
      userId,
      orderNumber,
      subtotal,
      tax,
      shipping,
      total,
      discount,
      shippingAddressId: data.shippingAddressId,
      shippingAddress: data.shippingAddress,
      couponCode: data.couponCode,
    });

    const savedOrder = await this.ordersRepository.save(order);

    const orderItems = data.items.map((item) => {
      return this.orderItemsRepository.create({
        orderId: savedOrder.id,
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage || '',
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      });
    });

    await this.orderItemsRepository.save(orderItems);

    return this.findOne(savedOrder.id);
  }

  async findAll(userId: string): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId?: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (userId && order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status as any;
    return this.ordersRepository.save(order);
  }

  async cancel(id: string, userId?: string): Promise<Order> {
    return this.updateStatus(id, 'cancelled');
  }
}
