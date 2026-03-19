// ===========================================
// SegurityGAB — Cart Controller
// ===========================================
// Todos los endpoints del carrito requieren JWT.
// Un usuario solo puede manipular su propio carrito.

import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../auth/decorators/roles.decorator';

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)    // Todos los endpoints del carrito requieren estar autenticado
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @ApiOperation({ summary: 'Agregar producto al carrito' })
  @ApiResponse({ status: 201, description: 'Producto agregado al carrito' })
  addToCart(
    @Body() data: AddToCartDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    // Un usuario solo puede agregar al propio carrito (Admin puede agregar a cualquiera)
    if (user.roleId !== Role.Admin && data.user_id !== user.id) {
      throw new ForbiddenException('Solo puedes modificar tu propio carrito.');
    }
    return this.cartService.addToCart(data);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Obtener carrito de un usuario' })
  @ApiResponse({ status: 200, description: 'Carrito del usuario' })
  getCart(
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    // Un usuario solo puede ver su propio carrito (Admin puede ver todos)
    if (user.roleId !== Role.Admin && userId !== user.id) {
      throw new ForbiddenException('Solo puedes ver tu propio carrito.');
    }
    return this.cartService.getCart(userId);
  }

  @Delete('item/:id')
  @ApiOperation({ summary: 'Eliminar un ítem del carrito' })
  @ApiResponse({ status: 200, description: 'Ítem eliminado' })
  removeItem(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.removeItem(id);
  }

  @Delete('clear/:userId')
  @ApiOperation({ summary: 'Vaciar carrito de un usuario' })
  @ApiResponse({ status: 200, description: 'Carrito vaciado' })
  clearCart(
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    // Un usuario solo puede vaciar su propio carrito (Admin puede vaciar todos)
    if (user.roleId !== Role.Admin && userId !== user.id) {
      throw new ForbiddenException('Solo puedes vaciar tu propio carrito.');
    }
    return this.cartService.clearCart(userId);
  }
}
