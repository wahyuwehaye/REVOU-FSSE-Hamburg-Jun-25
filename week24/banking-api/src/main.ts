import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
const helmet = require('helmet');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`
  ╔════════════════════════════════════════╗
  ║   🏦 Banking API Server Started       ║
  ╠════════════════════════════════════════╣
  ║   Port:        ${port}                    ║
  ║   URL:         http://localhost:${port}   ║
  ║   API:         http://localhost:${port}/api/v1 ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}      ║
  ╚════════════════════════════════════════╝
  `);
}

bootstrap();
