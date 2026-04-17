// ===========================================
// SegurityGAB — Wishlist Service
// ===========================================
// Lógica de negocio para la lista de deseos:
// - Agregar un producto a favoritos
// - Ver mis favoritos
// - Eliminar un favorito
// - Verificar si un producto ya está en favoritos

import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Wishlist } from './entities/wishlist.entity';
import { AddToWishlistDto } from './dto/wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) {}

  // ── Ver mis favoritos (usuario autenticado) 
  async findByUser(userId: number): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      where: { userId },
      relations: ['product', 'product.category'],
      order: { addedAt: 'DESC' },
    });
  }

  // ── Agregar producto a favoritos
  // La entidad tiene @Unique(['userId', 'productId']) así que si el producto
  // ya existe en la lista, la BD lanza un error que capturamos aquí.
  async add(userId: number, dto: AddToWishlistDto): Promise<Wishlist> {
    // Verificar si ya existe antes de intentar insertar
    const existing = await this.wishlistRepository.findOne({
      where: { userId, productId: dto.productId },
    });

    if (existing) {
      throw new ConflictException(
        `El producto con ID "${dto.productId}" ya está en tu lista de deseos.`,
      );
    }

    const item = this.wishlistRepository.create({
      userId,
      productId: dto.productId,
    });

    const saved = await this.wishlistRepository.save(item);

    // Retornar con relaciones incluidas
    return this.wishlistRepository.findOne({
      where: { id: saved.id },
      relations: ['product', 'product.category'],
    });
  }

  // ── Eliminar un favorito (por ID del favorito, no del producto)
  async remove(id: number, userId: number, userRoleId: number): Promise<void> {
    const item = await this.wishlistRepository.findOne({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(
        `Favorito con ID "${id}" no encontrado.`,
      );
    }

    // Un usuario solo puede eliminar sus propios favoritos
    if (userRoleId !== 1 && item.userId !== userId) {
      throw new ForbiddenException(
        'No puedes eliminar favoritos de otro usuario.',
      );
    }

    await this.wishlistRepository.remove(item);
  }

  // ── Verificar si un producto está en favoritos (por userId y productId)
  // Útil para que el frontend muestre el estado del botón de favorito
  async check(userId: number, productId: number): Promise<{ inWishlist: boolean; wishlistId: number | null }> {
    const item = await this.wishlistRepository.findOne({
      where: { userId, productId },
    });

    return {
      inWishlist: !!item,
      wishlistId: item?.id ?? null,
    };
  }
}
