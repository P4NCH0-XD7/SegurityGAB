// ===========================================
// SegurityGAB — Backend Entry Point
// ===========================================
// Configura global pipes, guards, CORS, Swagger
// y arranca el servidor HTTP.

import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global de rutas: /api/v1
  app.setGlobalPrefix(process.env.API_PREFIX || 'api/v1');

  // ── Guard JWT global ──────────────────────────────────────────────────────
  // Protege TODOS los endpoints automáticamente.
  // Para hacer un endpoint público usa el decorador @Public().
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // ── Validación global de DTOs ─────────────────────────────────────────────
  // whitelist: elimina campos no declarados en el DTO
  // forbidNonWhitelisted: lanza error si llegan campos extra
  // transform: convierte tipos automáticamente (string → number, etc.)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ── CORS ──────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // ── Swagger ───────────────────────────────────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('SegurityGAB API')
      .setDescription('API REST para el sistema de comercio electrónico SegurityGAB')
      .setVersion('1.0')
      .addBearerAuth()   // Habilita el campo "Authorize" con Bearer token en Swagger UI
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🛡️  SegurityGAB API running on: http://localhost:${port}/api/v1`);

  if (process.env.NODE_ENV !== 'production') {
    console.log(`📄 Swagger docs:          http://localhost:${port}/api/docs`);
  }
}

bootstrap();
