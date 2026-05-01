// ===========================================
// SegurityGAB — Reports Service
// ===========================================
// Genera métricas consultando directamente las tablas
// de sales, sale_details, products, inventory y users.
// No tiene entidad propia — solo lectura de datos.

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Sale, SaleStatus } from '../sales/entities/sale.entity';
import { SaleDetail } from '../sales/entities/sale-detail.entity';
import { Product } from '../products/entities/product.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { User } from '../users/entities/user.entity';

import {
  SalesReportQueryDto,
  InventoryReportQueryDto,
  ReportPeriod,
} from './dto/create-reports.dto';

import {
  DashboardReport,
  SalesReport,
  InventoryReport,
} from './entities/reports.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepo: Repository<Sale>,

    @InjectRepository(SaleDetail)
    private readonly saleDetailRepo: Repository<SaleDetail>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // ── Calcular fechas según el período seleccionado ─────────────────────────
  private getDateRange(query: SalesReportQueryDto): { start: string; end: string } {
    const now   = new Date();
    const today = now.toISOString().split('T')[0];

    if (query.period === ReportPeriod.CUSTOM && query.startDate && query.endDate) {
      return { start: query.startDate, end: query.endDate };
    }

    const periods: Record<string, string> = {
      [ReportPeriod.TODAY]:   `DATE_SUB(NOW(), INTERVAL 1 DAY)`,
      [ReportPeriod.WEEK]:    `DATE_SUB(NOW(), INTERVAL 7 DAY)`,
      [ReportPeriod.MONTH]:   `DATE_SUB(NOW(), INTERVAL 1 MONTH)`,
      [ReportPeriod.QUARTER]: `DATE_SUB(NOW(), INTERVAL 3 MONTH)`,
      [ReportPeriod.YEAR]:    `DATE_SUB(NOW(), INTERVAL 1 YEAR)`,
    };

    return {
      start: periods[query.period ?? ReportPeriod.MONTH] ?? periods[ReportPeriod.MONTH],
      end: today,
    };
  }

  // ── GET /reports/dashboard ─────────────────────────────────────────────────
  async getDashboard(): Promise<DashboardReport> {
    // Total de ventas y monto acumulado (solo ventas pagadas, enviadas o entregadas)
    const salesStats = await this.saleRepo
      .createQueryBuilder('sale')
      .select('COUNT(sale.id)', 'totalSales')
      .addSelect('COALESCE(SUM(sale.totalAmount), 0)', 'totalRevenue')
      .where('sale.status IN (:...statuses)', {
        statuses: [SaleStatus.PAID, SaleStatus.SHIPPED, SaleStatus.DELIVERED],
      })
      .getRawOne();

    const pendingSales = await this.saleRepo.count({ where: { status: SaleStatus.PENDING } });
    const totalUsers   = await this.userRepo.count({ where: { isActive: true } });
    const totalProducts = await this.productRepo.count({ where: { status: 'visible' } });

    const outOfStock = await this.productRepo
      .createQueryBuilder('p')
      .where('p.stock = 0')
      .andWhere('p.status = :status', { status: 'visible' })
      .andWhere('p.deletedAt IS NULL')
      .getCount();

    const lowStock = await this.productRepo
      .createQueryBuilder('p')
      .where('p.stock > 0 AND p.stock < 10')
      .andWhere('p.status = :status', { status: 'visible' })
      .andWhere('p.deletedAt IS NULL')
      .getCount();

    const recentSales = await this.saleRepo.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return {
      totalSales:   Number(salesStats.totalSales)   || 0,
      totalRevenue: Number(salesStats.totalRevenue) || 0,
      pendingSales,
      totalUsers,
      totalProducts,
      outOfStock,
      lowStock,
      recentSales,
    };
  }

  // ── GET /reports/sales ─────────────────────────────────────────────────────
  async getSalesReport(query: SalesReportQueryDto): Promise<SalesReport> {
    const { start, end } = this.getDateRange(query);
    const topLimit = query.topLimit ?? 10;

    // Para periodo predefinido usamos expresión SQL, para custom usamos fechas literales
    const isCustom = query.period === ReportPeriod.CUSTOM;

    // Totales agrupados por estado dentro del período
    const byStatusQb = this.saleRepo
      .createQueryBuilder('sale')
      .select('sale.status', 'status')
      .addSelect('COUNT(sale.id)', 'count')
      .addSelect('COALESCE(SUM(sale.totalAmount), 0)', 'total');

    if (isCustom) {
      byStatusQb.where('sale.createdAt BETWEEN :start AND :end', { start, end });
    } else {
      byStatusQb.where(`sale.createdAt >= ${start}`);
    }

    const byStatus = await byStatusQb.groupBy('sale.status').getRawMany();

    // Top N productos más vendidos
    const topProductsQb = this.saleDetailRepo
      .createQueryBuilder('sd')
      .select('sd.productId', 'productId')
      .addSelect('p.name', 'productName')
      .addSelect('SUM(sd.quantity)', 'totalQuantity')
      .addSelect('SUM(sd.subtotal)', 'totalRevenue')
      .innerJoin('sd.product', 'p')
      .innerJoin('sd.sale', 'sale');

    if (isCustom) {
      topProductsQb.where('sale.createdAt BETWEEN :start AND :end', { start, end });
    } else {
      topProductsQb.where(`sale.createdAt >= ${start}`);
    }

    const topProducts = await topProductsQb
      .groupBy('sd.productId')
      .addGroupBy('p.name')
      .orderBy('SUM(sd.quantity)', 'DESC')
      .limit(topLimit)
      .getRawMany();

    // Ventas por mes dentro del período
    const byMonthQb = this.saleRepo
      .createQueryBuilder('sale')
      .select("DATE_FORMAT(sale.createdAt, '%Y-%m')", 'month')
      .addSelect('COUNT(sale.id)', 'count')
      .addSelect('COALESCE(SUM(sale.totalAmount), 0)', 'total')
      .where('sale.status != :cancelled', { cancelled: SaleStatus.CANCELLED });

    if (isCustom) {
      byMonthQb.andWhere('sale.createdAt BETWEEN :start AND :end', { start, end });
    } else {
      byMonthQb.andWhere(`sale.createdAt >= ${start}`);
    }

    const byMonth = await byMonthQb
      .groupBy("DATE_FORMAT(sale.createdAt, '%Y-%m')")
      .orderBy("DATE_FORMAT(sale.createdAt, '%Y-%m')", 'ASC')
      .getRawMany();

    // Resumen general del período
    const summaryQb = this.saleRepo
      .createQueryBuilder('sale')
      .select('COUNT(sale.id)', 'totalOrders')
      .addSelect('COALESCE(SUM(sale.totalAmount), 0)', 'totalRevenue')
      .addSelect('COALESCE(AVG(sale.totalAmount), 0)', 'averageOrder')
      .where('sale.status != :cancelled', { cancelled: SaleStatus.CANCELLED });

    if (isCustom) {
      summaryQb.andWhere('sale.createdAt BETWEEN :start AND :end', { start, end });
    } else {
      summaryQb.andWhere(`sale.createdAt >= ${start}`);
    }

    const summary = await summaryQb.getRawOne();

    return {
      summary: {
        totalOrders:  Number(summary.totalOrders)  || 0,
        totalRevenue: Number(summary.totalRevenue) || 0,
        averageOrder: Number(Number(summary.averageOrder).toFixed(2)) || 0,
      },
      byStatus: byStatus.map(row => ({
        status: row.status,
        count:  Number(row.count),
        total:  Number(row.total),
      })),
      topProducts: topProducts.map(row => ({
        productId:     Number(row.productId),
        productName:   row.productName,
        totalQuantity: Number(row.totalQuantity),
        totalRevenue:  Number(row.totalRevenue),
      })),
      byMonth: byMonth.map(row => ({
        month: row.month,
        count: Number(row.count),
        total: Number(row.total),
      })),
    };
  }

  // ── GET /reports/inventory ─────────────────────────────────────────────────
  async getInventoryReport(query: InventoryReportQueryDto): Promise<InventoryReport> {
    const threshold     = query.stockThreshold  ?? 10;
    const movementsLimit = query.movementsLimit ?? 20;

    // Productos sin stock
    const outOfStockProducts = await this.productRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'cat')
      .where('p.stock = 0')
      .andWhere('p.status = :status', { status: 'visible' })
      .andWhere('p.deletedAt IS NULL')
      .orderBy('p.name', 'ASC')
      .getMany();

    // Productos con stock bajo (entre 1 y el umbral definido)
    const lowStockProducts = await this.productRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'cat')
      .where('p.stock > 0 AND p.stock < :threshold', { threshold })
      .andWhere('p.status = :status', { status: 'visible' })
      .andWhere('p.deletedAt IS NULL')
      .orderBy('p.stock', 'ASC')
      .getMany();

    // Últimos N movimientos de inventario
    const recentMovements = await this.inventoryRepo.find({
      relations: ['product'],
      order: { createdAt: 'DESC' },
      take: movementsLimit,
    });

    // Resumen de movimientos por tipo (IN / OUT / ADJUSTMENT)
    const movementsSummary = await this.inventoryRepo
      .createQueryBuilder('inv')
      .select('inv.type', 'type')
      .addSelect('COUNT(inv.id)', 'count')
      .addSelect('COALESCE(SUM(inv.quantity), 0)', 'totalQuantity')
      .groupBy('inv.type')
      .getRawMany();

    return {
      summary: {
        outOfStockCount: outOfStockProducts.length,
        lowStockCount:   lowStockProducts.length,
      },
      outOfStockProducts: outOfStockProducts.map(p => ({
        id:       p.id,
        name:     p.name,
        sku:      p.sku ?? null,
        stock:    p.stock,
        category: (p as any).category?.name ?? null,
      })),
      lowStockProducts: lowStockProducts.map(p => ({
        id:       p.id,
        name:     p.name,
        sku:      p.sku ?? null,
        stock:    p.stock,
        category: (p as any).category?.name ?? null,
      })),
      recentMovements: recentMovements.map(m => ({
        id: m.id!,
        productId: m.productId!,
        type: m.type!,
        quantity: m.quantity!,
        reason: m.reason ?? null,
        referenceId: m.referenceId ?? null,
        createdAt: m.createdAt!,
        product: m.product ? {
          id: m.product.id,
          name: m.product.name,
          sku: m.product.sku
        } : undefined
      })),
      movementsSummary: movementsSummary.map(row => ({
        type:          row.type,
        count:         Number(row.count),
        totalQuantity: Number(row.totalQuantity),
      })),
    };
  }
}
