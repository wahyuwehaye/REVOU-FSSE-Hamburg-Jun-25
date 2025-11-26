import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly requests = new Map<string, RateLimitInfo>();

  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const windowMs = this.configService.get<number>('RATE_LIMIT_WINDOW_MS') || 900000; // 15 minutes
    const maxRequests = this.configService.get<number>('RATE_LIMIT_MAX') || 100;
    
    const now = Date.now();
    const rateLimitInfo = this.requests.get(ip);

    if (!rateLimitInfo || now > rateLimitInfo.resetTime) {
      // New window or expired window
      this.requests.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
    } else {
      // Existing window
      rateLimitInfo.count++;

      if (rateLimitInfo.count > maxRequests) {
        const retryAfter = Math.ceil((rateLimitInfo.resetTime - now) / 1000);
        
        res.setHeader('X-RateLimit-Limit', maxRequests.toString());
        res.setHeader('X-RateLimit-Remaining', '0');
        res.setHeader('X-RateLimit-Reset', rateLimitInfo.resetTime.toString());
        res.setHeader('Retry-After', retryAfter.toString());

        throw new HttpException(
          'Too many requests. Please try again later.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }

    const currentInfo = this.requests.get(ip)!;
    res.setHeader('X-RateLimit-Limit', maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', (maxRequests - currentInfo.count).toString());
    res.setHeader('X-RateLimit-Reset', currentInfo.resetTime.toString());

    next();
  }
}
