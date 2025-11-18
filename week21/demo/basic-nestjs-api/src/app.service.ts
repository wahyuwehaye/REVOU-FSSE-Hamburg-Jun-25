import { Injectable } from '@nestjs/common';

/**
 * Root Service
 * Contains business logic for root endpoints
 * 
 * @Injectable() - decorator marks class as provider
 * This allows the class to be injected into other classes
 */
@Injectable()
export class AppService {
  /**
   * Get welcome message
   * Simple method that returns a string
   */
  getHello(): string {
    return 'Hello from Basic NestJS API! Visit /products to see the products API.';
  }
}
