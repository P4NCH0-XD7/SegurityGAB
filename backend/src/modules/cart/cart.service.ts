import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {

  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,

    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) {}

  async addToCart(data: AddToCartDto) {

    let cart = await this.cartRepository.findOne({
      where: { userId: data.user_id }
    });

    if (!cart) {
      cart = await this.cartRepository.save({
        userId: data.user_id
      });
    }

    const item = await this.cartItemRepository.findOne({
      where: {
        cartId: cart.id,
        productId: data.product_id
      }
    });

    if (item) {
      item.quantity += data.quantity;
      return this.cartItemRepository.save(item);
    }

    return this.cartItemRepository.save({
      cartId: cart.id,
      productId: data.product_id,
      quantity: data.quantity
    });
  }

  async getCart(userId: number) {
    return this.cartRepository.findOne({
      where: { userId: userId },
      relations: ['items']
    });
  }

  async removeItem(itemId: number) {
    return this.cartItemRepository.delete(itemId);
  }

  async clearCart(userId: number) {

    const cart = await this.cartRepository.findOne({
      where: { userId: userId }
    });

    if (!cart) return;

    return this.cartItemRepository.delete({
      cartId: cart.id
    });
  }

}