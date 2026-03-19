// ===========================================
// SegurityGAB — Roles Guard
// ===========================================
// Guard para verificar el rol del usuario autenticado.
// Uso: @UseGuards(JwtAuthGuard, RolesGuard) + @Roles(Role.Admin)

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener los roles requeridos por el endpoint
    const requiredRoles = this.reflector.getAllAndOverride<number[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay roles requeridos, permitir el acceso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado.');
    }

    const hasRole = requiredRoles.includes(user.roleId);

    if (!hasRole) {
      throw new ForbiddenException(
        'No tienes permisos suficientes para realizar esta acción.',
      );
    }

    return true;
  }
}
