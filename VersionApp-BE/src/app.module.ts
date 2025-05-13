import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { AppConfigController } from './controllers/app-config.controller';
import { AppConfigService } from './services/app-config.service';
import { ConfigService } from '@nestjs/config';
import { initializeFirebase } from './firebase-config';

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [AppController, AppConfigController],
  providers: [AppService, AppConfigService],
})
export class AppModule implements OnModuleInit {
  constructor(private configService: ConfigService) { }

  onModuleInit() {
    // Ensure Firebase is initialized when the app starts
    initializeFirebase(this.configService);
  }
}
