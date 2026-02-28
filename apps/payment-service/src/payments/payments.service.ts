import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  async create(data: {
    orderId: string;
    userId: string;
    amount: number;
    method: string;
  }): Promise<Payment> {
    const payment = new Payment();
    payment.orderId = data.orderId;
    payment.userId = data.userId;
    payment.amount = data.amount;
    payment.method = data.method as any;
    return this.paymentsRepository.save(payment);
  }

  async findByOrderId(orderId: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { orderId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async updateStatus(
    orderId: string,
    status: string,
    transactionId?: string,
    metadata?: Record<string, any>,
  ): Promise<Payment> {
    const payment = await this.findByOrderId(orderId);
    payment.status = status as any;
    if (transactionId) {
      payment.transactionId = transactionId;
    }
    if (metadata) {
      payment.metadata = { ...payment.metadata, ...metadata };
    }
    return this.paymentsRepository.save(payment);
  }

  async markAsCompleted(orderId: string, transactionId: string): Promise<Payment> {
    return this.updateStatus(orderId, 'completed', transactionId);
  }

  async markAsFailed(orderId: string, failureReason: string): Promise<Payment> {
    const payment = await this.findByOrderId(orderId);
    payment.status = 'failed' as any;
    payment.failureReason = failureReason;
    return this.paymentsRepository.save(payment);
  }
}
