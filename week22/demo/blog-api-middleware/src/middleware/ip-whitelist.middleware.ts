import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IpWhitelistMiddleware implements NestMiddleware {
  private readonly whitelist: string[];

  constructor(private configService: ConfigService) {
    const whitelistString = this.configService.get<string>('IP_WHITELIST') || '127.0.0.1,::1';
    this.whitelist = whitelistString.split(',').map(ip => ip.trim());
  }

  use(req: Request, res: Response, next: NextFunction) {
    const clientIp = req.ip || req.socket.remoteAddress || '';
    
    // Check if IP is in whitelist
    const isAllowed = this.whitelist.some(allowedIp => {
      return clientIp === allowedIp || clientIp.includes(allowedIp);
    });

    if (!isAllowed) {
      throw new ForbiddenException('Access denied. IP not whitelisted.');
    }

    next();
  }
}
