import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsIn,
  IsPositive,
  Min,
} from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion: string;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsNumber()
  @IsPositive()
  precio: number;

  @IsString()
  @IsOptional()
  imagen_url: string;

  @IsIn(['visible', 'oculto'])
  @IsOptional()
  estado: string;

  @IsNumber()
  categoria_id: number;
}

