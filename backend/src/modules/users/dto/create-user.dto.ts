import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString({ message: 'El nombre debe ser un texto.' })
    @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
    name: string;

    @IsEmail({}, { message: 'El formato del email no es válido.' })
    @IsNotEmpty({ message: 'El email no puede estar vacío.' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'La contraseña не puede estar vacía.' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    password: string;

    @IsOptional()
    @IsString({ message: 'El número de teléfono debe ser un texto.' })
    phone?: string;

    @IsOptional()
    @IsInt({ message: 'El rol debe ser un número entero.' })
    roleId?: number;
}
