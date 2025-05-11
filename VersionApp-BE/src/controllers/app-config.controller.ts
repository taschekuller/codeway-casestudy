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
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppConfigService } from '../services/app-config.service';
import { AppConfig } from '../models/app-config.model';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { ApiTokenGuard } from '../auth/api-token.guard';
import { CreateAppConfigDto, UpdateAppConfigDto } from '../dto/app-config.dto';

@Controller('app-config')
export class AppConfigController {
  private readonly logger = new Logger(AppConfigController.name);

  constructor(private readonly appConfigService: AppConfigService) { }

  @Post()
  @UseGuards(FirebaseAuthGuard)
  async createAppConfig(
    @Body() createDto: CreateAppConfigDto,
  ): Promise<AppConfig> {
    this.logger.log(
      `Received create request with data: ${JSON.stringify(createDto)}`,
    );

    try {
      // Ensure we have the required fields
      if (!createDto.paramKey) {
        throw new BadRequestException('Parameter key is required');
      }

      if (!createDto.value) {
        throw new BadRequestException('Parameter value is required');
      }

      const configData = {
        paramKey: createDto.paramKey.trim(),
        value: createDto.value.trim(),
        description: createDto.description?.trim() || '',
      };

      this.logger.log(
        `Creating config with sanitized data: ${JSON.stringify(configData)}`,
      );
      return this.appConfigService.createAppConfig(configData as AppConfig);
    } catch (error) {
      this.logger.error(`Error creating config: ${error.message}`, error.stack);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to create parameter configuration',
      );
    }
  }

  @Put(':id')
  @UseGuards(FirebaseAuthGuard)
  async updateAppConfig(
    @Param('id') id: string,
    @Body() updateDto: UpdateAppConfigDto,
  ): Promise<AppConfig> {
    this.logger.log(
      `Received update request for id ${id} with data: ${JSON.stringify(updateDto)}`,
    );

    try {
      if (Object.keys(updateDto).length === 0) {
        throw new BadRequestException('No update data provided');
      }

      const sanitizedData: Partial<AppConfig> = {};

      if (updateDto.paramKey !== undefined) {
        if (!updateDto.paramKey.trim()) {
          throw new BadRequestException('Parameter key cannot be empty');
        }
        sanitizedData.paramKey = updateDto.paramKey.trim();
      }

      if (updateDto.value !== undefined) {
        if (!updateDto.value.trim()) {
          throw new BadRequestException('Parameter value cannot be empty');
        }
        sanitizedData.value = updateDto.value.trim();
      }

      if (updateDto.description !== undefined) {
        sanitizedData.description = updateDto.description.trim();
      }

      this.logger.log(
        `Updating config with sanitized data: ${JSON.stringify(sanitizedData)}`,
      );

      const updatedConfig = await this.appConfigService.updateAppConfig(
        id,
        sanitizedData,
      );

      if (!updatedConfig) {
        throw new NotFoundException(
          `Parameter configuration with ID ${id} not found`,
        );
      }

      return updatedConfig;
    } catch (error) {
      this.logger.error(`Error updating config: ${error.message}`, error.stack);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to update parameter configuration',
      );
    }
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard)
  async deleteAppConfig(
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    try {
      const success = await this.appConfigService.deleteAppConfig(id);

      if (!success) {
        throw new NotFoundException(
          `Parameter configuration with ID ${id} not found`,
        );
      }

      return { success };
    } catch (error) {
      this.logger.error(`Error deleting config: ${error.message}`, error.stack);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to delete parameter configuration',
      );
    }
  }

  @Get('admin')
  @UseGuards(FirebaseAuthGuard)
  async getAllAppConfigs(): Promise<AppConfig[]> {
    try {
      return this.appConfigService.getAllAppConfigs();
    } catch (error) {
      this.logger.error(
        `Error fetching all configs: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to fetch parameter configurations',
      );
    }
  }

  @Get('admin/:id')
  @UseGuards(FirebaseAuthGuard)
  async getAppConfigForAdmin(@Param('id') id: string): Promise<AppConfig> {
    try {
      const config = await this.appConfigService.getAppConfig(id);

      if (!config) {
        throw new NotFoundException(
          `Parameter configuration with ID ${id} not found`,
        );
      }

      return config;
    } catch (error) {
      this.logger.error(`Error fetching config: ${error.message}`, error.stack);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to fetch parameter configuration',
      );
    }
  }

  @Get(':id')
  @UseGuards(ApiTokenGuard)
  async getAppConfig(@Param('id') id: string): Promise<AppConfig> {
    try {
      const config = await this.appConfigService.getAppConfig(id);

      if (!config) {
        throw new NotFoundException(
          `Parameter configuration with ID ${id} not found`,
        );
      }

      return config;
    } catch (error) {
      this.logger.error(`Error fetching config: ${error.message}`, error.stack);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to fetch parameter configuration',
      );
    }
  }
}
