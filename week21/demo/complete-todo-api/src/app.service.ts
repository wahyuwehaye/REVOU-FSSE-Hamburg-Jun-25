import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWelcome() {
    return {
      message: 'Welcome to Complete Todo API! 🚀',
      version: '1.0.0',
      endpoints: {
        todos: '/todos',
        categories: '/categories',
        health: '/health',
        info: '/info',
      },
      documentation: 'Check README.md for detailed API documentation',
    };
  }

  getHealth() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }

  getInfo() {
    return {
      name: 'Complete Todo API',
      version: '1.0.0',
      description: 'Comprehensive NestJS API covering all Week 21 materials',
      features: [
        'CRUD Operations',
        'Input Validation with class-validator',
        'Error Handling with custom filters',
        'Query Parameters (filtering, sorting, pagination)',
        'Search functionality',
        'Nested resources (categories/todos)',
        'Custom response format',
        'Request/Response transformation',
      ],
      technologies: ['NestJS', 'TypeScript', 'class-validator', 'class-transformer'],
      author: 'RevoU Week 21',
    };
  }
}
