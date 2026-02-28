import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ListasDeseosService } from './listas-deseos.service';
import { CreateListasDeseoDto } from './dto/create-listas-deseo.dto';
import { UpdateListasDeseoDto } from './dto/update-listas-deseo.dto';

@Controller('listas-deseos')
export class ListasDeseosController {
  constructor(private readonly listasDeseosService: ListasDeseosService) {}

  @Post()
  create(@Body() createListasDeseoDto: CreateListasDeseoDto) {
    return this.listasDeseosService.create(createListasDeseoDto);
  }

  @Get()
  findAll() {
    return this.listasDeseosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listasDeseosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateListasDeseoDto: UpdateListasDeseoDto) {
    return this.listasDeseosService.update(+id, updateListasDeseoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listasDeseosService.remove(+id);
  }
}
