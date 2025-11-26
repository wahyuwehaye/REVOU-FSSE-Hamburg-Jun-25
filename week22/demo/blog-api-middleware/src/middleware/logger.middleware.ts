import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const requestId = req.headers['x-request-id'];
    const userAgent = req.get('user-agent') || '';

    // Log incoming request
    this.logger.log(
      `[${requestId}] ${method} ${originalUrl} - ${ip} - ${userAgent}`,
    );

    // Log response when finished
    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length') || 0;

      this.logger.log(
        `[${requestId}] ${method} ${originalUrl} - ${statusCode} - ${contentLength}bytes`,
      );
    });

    next();
  }
}
