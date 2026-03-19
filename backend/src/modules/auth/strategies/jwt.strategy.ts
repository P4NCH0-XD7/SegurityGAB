// ===========================================
// SegurityGAB — JWT Strategy
// ===========================================
// Valida el token JWT en cada request protegido.
// Extrae el payload y lo adjunta a req.user.

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

export interface JwtPayload {
  sub: number;       // ID del usuario
  email: string;     // Email del usuario
  role: number;      // roleId del usuario
  iat?: number;      // Issued at (generado automáticamente por JWT)
  exp?: number;      // Expiration (generado automáticamente por JWT)
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      // Extrae el token del header: Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Rechaza tokens expirados
      ignoreExpiration: false,
      // Clave secreta desde variables de entorno
      secretOrKey: configService.get<string>('JWT_SECRET') || 'super-secret-key-12345',
    });
  }

  /**
   * Se ejecuta automáticamente después de verificar la firma del token.
   * El objeto retornado aquí se adjunta a req.user en cada request.
   */
  async validate(payload: JwtPayload) {
    // Verificar que el usuario todavía existe y está activo en la BD
    const user = await this.usersService.findById(payload.sub);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Token inválido o usuario inactivo.');
    }

    // Lo que retornamos aquí es accesible via @CurrentUser() o req.user
    return {
      id: user.id,
      email: user.email,
      roleId: user.roleId,
      name: user.name,
    };
  }
}
