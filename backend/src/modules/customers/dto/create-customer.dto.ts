import {
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 1, description: 'ID del usuario al que pertenece este perfil' })
  @IsInt({ message: 'userId debe ser un número entero.' })
  @Min(1)
  @IsNotEmpty({ message: 'El ID de usuario es obligatorio.' })
  userId!: number;

  @ApiPropertyOptional({ example: 'Calle 123 # 45-67, Barrio Villacaimaron', description: 'Dirección de envío' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  address?: string;

  @ApiPropertyOptional({ example: 'PUTUMAYO', description: 'Ciudad' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ example: 'Colombia', description: 'País' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional({ example: '860001', description: 'Código postal' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  postalCode?: string;

  @ApiPropertyOptional({ example: '800102891', description: 'Identificación fiscal (NIT, RUT, DNI, etc.)' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  taxId?: string;
}
