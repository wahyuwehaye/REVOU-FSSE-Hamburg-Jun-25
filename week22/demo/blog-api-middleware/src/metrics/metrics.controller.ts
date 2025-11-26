import { Controller, Get } from '@nestjs/common';

@Controller('metrics')
export class MetricsController {
  @Get()
  getMetrics() {
    return {
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: 'MB',
      },
      uptime: {
        seconds: Math.round(process.uptime()),
        formatted: this.formatUptime(process.uptime()),
      },
      timestamp: new Date().toISOString(),
    };
  }

  private formatUptime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  }
}
