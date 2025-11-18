import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';

/**
 * Root Module - Main module of the application
 * 
 * @Module decorator defines a module
 * - imports: other modules this module depends on
 * - controllers: controllers defined in this module
 * - providers: services that can be injected
 */
@Module({
  imports: [
    ProductsModule, // Import Products feature module
  ],
  controllers: [AppController], // Root controller
  providers: [AppService],       // Root service
})
export class AppModule {}
