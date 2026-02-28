import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface RequestWithUser {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user cart' })
  async getCart(@Request() req: RequestWithUser) {
    const userId = req.user!.userId;
    return this.cartService.getOrCreateCart(userId);
  }

  @Post('items')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add item to cart' })
  async addItem(@Request() req: RequestWithUser, @Body() body: any) {
    const userId = req.user!.userId;
    return this.cartService.addItem(userId, body);
  }

  @Put('items/:productId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update cart item quantity' })
  async updateItem(
    @Request() req: RequestWithUser,
    @Param('productId') productId: string,
    @Body() body: { quantity: number },
  ) {
    const userId = req.user!.userId;
    return this.cartService.updateItemQuantity(userId, productId, body.quantity);
  }

  @Delete('items/:productId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove item from cart' })
  async removeItem(@Request() req: RequestWithUser, @Param('productId') productId: string) {
    const userId = req.user!.userId;
    return this.cartService.removeItem(userId, productId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Clear cart' })
  async clearCart(@Request() req: RequestWithUser) {
    const userId = req.user!.userId;
    return this.cartService.clearCart(userId);
  }
}
