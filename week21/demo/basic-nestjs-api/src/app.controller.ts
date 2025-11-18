import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Root Controller
 * Handles requests to the root path '/'
 * 
 * @Controller() - decorator to define a controller
 * Empty string means root path
 */
@Controller()
export class AppController {
  /**
   * Constructor - Dependency Injection
   * NestJS automatically injects AppService instance
   */
  constructor(private readonly appService: AppService) {}

  /**
   * GET / endpoint
   * Returns welcome message
   * 
   * @Get() - decorator for HTTP GET method
   * @returns string message
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * GET /health endpoint
   * Health check endpoint to verify API is running
   */
  @Get('health')
  getHealth() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
