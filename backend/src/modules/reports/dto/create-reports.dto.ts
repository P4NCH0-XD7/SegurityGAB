// ===========================================
// SegurityGAB — Reports DTOs
// ===========================================
// Define los tipos de entrada para los reportes.
// Reports no crea ni modifica datos, solo consulta.
// Los DTOs aquí son para filtros opcionales de consulta.

import { IsOptional, IsEnum, IsDateString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

//  Enum de períodos disponibles para los reportes de ventas
export enum ReportPeriod {
  TODAY      = 'today',
  WEEK       = 'week',
  MONTH      = 'month',
  QUARTER    = 'quarter',
  YEAR       = 'year',
  CUSTOM     = 'custom',
}

//  DTO para filtros del reporte de ventas 
// Se usa como @Query() en el controller
export class SalesReportQueryDto {
  @ApiPropertyOptional({
    enum: ReportPeriod,
    default: ReportPeriod.MONTH,
    description: 'Período del reporte',
  })
  @IsOptional()
  @IsEnum(ReportPeriod)
  period?: ReportPeriod = ReportPeriod.MONTH;

  @ApiPropertyOptional({
    example: '2025-01-01',
    description: 'Fecha de inicio (solo si period=custom)',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2025-12-31',
    description: 'Fecha de fin (solo si period=custom)',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    example: 10,
    description: 'Límite de productos en el top (1-50)',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  topLimit?: number = 10;
}

//  DTO para filtros del reporte de inventario 
export class InventoryReportQueryDto {
  @ApiPropertyOptional({
    example: 10,
    description: 'Umbral de stock bajo. Productos con stock menor a este valor se consideran "bajo stock"',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  stockThreshold?: number = 10;

  @ApiPropertyOptional({
    example: 20,
    description: 'Cantidad de movimientos recientes a mostrar',
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  movementsLimit?: number = 20;
}

//  Clases de creación y actualización (no aplican para reports) 
// Se mantienen vacías porque reports es de solo lectura,
// pero se exportan para que no haya imports rotos desde index.ts

export class CreateReportDto {
  // Reports no se crean manualmente — son generados por el sistema
  // Esta clase existe para mantener la estructura del módulo consistente
}

export class UpdateReportDto {
  // Reports no se actualizan manualmente
  // Esta clase existe para mantener la estructura del módulo consistente
}
