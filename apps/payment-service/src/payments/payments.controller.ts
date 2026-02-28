import { Controller, Post, Get, Body, Param, UseGuards, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Initiate checkout' })
  async checkout(@Body() body: { orderId: string; paymentMethod: string }) {
    return this.paymentsService.create({
      orderId: body.orderId,
      userId: 'user-id-from-token',
      amount: 0,
      method: body.paymentMethod,
    });
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Payment webhook' })
  async webhook(@Body() body: any) {
    return { received: true };
  }

  @Get(':orderId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment status' })
  async getPaymentStatus(@Param('orderId') orderId: string) {
    return this.paymentsService.findByOrderId(orderId);
  }
}
