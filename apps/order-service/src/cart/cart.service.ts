import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartsRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemsRepository: Repository<CartItem>,
  ) {}

  async getOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.cartsRepository.findOne({
      where: { userId },
      relations: ['items'],
    });

    if (!cart) {
      const createdCart = this.cartsRepository.create({ userId });
      const savedCart = await this.cartsRepository.save(createdCart);
      cart = await this.cartsRepository.findOne({
        where: { id: savedCart.id },
        relations: ['items'],
      });
    }

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    cart.items = cart.items || [];

    return cart;
  }

  async addItem(userId: string, data: {
    productId: string;
    productName: string;
    productImage?: string;
    quantity: number;
    price: number;
  }): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    const existingItem = await this.cartItemsRepository.findOne({
      where: { cartId: cart.id, productId: data.productId },
    });

    if (existingItem) {
      existingItem.quantity += data.quantity;
      existingItem.total = existingItem.price * existingItem.quantity;
      await this.cartItemsRepository.save(existingItem);
    } else {
      const cartItem = this.cartItemsRepository.create({
        cartId: cart.id,
        productId: data.productId,
        productName: data.productName,
        productImage: data.productImage || '',
        quantity: data.quantity,
        price: data.price,
        total: data.price * data.quantity,
      });
      await this.cartItemsRepository.save(cartItem);
    }

    return this.updateCartTotal(cart.id);
  }

  async updateItemQuantity(userId: string, productId: string, quantity: number): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);
    
    const cartItem = await this.cartItemsRepository.findOne({
      where: { cartId: cart.id, productId },
    });

    if (!cartItem) {
      throw new NotFoundException('Item not found in cart');
    }

    if (quantity <= 0) {
      await this.cartItemsRepository.remove(cartItem);
    } else {
      cartItem.quantity = quantity;
      cartItem.total = cartItem.price * quantity;
      await this.cartItemsRepository.save(cartItem);
    }

    return this.updateCartTotal(cart.id);
  }

  async removeItem(userId: string, productId: string): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);
    
    await this.cartItemsRepository.delete({
      cartId: cart.id,
      productId,
    });

    return this.updateCartTotal(cart.id);
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.getOrCreateCart(userId);
    await this.cartItemsRepository.delete({ cartId: cart.id });
    cart.total = 0;
    await this.cartsRepository.save(cart);
  }

  private async updateCartTotal(cartId: string): Promise<Cart> {
    const cart = await this.cartsRepository.findOne({
      where: { id: cartId },
      relations: ['items'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    cart.total = cart.items.reduce((sum, item) => sum + item.total, 0);
    return this.cartsRepository.save(cart);
  }
}
