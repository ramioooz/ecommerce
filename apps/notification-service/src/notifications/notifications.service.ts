import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  constructor(private configService: ConfigService) {}

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    console.log(`Sending email to ${to}: ${subject}`);
    console.log(`Body: ${body}`);
  }

  async sendOrderConfirmation(email: string, orderNumber: string): Promise<void> {
    await this.sendEmail(
      email,
      'Order Confirmation',
      `Your order ${orderNumber} has been confirmed!`,
    );
  }

  async sendPaymentConfirmation(email: string, orderNumber: string): Promise<void> {
    await this.sendEmail(
      email,
      'Payment Received',
      `Payment for order ${orderNumber} has been received!`,
    );
  }

  async sendShippingNotification(email: string, orderNumber: string): Promise<void> {
    await this.sendEmail(
      email,
      'Order Shipped',
      `Your order ${orderNumber} has been shipped!`,
    );
  }
}
