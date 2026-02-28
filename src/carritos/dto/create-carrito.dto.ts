import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateCarritoDto {
  @IsNumber()
  @IsNotEmpty()
  cliente_id: number;
}

