// ===========================================
// SegurityGAB — Sales DTOs
// ===========================================

import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsArray,
  ValidateNested,
  Min,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SaleStatus } from '../entities/sale.entity';

//  DTO de cada ítem dentro de la venta 
export class CreateSaleItemDto {
  @ApiProperty({ example: 3, description: 'ID del producto' })
  @IsInt({ message: 'productId debe ser un número entero.' })
  @Min(1)
  productId!: number;

  @ApiProperty({ example: 2, description: 'Cantidad de unidades' })
  @IsInt({ message: 'quantity debe ser un número entero.' })
  @Min(1, { message: 'La cantidad mínima es 1.' })
  quantity!: number;
}

//  DTO para crear una venta 
export class CreateSaleDto {
  @ApiProperty({ example: 1, description: 'ID del usuario que realiza la compra' })
  @IsInt({ message: 'userId debe ser un número entero.' })
  @Min(1)
  userId!: number;

  @ApiProperty({ example: 'Calle 123, Bogotá, Colombia', description: 'Dirección de envío' })
  @IsString({ message: 'shippingAddress debe ser texto.' })
  @IsNotEmpty({ message: 'La dirección de envío es requerida.' })
  shippingAddress!: string;

  @ApiProperty({
    type: [CreateSaleItemDto],
    description: 'Lista de productos con cantidad',
    example: [{ productId: 1, quantity: 2 }, { productId: 3, quantity: 1 }],
  })
  @IsArray({ message: 'items debe ser un arreglo.' })
  @ArrayMinSize(1, { message: 'La venta debe tener al menos un producto.' })
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  items!: CreateSaleItemDto[];
}

// DTO para cambiar el estado de una venta 
export class UpdateSaleStatusDto {
  @ApiProperty({
    enum: SaleStatus,
    example: SaleStatus.PAID,
    description: 'Nuevo estado de la venta',
  })
  @IsEnum(SaleStatus, {
    message: `status debe ser uno de: ${Object.values(SaleStatus).join(', ')}`,
  })
  status!: SaleStatus;

  @ApiPropertyOptional({ example: 'Cliente canceló el pedido', description: 'Motivo (obligatorio al cancelar)' })
  @IsOptional()
  @IsString()
  reason?: string;
}
