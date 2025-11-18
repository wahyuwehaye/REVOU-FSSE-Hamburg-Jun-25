import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getWelcome() {
    return this.appService.getWelcome();
  }

  @Get('health')
  getHealth() {
    return this.appService.getHealth();
  }

  @Get('info')
  getInfo() {
    return this.appService.getInfo();
  }
}
