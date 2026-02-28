import { Module } from '@nestjs/common';
import { ListasDeseosService } from './listas-deseos.service';
import { ListasDeseosController } from './listas-deseos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListaDeseos } from './entities/listas-deseo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ListaDeseos])],
  controllers: [ListasDeseosController],
  providers: [ListasDeseosService],
})
export class ListasDeseosModule {}

