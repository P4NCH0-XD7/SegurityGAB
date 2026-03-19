// ===========================================
// SegurityGAB — @Public() Decorator
// ===========================================
// Marca un endpoint como público (no requiere JWT).
// Uso: @Public() antes de @Get(), @Post(), etc.
//
// Ejemplo:
//   @Public()
//   @Post('login')
//   async login(...) {}

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
