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
      where: { user_id: data.user_id }
    });

    if (!cart) {
      cart = await this.cartRepository.save({
        user_id: data.user_id
      });
    }

    const item = await this.cartItemRepository.findOne({
      where: {
        cart_id: cart.id,
        product_id: data.product_id
      }
    });

    if (item) {
      item.quantity += data.quantity;
      return this.cartItemRepository.save(item);
    }

    return this.cartItemRepository.save({
      cart_id: cart.id,
      product_id: data.product_id,
      quantity: data.quantity
    });
  }

  async getCart(userId: number) {
    return this.cartRepository.findOne({
      where: { user_id: userId },
      relations: ['items']
    });
  }

  async removeItem(itemId: number) {
    return this.cartItemRepository.delete(itemId);
  }

  async clearCart(userId: number) {

    const cart = await this.cartRepository.findOne({
      where: { user_id: userId }
    });

    if (!cart) return;

    return this.cartItemRepository.delete({
      cart_id: cart.id
    });
  }

}