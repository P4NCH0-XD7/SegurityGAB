import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('cart')
export class CartController {

  constructor(private readonly cartService: CartService) {}

  @Post('add')
  addToCart(@Body() data: AddToCartDto) {
    return this.cartService.addToCart(data);
  }

  @Get(':userId')
  getCart(@Param('userId') userId: number) {
    return this.cartService.getCart(userId);
  }

  @Delete('item/:id')
  removeItem(@Param('id') id: number) {
    return this.cartService.removeItem(id);
  }

  @Delete('clear/:userId')
  clearCart(@Param('userId') userId: number) {
    return this.cartService.clearCart(userId);
  }

}