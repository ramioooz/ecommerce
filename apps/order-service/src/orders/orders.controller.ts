import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OrdersService } from './orders.service';

interface RequestWithUser {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new order' })
  async create(@Request() req: RequestWithUser, @Body() body: any) {
    const userId = req.user?.userId || 'guest';
    return this.ordersService.create(userId, body);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user orders' })
  async findAll(@Request() req: RequestWithUser) {
    const userId = req.user?.userId || 'guest';
    return this.ordersService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel order' })
  async cancel(@Param('id') id: string) {
    return this.ordersService.cancel(id);
  }
}
