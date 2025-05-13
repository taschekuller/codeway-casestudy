import { AppService } from './dist/app.service';
import { ConfigService } from '@nestjs/config';
export declare class AppController {
    private readonly appService;
    private readonly configService;
    constructor(appService: AppService, configService: ConfigService);
    getHello(): string;
    getDebugToken(): {
        tokenExists: boolean;
    };
}
