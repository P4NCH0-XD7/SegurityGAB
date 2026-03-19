// ===========================================
// SegurityGAB — @CurrentUser() Decorator
// ===========================================
// Extrae el usuario autenticado del request.
// Uso: @CurrentUser() user: AuthenticatedUser
//
// Ejemplo:
//   @Get('profile')
//   getProfile(@CurrentUser() user: AuthenticatedUser) {
//     return user;
//   }

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthenticatedUser {
  id: number;
  email: string;
  roleId: number;
  name: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
