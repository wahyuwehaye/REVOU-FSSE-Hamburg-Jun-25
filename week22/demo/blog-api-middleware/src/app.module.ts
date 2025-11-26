import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';
import { RequestIdMiddleware } from './middleware/request-id.middleware';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ApiKeyMiddleware } from './middleware/api-key.middleware';
import { ResponseTimeMiddleware } from './middleware/response-time.middleware';
import { RateLimitMiddleware } from './middleware/rate-limit.middleware';
import { IpWhitelistMiddleware } from './middleware/ip-whitelist.middleware';
import { HealthController } from './health/health.controller';
import { MetricsController } from './metrics/metrics.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Only for development
      }),
      inject: [ConfigService],
    }),
    PostsModule,
  ],
  controllers: [HealthController, MetricsController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply RequestId and Logger to all routes
    consumer
      .apply(RequestIdMiddleware, LoggerMiddleware, ResponseTimeMiddleware)
      .forRoutes('*');

    // Apply RateLimit to all routes
    consumer
      .apply(RateLimitMiddleware)
      .forRoutes('*');

    // Apply API key middleware to write operations (POST, PATCH)
    consumer
      .apply(ApiKeyMiddleware)
      .forRoutes(
        { path: 'posts', method: RequestMethod.POST },
        { path: 'posts/:id', method: RequestMethod.PATCH },
      );

    // Apply IP whitelist to DELETE operations (admin only)
    consumer
      .apply(IpWhitelistMiddleware)
      .forRoutes(
        { path: 'posts/:id', method: RequestMethod.DELETE },
      );
  }
}
