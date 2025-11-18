import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

/**
 * Products Module
 * Feature module for products functionality
 * 
 * This module encapsulates all products-related code
 * - Controller: handles HTTP requests
 * - Service: contains business logic
 */
@Module({
  controllers: [ProductsController], // Register products controller
  providers: [ProductsService],       // Register products service
  exports: [ProductsService],         // Export service to use in other modules
})
export class ProductsModule {}
