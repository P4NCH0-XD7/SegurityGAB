// SegurityGAB/backend/src/modules/users/dto/update-user.dto.ts

import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// PartialType toma todas las propiedades de CreateUserDto y las hace opcionales
export class UpdateUserDto extends PartialType(CreateUserDto) {}
