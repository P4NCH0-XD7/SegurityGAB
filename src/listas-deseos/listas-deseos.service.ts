import { Injectable } from '@nestjs/common';
import { CreateListasDeseoDto } from './dto/create-listas-deseo.dto';
import { UpdateListasDeseoDto } from './dto/update-listas-deseo.dto';

@Injectable()
export class ListasDeseosService {
  create(createListasDeseoDto: CreateListasDeseoDto) {
    return 'This action adds a new listasDeseo';
  }

  findAll() {
    return `This action returns all listasDeseos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} listasDeseo`;
  }

  update(id: number, updateListasDeseoDto: UpdateListasDeseoDto) {
    return `This action updates a #${id} listasDeseo`;
  }

  remove(id: number) {
    return `This action removes a #${id} listasDeseo`;
  }
}
