// ===========================================
// SegurityGAB — Customers Controller
// ===========================================
// Rutas:
//   GET    /api/v1/customers         → Solo Admin: listar todos los clientes
//   GET    /api/v1/customers/me      → Autenticado: ver mi perfil de cliente
//   GET    /api/v1/customers/:id     → Solo Admin: ver cliente por ID
//   POST   /api/v1/customers         → Autenticado: crear perfil de cliente propio
//   PATCH  /api/v1/customers/:id     → Admin o propietario: actualizar
//   DELETE /api/v1/customers/:id     → Solo Admin: eliminar perfil de cliente

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, Role } from '../auth/decorators/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../auth/decorators/current-user.decorator';

@ApiTags('customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  //  GET /customers  Solo Admin 
  @Get()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Listar todos los perfiles de cliente (Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de clientes con datos del usuario' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  findAll() {
    return this.customersService.findAll();
  }

  //  GET /customers/me  Usuario autenticado 
  @Get('me')
  @ApiOperation({ summary: 'Ver mi perfil de cliente' })
  @ApiResponse({ status: 200, description: 'Perfil de cliente del usuario autenticado' })
  @ApiResponse({ status: 404, description: 'No tienes perfil de cliente aún' })
  async findMe(@CurrentUser() user: AuthenticatedUser) {
    return this.customersService.findByUserId(user.id);
  }

  //  GET /customers/:id  Solo Admin 
  @Get(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Ver perfil de cliente por ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Perfil de cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findById(id);
  }

  //  POST /customers  Usuario autenticado
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear perfil de cliente' })
  @ApiResponse({ status: 201, description: 'Perfil de cliente creado' })
  @ApiResponse({ status: 409, description: 'Este usuario ya tiene un perfil de cliente' })
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    // Un cliente solo puede crear su propio perfil. Admin puede crear para cualquier usuario.
    if (user.roleId !== Role.Admin && createCustomerDto.userId !== user.id) {
      throw new ForbiddenException('Solo puedes crear tu propio perfil de cliente.');
    }
    return this.customersService.create(createCustomerDto);
  }

  //  PATCH /customers/:id  Admin o propietario 
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar perfil de cliente' })
  @ApiResponse({ status: 200, description: 'Perfil actualizado' })
  @ApiResponse({ status: 403, description: 'No puedes editar el perfil de otro usuario' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    // Verificar primero que el customer existe
    const customer = await this.customersService.findById(id);

    // Un cliente solo puede editar su propio perfil
    if (user.roleId !== Role.Admin && customer.userId !== user.id) {
      throw new ForbiddenException('No puedes editar el perfil de otro usuario.');
    }

    return this.customersService.update(id, updateCustomerDto);
  }

  //  DELETE /customers/:id  Solo Admin 
  @Delete(':id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar perfil de cliente (Admin)' })
  @ApiResponse({ status: 204, description: 'Perfil eliminado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.customersService.remove(id);
  }
}
