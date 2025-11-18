import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend access
  app.enableCors();

  // Global Validation Pipe - Validates all DTOs automatically
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if unknown properties are present
      transform: true, // Auto-transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Convert primitive types automatically
      },
    }),
  );

  // Global Exception Filter - Consistent error responses
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Response Interceptor - Wrap all responses in standard format
  app.useGlobalInterceptors(new TransformInterceptor());

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log('');
  console.log('🚀 ===============================================');
  console.log('🚀  Complete Todo API is running!');
  console.log('🚀 ===============================================');
  console.log(`🚀  Server: http://localhost:${port}`);
  console.log(`🚀  Health: http://localhost:${port}/health`);
  console.log(`🚀  Todos:  http://localhost:${port}/todos`);
  console.log(`🚀  Categories: http://localhost:${port}/categories`);
  console.log('🚀 ===============================================');
  console.log('');
}

bootstrap();
