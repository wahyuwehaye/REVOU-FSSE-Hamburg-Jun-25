import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Bootstrap function - Entry point of the application
 * This function initializes the NestJS application
 */
async function bootstrap() {
  // Create NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Enable CORS (Cross-Origin Resource Sharing)
  // Allows frontend from different origin to access API
  app.enableCors();

  // Start server on port 3000
  await app.listen(3000);

  console.log('🚀 Application is running on: http://localhost:3000');
}

bootstrap();
