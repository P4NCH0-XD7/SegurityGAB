// ===========================================
// SegurityGAB — Inventory Service
// ===========================================
// Lógica de negocio para movimientos de inventario:
// - Registrar un movimiento (IN / OUT / ADJUSTMENT)
// - Listar todos los movimientos (Admin)
// - Ver historial de movimientos de un producto
// - Ver un movimiento por ID
// - Consultar el stock actual de un producto

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Inventory, InventoryType } from './entities/inventory.entity';
import { Product } from '../products/entities/product.entity';
import { CreateInventoryDto } from './dto/inventory.dto';

@Injectable()
export class InventorysService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    // DataSource para transacciones atómicas
    private readonly dataSource: DataSource,
  ) {}

  //  Listar todos los movimientos (Admin) 
  async findAll(): Promise<Inventory[]> {
    return this.inventoryRepository.find({
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  //  Historial de movimientos de un producto 
  async findByProduct(productId: number): Promise<Inventory[]> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(
        `Producto con ID "${productId}" no encontrado.`,
      );
    }

    return this.inventoryRepository.find({
      where: { productId },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  //  Ver un movimiento por ID 
  async findById(id: number): Promise<Inventory> {
    const movement = await this.inventoryRepository.findOne({
      where: { id },
      relations: ['product'],
    });

    if (!movement) {
      throw new NotFoundException(
        `Movimiento de inventario con ID "${id}" no encontrado.`,
      );
    }

    return movement;
  }

  //  Registrar un movimiento y actualizar el stock 
  // Usa transacción atómica: si el update del stock falla, el movimiento
  // tampoco se guarda. Así el inventario nunca queda inconsistente.
  //
  // Comportamiento por tipo:
  //   IN           suma la cantidad al stock actual
  //   OUT          resta la cantidad del stock (valida que haya suficiente)
  //   ADJUSTMENT   reemplaza el stock directamente con la cantidad indicada
  async create(dto: CreateInventoryDto): Promise<Inventory> {
    const { productId, type, quantity, reason, referenceId } = dto;

    return this.dataSource.transaction(async (manager) => {
      // 1. Verificar que el producto existe
      const product = await manager.findOne(Product, {
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException(
          `Producto con ID "${productId}" no encontrado.`,
        );
      }

      // 2. Para salidas (OUT), validar que hay stock suficiente antes de restar
      if (type === InventoryType.OUT) {
        if ((product.stock ?? 0) < quantity) {
          throw new BadRequestException(
            `Stock insuficiente para "${product.name}". ` +
            `Disponible: ${product.stock}, solicitado: ${quantity}.`,
          );
        }
      }

      // 3. Guardar el movimiento en el historial
      const movement = manager.create(Inventory, {
        productId,
        type,
        quantity,
        reason,
        referenceId,
      });

      const saved = await manager.save(Inventory, movement);

      // 4. Actualizar el stock del producto según el tipo de movimiento
      if (type === InventoryType.IN) {
        // Entrada: suma al stock existente
        await manager.increment(Product, { id: productId }, 'stock', quantity);
      } else if (type === InventoryType.OUT) {
        // Salida: resta del stock existente
        await manager.decrement(Product, { id: productId }, 'stock', quantity);
      } else if (type === InventoryType.ADJUSTMENT) {
        // Ajuste manual: el valor quantity se convierte en el nuevo stock absoluto
        await manager.update(Product, { id: productId }, { stock: quantity });
      }

      // 5. Retornar el movimiento guardado con el producto relacionado
      const savedMovement = await manager.findOne(Inventory, {
        where: { id: saved.id },
        relations: ['product'],
      });

      if (!savedMovement) {
        throw new NotFoundException(
          `Movimiento de inventario con ID "${saved.id}" no encontrado después de guardar.`,
        );
      }

      return savedMovement;
    });
  }

  //  Consultar stock actual de un producto 
  async getStock(
    productId: number,
  ): Promise<{ productId: number; name: string; stock: number }> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(
        `Producto con ID "${productId}" no encontrado.`,
      );
    }

    return {
      productId: product.id,
      name:      product.name,
      stock:     product.stock,
    };
  }
}
