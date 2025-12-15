import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { User } from './modules/users/user_entity/user.entity';
import { Product } from './modules/products/products_entity/product_entity';

// Modules
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';

import { AdminModule } from './modules/users/admin/admin.module';

import { typeOrmConfig } from '../config/typeorm.config';

const dbRelatedModules =
  process.env.DB_DISABLED === 'true'
    ? []
    : [
        AuthModule,
        TypeOrmModule.forRootAsync({
          useFactory: () => typeOrmConfig,
        }),
        UsersModule,
        ProductsModule,
        AdminModule,
      ];

@Module({
  imports: [...dbRelatedModules],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
