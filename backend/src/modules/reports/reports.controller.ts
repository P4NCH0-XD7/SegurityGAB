// ===========================================
// SegurityGAB — Reports Controller
// ===========================================
// Rutas:
//   GET /api/v1/reports/dashboard  → Métricas generales del admin
//   GET /api/v1/reports/sales      → Detalle de ventas con filtros opcionales
//   GET /api/v1/reports/inventory  → Alertas de stock y movimientos

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

import { ReportsService } from './reports.service';
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

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, Role } from '../auth/decorators/roles.decorator';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  //  GET /reports/dashboard 
  @Get('dashboard')
  @ApiOperation({ summary: 'Métricas generales del dashboard (Admin)' })
  @ApiResponse({
    status: 200,
    description:
      'Total ventas, ingresos, pedidos pendientes, usuarios, productos, stock bajo y últimas 5 ventas.',
    type: DashboardReport,
  })
  getDashboard(): Promise<DashboardReport> {
    return this.reportsService.getDashboard();
  }

  //  GET /reports/sales 
  @Get('sales')
  @ApiOperation({ summary: 'Reporte de ventas con filtros opcionales (Admin)' })
  @ApiQuery({ name: 'period',    required: false, enum: ReportPeriod, description: 'Período del reporte' })
  @ApiQuery({ name: 'startDate', required: false, type: String,       description: 'Fecha inicio (YYYY-MM-DD), solo si period=custom' })
  @ApiQuery({ name: 'endDate',   required: false, type: String,       description: 'Fecha fin (YYYY-MM-DD), solo si period=custom' })
  @ApiQuery({ name: 'topLimit',  required: false, type: Number,       description: 'Límite del top de productos (1-50, default 10)' })
  @ApiResponse({
    status: 200,
    description:
      'Resumen general, ventas por estado, top productos más vendidos y ventas por mes.',
    type: SalesReport,
  })
  getSalesReport(@Query() query: SalesReportQueryDto): Promise<SalesReport> {
    return this.reportsService.getSalesReport(query);
  }

  //  GET /reports/inventory 
  @Get('inventory')
  @ApiOperation({ summary: 'Reporte de inventario con filtros opcionales (Admin)' })
  @ApiQuery({ name: 'stockThreshold',  required: false, type: Number, description: 'Umbral de stock bajo (default 10)' })
  @ApiQuery({ name: 'movementsLimit',  required: false, type: Number, description: 'Cantidad de movimientos a mostrar (default 20)' })
  @ApiResponse({
    status: 200,
    description:
      'Productos sin stock, con stock bajo, últimos movimientos y resumen por tipo.',
    type: InventoryReport,
  })
  getInventoryReport(
    @Query() query: InventoryReportQueryDto,
  ): Promise<InventoryReport> {
    return this.reportsService.getInventoryReport(query);
  }
}
