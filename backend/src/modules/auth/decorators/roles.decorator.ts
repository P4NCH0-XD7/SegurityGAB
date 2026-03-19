// ===========================================
// SegurityGAB — @Roles() Decorator
// ===========================================
// Define los roleIds permitidos para un endpoint.
// Uso: @Roles(Role.Admin) o @Roles(Role.Admin, Role.Cliente)
//
// Ejemplo:
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(Role.Admin)
//   @Delete(':id')
//   async remove(...) {}

import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: number[]) => SetMetadata(ROLES_KEY, roles);

// Constantes de roles para no usar "magic numbers" en el código
export const Role = {
  Admin: 1,
  Cliente: 2,
} as const;
