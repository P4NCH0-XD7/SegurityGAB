// ===========================================
// SegurityGAB — Sales Service
// ===========================================
// Lógica de negocio para ventas:
// - Crear venta desde una lista de productos (descuenta stock)
// - Listar ventas (todas o por usuario)
// - Ver detalle de una venta
// - Cambiar estado de la venta
// - Cancelar venta (restaura stock)

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Sale, SaleStatus } from './entities/sale.entity';
import { SaleDetail } from './entities/sale-detail.entity';
import { Product } from '../products/entities/product.entity';
import { CreateSaleDto, UpdateSaleStatusDto } from './dto/sale.dto';

// Flujo válido de estados — solo se puede avanzar en esta dirección
const STATUS_FLOW: Record<SaleStatus, SaleStatus[]> = {
  [SaleStatus.PENDING]:   [SaleStatus.PAID, SaleStatus.CANCELLED],
  [SaleStatus.PAID]:      [SaleStatus.SHIPPED, SaleStatus.CANCELLED],
  [SaleStatus.SHIPPED]:   [SaleStatus.DELIVERED],
  [SaleStatus.DELIVERED]: [],
  [SaleStatus.CANCELLED]: [],
};

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,

    @InjectRepository(SaleDetail)
    private readonly saleDetailRepository: Repository<SaleDetail>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    // DataSource para transacciones atómicas
    private readonly dataSource: DataSource,
  ) {}

  // ── Listar todas las ventas (Admin) ────────────────────────────────────────
  async findAll(): Promise<Sale[]> {
    return this.saleRepository.find({
      relations: ['user', 'details', 'details.product'],
      order: { createdAt: 'DESC' },
    });
  }

  // ── Listar ventas de un usuario específico ─────────────────────────────────
  async findByUser(userId: number): Promise<Sale[]> {
    return this.saleRepository.find({
      where: { userId },
      relations: ['details', 'details.product'],
      order: { createdAt: 'DESC' },
    });
  }

  // ── Ver una venta por ID ───────────────────────────────────────────────────
  async findById(id: number): Promise<Sale> {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['user', 'details', 'details.product'],
    });

    if (!sale) {
      throw new NotFoundException(`Venta con ID "${id}" no encontrada.`);
    }

    return sale;
  }

  // ── Crear venta con transacción atómica ───────────────────────────────────
  // Pasos: validar stock → calcular totales → crear Sale + SaleDetails → descontar stock
  // Si algo falla, toda la transacción se revierte (rollback automático)
  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    const { userId, shippingAddress, items } = createSaleDto;

    return this.dataSource.transaction(async (manager) => {
      let totalAmount = 0;
      const saleDetails: Partial<SaleDetail>[] = [];

      // Paso 1: validar stock y calcular total
      for (const item of items) {
        const product = await manager.findOne(Product, {
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(
            `Producto con ID "${item.productId}" no encontrado.`,
          );
        }

        if (product.status === 'hidden') {
          throw new BadRequestException(
            `El producto "${product.name}" no está disponible.`,
          );
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Stock insuficiente para "${product.name}". Disponible: ${product.stock}, solicitado: ${item.quantity}.`,
          );
        }

        const unitPrice = Number(product.price);
        const subtotal  = unitPrice * item.quantity;
        totalAmount    += subtotal;

        saleDetails.push({
          productId: item.productId,
          quantity:  item.quantity,
          unitPrice,          // precio congelado al momento de la venta
          subtotal,
        });
      }

      // Paso 2: crear la cabecera de la venta
      const sale = manager.create(Sale, {
        userId,
        shippingAddress,
        totalAmount,
        status: SaleStatus.PENDING,
      });

      const savedSale = await manager.save(Sale, sale);

      // Paso 3: crear los detalles asociando el saleId
      for (const detail of saleDetails) {
        const saleDetail = manager.create(SaleDetail, {
          ...detail,
          saleId: savedSale.id,
        });
        await manager.save(SaleDetail, saleDetail);
      }

      // Paso 4: descontar stock de cada producto
      for (const item of items) {
        await manager.decrement(
          Product,
          { id: item.productId },
          'stock',
          item.quantity,
        );
      }

      // Retornar la venta completa con sus detalles
      const result = await manager.findOne(Sale, {
        where: { id: savedSale.id },
        relations: ['user', 'details', 'details.product'],
      });

      if (!result) {
        throw new NotFoundException('No se pudo recuperar la venta creada.');
      }

      return result;
    });
  }

  // ── Cambiar estado de la venta ─────────────────────────────────────────────
  async updateStatus(
    id: number,
    dto: UpdateSaleStatusDto,
    requestingUserId: number,
    requestingUserRoleId: number,
  ): Promise<Sale> {
    const sale = await this.findById(id);

    // Un cliente solo puede ver sus propias ventas, no cambiar estado
    // Solo Admin puede cambiar el estado
    if (requestingUserRoleId !== 1) {
      throw new ForbiddenException(
        'Solo un administrador puede cambiar el estado de una venta.',
      );
    }

    // Validar que la transición de estado sea válida
    const allowedTransitions = STATUS_FLOW[sale.status];
    if (!allowedTransitions.includes(dto.status)) {
      throw new BadRequestException(
        `No se puede cambiar el estado de "${sale.status}" a "${dto.status}". ` +
        `Estados permitidos desde "${sale.status}": ${allowedTransitions.join(', ') || 'ninguno'}.`,
      );
    }

    // Si se cancela, restaurar el stock de cada producto
    if (dto.status === SaleStatus.CANCELLED) {
      await this.dataSource.transaction(async (manager) => {
        for (const detail of sale.details) {
          await manager.increment(
            Product,
            { id: detail.productId },
            'stock',
            detail.quantity,
          );
        }

        await manager.update(Sale, { id }, { status: dto.status });
      });
    } else {
      await this.saleRepository.update({ id }, { status: dto.status });
    }

    return this.findById(id);
  }
}
