// ===========================================
// SegurityGAB — Sales Controller
// ===========================================
// Rutas:
//   GET    /api/v1/sales              → Admin: todas las ventas
//   GET    /api/v1/sales/my           → Cliente: mis ventas
//   GET    /api/v1/sales/:id          → Admin o propietario
//   POST   /api/v1/sales              → Cliente autenticado: crear venta
//   PATCH  /api/v1/sales/:id/status   → Solo Admin: cambiar estado

import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { SalesService } from './sales.service';
import { CreateSaleDto, UpdateSaleStatusDto } from './dto/sale.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, Role } from '../auth/decorators/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../auth/decorators/current-user.decorator';

@ApiTags('sales')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  // GET /sales  Solo Admin 
  @Get()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Listar todas las ventas (Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de ventas con detalles y usuario' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  findAll() {
    return this.salesService.findAll();
  }

  //  GET /sales/my  Mis ventas (usuario autenticado) 
  @Get('my')
  @ApiOperation({ summary: 'Ver mis ventas (usuario autenticado)' })
  @ApiResponse({ status: 200, description: 'Ventas del usuario autenticado' })
  findMy(@CurrentUser() user: AuthenticatedUser) {
    return this.salesService.findByUser(user.id);
  }

  //  GET /sales/:id  Admin o propietario 
  @Get(':id')
  @ApiOperation({ summary: 'Ver detalle de una venta por ID' })
  @ApiResponse({ status: 200, description: 'Detalle de la venta con productos' })
  @ApiResponse({ status: 403, description: 'No autorizado para ver esta venta' })
  @ApiResponse({ status: 404, description: 'Venta no encontrada' })
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const sale = await this.salesService.findById(id);

    // Un cliente solo puede ver sus propias ventas
    if (user.roleId !== Role.Admin && sale.userId !== user.id) {
      throw new ForbiddenException('No tienes permiso para ver esta venta.');
    }

    return sale;
  }

  //  POST /sales  Crear venta (usuario autenticado) 
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nueva venta' })
  @ApiResponse({ status: 201, description: 'Venta creada. Stock descontado automáticamente.' })
  @ApiResponse({ status: 400, description: 'Stock insuficiente o producto no disponible' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async create(
    @Body() createSaleDto: CreateSaleDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    // Un cliente solo puede crear ventas a su propio nombre
    if (user.roleId !== Role.Admin && createSaleDto.userId !== user.id) {
      throw new ForbiddenException('Solo puedes crear ventas a tu propio nombre.');
    }

    return this.salesService.create(createSaleDto);
  }

  //  PATCH /sales/:id/status → Solo Admin 
  @Patch(':id/status')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Cambiar estado de una venta (Admin)' })
  @ApiResponse({ status: 200, description: 'Estado actualizado. Si se cancela, el stock se restaura.' })
  @ApiResponse({ status: 400, description: 'Transición de estado inválida' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @ApiResponse({ status: 404, description: 'Venta no encontrada' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSaleStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.salesService.updateStatus(id, dto, user.id, user.roleId);
  }
}
