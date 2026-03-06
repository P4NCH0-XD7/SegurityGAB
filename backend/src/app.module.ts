// ===========================================
// SegurityGAB - Root Application Module
// ===========================================
// Central module that imports all feature modules,
// global configuration, and database connection.

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Feature Modules (import as needed)
// import { AuthModule } from './modules/auth/auth.module';
// import { UsersModule } from './modules/users/users.module';
// import { ProductsModule } from './modules/products/products.module';
// import { CategoriesModule } from './modules/categories/categories.module';
// import { InventoryModule } from './modules/inventory/inventory.module';
// import { CustomersModule } from './modules/customers/customers.module';
// import { SuppliersModule } from './modules/suppliers/suppliers.module';
// import { SalesModule } from './modules/sales/sales.module';
// import { SaleDetailsModule } from './modules/sale-details/sale-details.module';
// import { CartModule } from './modules/cart/cart.module';
// import { WishlistModule } from './modules/wishlist/wishlist.module';
// import { ReportsModule } from './modules/reports/reports.module';

// Database
// import { DatabaseModule } from './database/database.module';

@Module({
    imports: [
        // Environment variables configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env`,
        }),

        // Database connection
        // DatabaseModule,

        // Feature modules
        // AuthModule,
        // UsersModule,
        // ProductsModule,
        // CategoriesModule,
        // InventoryModule,
        // CustomersModule,
        // SuppliersModule,
        // SalesModule,
        // SaleDetailsModule,
        // CartModule,
        // WishlistModule,
        // ReportsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
