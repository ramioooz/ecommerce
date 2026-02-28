import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new order' })
  async create(@Request() req: RequestWithUser, @Body() body: any) {
    const userId = req.user!.userId;
    return this.ordersService.create(userId, body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user orders' })
  async findAll(@Request() req: RequestWithUser) {
    const userId = req.user!.userId;
    return this.ordersService.findAll(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order by ID' })
  async findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.ordersService.findOne(id, req.user!.userId);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel order' })
  async cancel(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.ordersService.cancel(id, req.user!.userId);
  }
}
