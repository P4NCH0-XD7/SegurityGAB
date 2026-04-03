// ===========================================
// SegurityGAB — Inventory Controller
// ===========================================
// Rutas:
//   GET  /api/v1/inventory                    → Admin: todos los movimientos
//   GET  /api/v1/inventory/product/:productId → Admin: historial de un producto
//   GET  /api/v1/inventory/stock/:productId   → Admin: stock actual de un producto
//   GET  /api/v1/inventory/:id                → Admin: un movimiento por ID
//   POST /api/v1/inventory                    → Admin: registrar movimiento

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { InventorysService } from './inventory.service';
import { CreateInventoryDto } from './dto/inventory.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, Role } from '../auth/decorators/roles.decorator';

@ApiTags('inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)  // Todos los endpoints de inventario son solo para Admin
@Controller('inventory')
export class InventorysController {
  constructor(private readonly inventorysService: InventorysService) {}

  //  GET /inventory  Todos los movimientos 
  @Get()
  @ApiOperation({ summary: 'Listar todos los movimientos de inventario (Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de movimientos con producto incluido' })
  findAll() {
    return this.inventorysService.findAll();
  }

  //  GET /inventory/stock/:productId  Stock actual 
  @Get('stock/:productId')
  @ApiOperation({ summary: 'Consultar stock actual de un producto (Admin)' })
  @ApiResponse({ status: 200, description: 'Stock actual del producto' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  getStock(@Param('productId', ParseIntPipe) productId: number) {
    return this.inventorysService.getStock(productId);
  }

  //  GET /inventory/product/:productId  Historial de un producto 
  @Get('product/:productId')
  @ApiOperation({ summary: 'Ver historial de movimientos de un producto (Admin)' })
  @ApiResponse({ status: 200, description: 'Movimientos del producto ordenados por fecha' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.inventorysService.findByProduct(productId);
  }

  //  GET /inventory/:id  Un movimiento por ID 
  @Get(':id')
  @ApiOperation({ summary: 'Ver un movimiento de inventario por ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Detalle del movimiento' })
  @ApiResponse({ status: 404, description: 'Movimiento no encontrado' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.inventorysService.findById(id);
  }

  // POST /inventory  Registrar movimiento 
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar movimiento de inventario (Admin)' })
  @ApiResponse({
    status: 201,
    description:
      'Movimiento registrado. IN suma stock, OUT resta stock, ADJUSTMENT reemplaza el stock.',
  })
  @ApiResponse({ status: 400, description: 'Stock insuficiente para movimiento OUT' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  create(@Body() dto: CreateInventoryDto) {
    return this.inventorysService.create(dto);
  }
}
