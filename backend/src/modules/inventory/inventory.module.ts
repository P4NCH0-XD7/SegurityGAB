// ===========================================
// SegurityGAB — Inventory Module
// ===========================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Inventory } from './entities/inventory.entity';
import { Product } from '../products/entities/product.entity';

import { InventorysService } from './inventory.service';
import { InventorysController } from './inventory.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory, Product]),
    AuthModule,   // Necesario para JwtAuthGuard y RolesGuard
  ],
  controllers: [InventorysController],
  providers: [InventorysService],
  exports: [InventorysService],
})
export class InventorysModule {}
