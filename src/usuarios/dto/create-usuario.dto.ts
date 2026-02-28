import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Length,
  IsIn,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  nombre: string;

  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  password_hash: string;

  @IsIn(['Admin', 'Cliente'])
  rol: string;
}

