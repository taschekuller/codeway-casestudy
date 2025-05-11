import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AppConfigService } from '../services/app-config.service';
import { AppConfig } from '../models/app-config.model';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { ApiTokenGuard } from '../auth/api-token.guard';

@Controller('app-config')
export class AppConfigController {
  private readonly logger = new Logger(AppConfigController.name);

  constructor(private readonly appConfigService: AppConfigService) { }

  @Post()
  @UseGuards(FirebaseAuthGuard)
  async createAppConfig(@Body() createDto: any): Promise<AppConfig> {
    this.logger.log(
      `Received create request with data: ${JSON.stringify(createDto)}`,
    );

    try {
      if (!createDto.appVersion || !createDto.minRequiredVersion) {
        throw new Error('Missing required fields');
      }

      const configData = {
        ...createDto,
        forceUpdate: Boolean(createDto.forceUpdate),
        maintenanceMode: Boolean(createDto.maintenanceMode),
        features: createDto.features || {},
        remoteConfig: createDto.remoteConfig || {},
      };

      return this.appConfigService.createAppConfig(configData as AppConfig);
    } catch (error) {
      this.logger.error(`Error creating config: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Post('debug')
  @UseGuards(FirebaseAuthGuard)
  async debugCreateConfig(@Body() createDto: any): Promise<any> {
    this.logger.log(
      `Received debug create request with data: ${JSON.stringify(createDto)}`,
    );
    return {
      received: createDto,
      featuresType: typeof createDto.features,
      remoteConfigType: typeof createDto.remoteConfig,
      validation: {
        hasAppVersion: !!createDto.appVersion,
        hasMinRequiredVersion: !!createDto.minRequiredVersion,
        hasFeaturesObject: typeof createDto.features === 'object',
        hasRemoteConfigObject: typeof createDto.remoteConfig === 'object',
      },
    };
  }

  @Put(':id')
  @UseGuards(FirebaseAuthGuard)
  async updateAppConfig(
    @Param('id') id: string,
    @Body() updateDto: any,
  ): Promise<AppConfig> {
    this.logger.log(
      `Received update request for id ${id} with data: ${JSON.stringify(updateDto)}`,
    );

    try {
      const configData = { ...updateDto };
      if ('forceUpdate' in configData) {
        configData.forceUpdate = Boolean(configData.forceUpdate);
      }
      if ('maintenanceMode' in configData) {
        configData.maintenanceMode = Boolean(configData.maintenanceMode);
      }

      const updatedConfig = await this.appConfigService.updateAppConfig(
        id,
        configData,
      );
      if (!updatedConfig) {
        throw new NotFoundException(
          `App configuration with ID ${id} not found`,
        );
      }
      return updatedConfig;
    } catch (error) {
      this.logger.error(`Error updating config: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard)
  async deleteAppConfig(
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    const success = await this.appConfigService.deleteAppConfig(id);
    if (!success) {
      throw new NotFoundException(`App configuration with ID ${id} not found`);
    }
    return { success };
  }

  @Get('admin')
  @UseGuards(FirebaseAuthGuard)
  async getAllAppConfigs(): Promise<AppConfig[]> {
    return this.appConfigService.getAllAppConfigs();
  }

  @Get('admin/:id')
  @UseGuards(FirebaseAuthGuard)
  async getAppConfigForAdmin(@Param('id') id: string): Promise<AppConfig> {
    const config = await this.appConfigService.getAppConfig(id);
    if (!config) {
      throw new NotFoundException(`App configuration with ID ${id} not found`);
    }
    return config;
  }

  @Get(':id')
  @UseGuards(ApiTokenGuard)
  async getAppConfig(@Param('id') id: string): Promise<AppConfig> {
    const config = await this.appConfigService.getAppConfig(id);
    if (!config) {
      throw new NotFoundException(`App configuration with ID ${id} not found`);
    }
    return config;
  }
}
