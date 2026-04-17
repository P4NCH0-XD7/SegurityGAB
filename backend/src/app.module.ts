import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Feature Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CartModule } from './modules/cart/cart.module';
import { ProductsModule } from './modules/products/products.module';
import { SalesModule } from './modules/sales/sales.module';
import { InventorysModule } from './modules/inventory/inventory.module';
import { CustomersModule } from './modules/customers/customers.module';
import { WishlistsModule } from './modules/wishlist/wishlist.module';
// import { CategoriesModule } from './modules/categories/categories.module';
// import { SuppliersModule } from './modules/suppliers/suppliers.module';
// import { SaleDetailsModule } from './modules/sale-details/sale-details.module';
// import { ReportsModule } from './modules/reports/reports.module';

// Database
import { DatabaseModule } from './database/database.module';
import { RolesModule } from './modules/roles/roles.module';

@Module({
  imports: [
    // Environment variables configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),

    // Database connection
    DatabaseModule,

    // Feature modules
    AuthModule,
    UsersModule,
    CartModule,
    ProductsModule,
    RolesModule,
    SalesModule,
    InventorysModule,
    CustomersModule,
    WishlistsModule,
    // CategoriesModule,
    // SuppliersModule,
    // SaleDetailsModule,
    // ReportsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
