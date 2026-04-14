// Polyfill for Node 18 — @nestjs/typeorm v11 uses crypto.randomUUID()
// which is only available globally in Node 20+
if (!globalThis.crypto) {
    const nodeCrypto = require('crypto');
    (globalThis as any).crypto = nodeCrypto.webcrypto;
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_NAME'),
                entities: [__dirname + '/../modules/**/*.entity{.ts,.js}'],
                synchronize: configService.get<string>('NODE_ENV') === 'development',
                logging: configService.get<string>('NODE_ENV') === 'development',
            }),
        }),
    ],
})
export class DatabaseModule { }
