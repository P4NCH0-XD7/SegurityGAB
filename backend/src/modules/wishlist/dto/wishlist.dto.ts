// ===========================================
// SegurityGAB — Wishlist DTO
// ===========================================

import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToWishlistDto {
  @ApiProperty({ example: 5, description: 'ID del producto a agregar a favoritos' })
  @IsInt({ message: 'productId debe ser un número entero.' })
  @Min(1)
  productId!: number;
}
