import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('debug-token')
  getDebugToken(): { tokenExists: boolean } {
    // Only returns if token exists, not the actual token for security
    const apiToken = this.configService.get<string>('API_TOKEN');
    return {
      tokenExists: !!apiToken,
    };
  }
}
