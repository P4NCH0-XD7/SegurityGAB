// ===========================================
// SegurityGAB — Inventory DTOs
// ===========================================

import {
  IsInt,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InventoryType } from '../entities/inventory.entity';

export class CreateInventoryDto {
  @ApiProperty({ example: 3, description: 'ID del producto' })
  @IsInt({ message: 'productId debe ser un número entero.' })
  @Min(1)
  productId!: number;

  @ApiProperty({
    enum: InventoryType,
    example: InventoryType.IN,
    description: 'Tipo de movimiento: IN (entrada), OUT (salida), ADJUSTMENT (ajuste manual)',
  })
  @IsEnum(InventoryType, {
    message: `type debe ser: ${Object.values(InventoryType).join(', ')}`,
  })
  type!: InventoryType;

  @ApiProperty({ example: 10, description: 'Cantidad del movimiento (siempre positivo)' })
  @IsInt({ message: 'quantity debe ser un número entero.' })
  @Min(1, { message: 'La cantidad mínima es 1.' })
  quantity!: number;

  @ApiPropertyOptional({
    example: 'Reabastecimiento proveedor XYZ',
    description: 'Motivo del movimiento',
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({
    example: 5,
    description: 'ID de referencia (venta, compra, etc.)',
  })
  @IsOptional()
  @IsInt()
  referenceId?: number;
}
