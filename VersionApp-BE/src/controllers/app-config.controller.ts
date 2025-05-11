import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, UseGuards, ValidationPipe } from '@nestjs/common';
import { AppConfigService } from '../services/app-config.service';
import { AppConfig } from '../models/app-config.model';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { ApiTokenGuard } from '../auth/api-token.guard';
import { CreateAppConfigDto, UpdateAppConfigDto } from '../dto/app-config.dto';

@Controller('app-config')
export class AppConfigController {
  constructor(private readonly appConfigService: AppConfigService) { }

  // Endpoint for panel users to create a new configuration (requires Firebase auth)
  @Post()
  @UseGuards(FirebaseAuthGuard)
  async createAppConfig(@Body(ValidationPipe) createDto: CreateAppConfigDto): Promise<AppConfig> {
    return this.appConfigService.createAppConfig(createDto as AppConfig);
  }

  // Endpoint for panel users to update a configuration (requires Firebase auth)
  @Put(':id')
  @UseGuards(FirebaseAuthGuard)
  async updateAppConfig(
    @Param('id') id: string,
    @Body(ValidationPipe) updateDto: UpdateAppConfigDto,
  ): Promise<AppConfig> {
    const updatedConfig = await this.appConfigService.updateAppConfig(id, updateDto);
    if (!updatedConfig) {
      throw new NotFoundException(`App configuration with ID ${id} not found`);
    }
    return updatedConfig;
  }

  // Endpoint for panel users to delete a configuration (requires Firebase auth)
  @Delete(':id')
  @UseGuards(FirebaseAuthGuard)
  async deleteAppConfig(@Param('id') id: string): Promise<{ success: boolean }> {
    const success = await this.appConfigService.deleteAppConfig(id);
    if (!success) {
      throw new NotFoundException(`App configuration with ID ${id} not found`);
    }
    return { success };
  }

  // Endpoint for panel users to get all configurations (requires Firebase auth)
  @Get('admin')
  @UseGuards(FirebaseAuthGuard)
  async getAllAppConfigs(): Promise<AppConfig[]> {
    return this.appConfigService.getAllAppConfigs();
  }

  // Endpoint for panel users to get a specific configuration (requires Firebase auth)
  @Get('admin/:id')
  @UseGuards(FirebaseAuthGuard)
  async getAppConfigForAdmin(@Param('id') id: string): Promise<AppConfig> {
    const config = await this.appConfigService.getAppConfig(id);
    if (!config) {
      throw new NotFoundException(`App configuration with ID ${id} not found`);
    }
    return config;
  }

  // Endpoint for mobile client to get a specific configuration (requires API token)
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