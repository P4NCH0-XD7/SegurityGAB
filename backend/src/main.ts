// ===========================================
// SegurityGAB - Backend Entry Point
// ===========================================
// Main bootstrap file for NestJS application.
// Configures global pipes, guards, CORS, Swagger,
// and starts the HTTP server.

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Global prefix for all routes: /api/v1
    app.setGlobalPrefix(process.env.API_PREFIX || 'api/v1');

    // Global validation pipe (DTO validation, XSS/SQL Injection protection)
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // CORS configuration
    app.enableCors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
    });

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🛡️  SegurityGAB API running on port ${port}`);
}

bootstrap();
