// ===========================================
// SegurityGAB — Wishlist Controller
// ===========================================
// Rutas:
//   GET    /api/v1/wishlist/my              → Autenticado: mis favoritos
//   GET    /api/v1/wishlist/check/:productId → Autenticado: ¿está en favoritos?
//   POST   /api/v1/wishlist                 → Autenticado: agregar a favoritos
//   DELETE /api/v1/wishlist/:id             → Autenticado: eliminar favorito

import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { WishlistsService } from './wishlist.service';
import { AddToWishlistDto } from './dto/wishlist.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../auth/decorators/current-user.decorator';

@ApiTags('wishlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)   // Todos los endpoints requieren estar autenticado
@Controller('wishlist')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  // ── GET /wishlist/my  Mis favoritos
  @Get('my')
  @ApiOperation({ summary: 'Ver mi lista de deseos' })
  @ApiResponse({ status: 200, description: 'Lista de productos favoritos del usuario' })
  findMy(@CurrentUser() user: AuthenticatedUser) {
    return this.wishlistsService.findByUser(user.id);
  }

  // ── GET /wishlist/check/:productId  ¿Está en favoritos?
  // Útil para que el frontend marque el icono de corazón en el catálogo
  @Get('check/:productId')
  @ApiOperation({ summary: 'Verificar si un producto está en mis favoritos' })
  @ApiResponse({ status: 200, description: '{ inWishlist: boolean, wishlistId: number | null }' })
  check(
    @Param('productId', ParseIntPipe) productId: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.wishlistsService.check(user.id, productId);
  }

  // ── POST /wishlist  Agregar favorito
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Agregar producto a la lista de deseos' })
  @ApiResponse({ status: 201, description: 'Producto agregado a favoritos con sus datos' })
  @ApiResponse({ status: 409, description: 'El producto ya está en tu lista de deseos' })
  add(
    @Body() dto: AddToWishlistDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.wishlistsService.add(user.id, dto);
  }

  // ── DELETE /wishlist/:id  Eliminar favorito (por ID del favorito, no del producto)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar producto de la lista de deseos' })
  @ApiResponse({ status: 204, description: 'Favorito eliminado' })
  @ApiResponse({ status: 403, description: 'No puedes eliminar favoritos de otro usuario' })
  @ApiResponse({ status: 404, description: 'Favorito no encontrado' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.wishlistsService.remove(id, user.id, user.roleId);
  }
}
