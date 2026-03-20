import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'juan@example.com', description: 'Correo electrónico o nombre de usuario' })
  @IsNotEmpty({ message: 'El correo o usuario es requerido' })
  @IsString()
  emailOrUsername: string;

  @ApiProperty({ example: '123456', description: 'Contraseña del usuario' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo' })
  @IsNotEmpty({ message: 'El nombre completo es requerido' })
  @IsString()
  nombre_completo: string;

  @ApiProperty({ example: 'juan@example.com', description: 'Correo electrónico' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  @IsEmail({}, { message: 'El formato del correo es inválido' })
  correo_electronico: string;

  @ApiProperty({ example: '123456', description: 'Contraseña' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsOptional()
  @IsInt()
  roleId?: number;
}
