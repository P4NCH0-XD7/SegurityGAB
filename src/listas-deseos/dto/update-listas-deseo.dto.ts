import { PartialType } from '@nestjs/mapped-types';
import { CreateListasDeseoDto } from './create-listas-deseo.dto';

export class UpdateListasDeseoDto extends PartialType(CreateListasDeseoDto) {}
