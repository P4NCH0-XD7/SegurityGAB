import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateListasDeseoDto {
  @IsNumber()
  @IsNotEmpty()
  cliente_id: number;

  @IsNumber()
  @IsNotEmpty()
  producto_id: number;
}

