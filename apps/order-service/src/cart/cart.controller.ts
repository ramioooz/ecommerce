import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CartService } from './cart.service';

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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user cart' })
  async getCart(@Request() req: RequestWithUser) {
    const userId = req.user?.userId || 'guest';
    return this.cartService.getOrCreateCart(userId);
  }

  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add item to cart' })
  async addItem(@Request() req: RequestWithUser, @Body() body: any) {
    const userId = req.user?.userId || 'guest';
    return this.cartService.addItem(userId, body);
  }

  @Put('items/:productId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update cart item quantity' })
  async updateItem(
    @Request() req: RequestWithUser,
    @Param('productId') productId: string,
    @Body() body: { quantity: number },
  ) {
    const userId = req.user?.userId || 'guest';
    return this.cartService.updateItemQuantity(userId, productId, body.quantity);
  }

  @Delete('items/:productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove item from cart' })
  async removeItem(@Request() req: RequestWithUser, @Param('productId') productId: string) {
    const userId = req.user?.userId || 'guest';
    return this.cartService.removeItem(userId, productId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Clear cart' })
  async clearCart(@Request() req: RequestWithUser) {
    const userId = req.user?.userId || 'guest';
    return this.cartService.clearCart(userId);
  }
}
