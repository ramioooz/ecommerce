import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers, HttpCode, HttpStatus, Req, UseGuards, Patch } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Gateway')
@Controller()
@UseGuards(ThrottlerGuard)
export class GatewayController {
  
  // ==================== AUTH ====================
  
  @Post('auth/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user' })
  async register(@Body() body: any) {
    const response = await fetch('http://user-service:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return response.json();
  }

  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() body: any) {
    const response = await fetch('http://user-service:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return response.json();
  }

  @Post('auth/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body() body: any) {
    const response = await fetch('http://user-service:3001/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return response.json();
  }

  // ==================== USERS ====================

  @Get('users/profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Headers('authorization') auth: string) {
    const response = await fetch('http://user-service:3001/api/users/profile', {
      headers: { 'Authorization': auth },
    });
    return response.json();
  }

  @Put('users/profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(@Headers('authorization') auth: string, @Body() body: any) {
    const response = await fetch('http://user-service:3001/api/users/profile', {
      method: 'PUT',
      headers: { 
        'Authorization': auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return response.json();
  }

  // ==================== ADDRESSES ====================

  @Post('users/addresses')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add new address' })
  async addAddress(@Headers('authorization') auth: string, @Body() body: any) {
    const response = await fetch('http://user-service:3001/api/users/addresses', {
      method: 'POST',
      headers: { 
        'Authorization': auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return response.json();
  }

  @Get('users/addresses')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all addresses' })
  async getAddresses(@Headers('authorization') auth: string) {
    const response = await fetch('http://user-service:3001/api/users/addresses', {
      headers: { 'Authorization': auth },
    });
    return response.json();
  }

  @Delete('users/addresses/:id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete address' })
  async deleteAddress(@Headers('authorization') auth: string, @Param('id') id: string) {
    const response = await fetch(`http://user-service:3001/api/users/addresses/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': auth },
    });
    return response.json();
  }

  // ==================== PRODUCTS ====================

  @Get('products')
  @ApiOperation({ summary: 'Get all products' })
  async getProducts(@Query() query: any) {
    const params = new URLSearchParams(query);
    const response = await fetch(`http://product-service:3002/api/products?${params}`);
    return response.json();
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Get product by ID' })
  async getProduct(@Param('id') id: string) {
    const response = await fetch(`http://product-service:3002/api/products/${id}`);
    return response.json();
  }

  @Post('products')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create product (Admin)' })
  async createProduct(@Headers('authorization') auth: string, @Body() body: any) {
    const response = await fetch('http://product-service:3002/api/products', {
      method: 'POST',
      headers: { 
        'Authorization': auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return response.json();
  }

  @Put('products/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product (Admin)' })
  async updateProduct(@Headers('authorization') auth: string, @Param('id') id: string, @Body() body: any) {
    const response = await fetch(`http://product-service:3002/api/products/${id}`, {
      method: 'PUT',
      headers: { 
        'Authorization': auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return response.json();
  }

  @Delete('products/:id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete product (Admin)' })
  async deleteProduct(@Headers('authorization') auth: string, @Param('id') id: string) {
    const response = await fetch(`http://product-service:3002/api/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': auth },
    });
    return response.json();
  }

  // ==================== CATEGORIES ====================

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  async getCategories() {
    const response = await fetch('http://product-service:3002/api/categories');
    return response.json();
  }

  @Post('categories')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create category (Admin)' })
  async createCategory(@Headers('authorization') auth: string, @Body() body: any) {
    const response = await fetch('http://product-service:3002/api/categories', {
      method: 'POST',
      headers: { 
        'Authorization': auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return response.json();
  }

  // ==================== CART ====================

  @Get('cart')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user cart' })
  async getCart(@Headers('authorization') auth: string) {
    const response = await fetch('http://order-service:3003/api/cart', {
      headers: { 'Authorization': auth },
    });
    return response.json();
  }

  @Post('cart/items')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add item to cart' })
  async addToCart(@Headers('authorization') auth: string, @Body() body: any) {
    const response = await fetch('http://order-service:3003/api/cart/items', {
      method: 'POST',
      headers: { 
        'Authorization': auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return response.json();
  }

  @Put('cart/items/:productId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update cart item quantity' })
  async updateCartItem(
    @Headers('authorization') auth: string, 
    @Param('productId') productId: string, 
    @Body() body: any
  ) {
    const response = await fetch(`http://order-service:3003/api/cart/items/${productId}`, {
      method: 'PUT',
      headers: { 
        'Authorization': auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return response.json();
  }

  @Delete('cart/items/:productId')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove item from cart' })
  async removeFromCart(@Headers('authorization') auth: string, @Param('productId') productId: string) {
    const response = await fetch(`http://order-service:3003/api/cart/items/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': auth },
    });
    return response.json();
  }

  @Delete('cart')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear cart' })
  async clearCart(@Headers('authorization') auth: string) {
    const response = await fetch('http://order-service:3003/api/cart', {
      method: 'DELETE',
      headers: { 'Authorization': auth },
    });
    return response.json();
  }

  // ==================== ORDERS ====================

  @Post('orders')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new order' })
  async createOrder(@Headers('authorization') auth: string, @Body() body: any) {
    const response = await fetch('http://order-service:3003/api/orders', {
      method: 'POST',
      headers: { 
        'Authorization': auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return response.json();
  }

  @Get('orders')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user orders' })
  async getOrders(@Headers('authorization') auth: string) {
    const response = await fetch('http://order-service:3003/api/orders', {
      headers: { 'Authorization': auth },
    });
    return response.json();
  }

  @Get('orders/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order by ID' })
  async getOrder(@Headers('authorization') auth: string, @Param('id') id: string) {
    const response = await fetch(`http://order-service:3003/api/orders/${id}`, {
      headers: { 'Authorization': auth },
    });
    return response.json();
  }

  @Patch('orders/:id/cancel')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel order' })
  async cancelOrder(@Headers('authorization') auth: string, @Param('id') id: string) {
    const response = await fetch(`http://order-service:3003/api/orders/${id}/cancel`, {
      method: 'PATCH',
      headers: { 'Authorization': auth },
    });
    return response.json();
  }

  // ==================== PAYMENTS ====================

  @Post('payments/checkout')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Initiate checkout' })
  async checkout(@Headers('authorization') auth: string, @Body() body: any) {
    const response = await fetch('http://payment-service:3004/api/payments/checkout', {
      method: 'POST',
      headers: { 
        'Authorization': auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return response.json();
  }

  @Post('payments/webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Payment webhook' })
  async paymentWebhook(@Body() body: any) {
    const response = await fetch('http://payment-service:3004/api/payments/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return response.json();
  }

  @Get('payments/:orderId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment status' })
  async getPaymentStatus(@Headers('authorization') auth: string, @Param('orderId') orderId: string) {
    const response = await fetch(`http://payment-service:3004/api/payments/${orderId}`, {
      headers: { 'Authorization': auth },
    });
    return response.json();
  }

  // ==================== HEALTH CHECK ====================

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  async health() {
    return { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      service: 'api-gateway',
    };
  }
}
