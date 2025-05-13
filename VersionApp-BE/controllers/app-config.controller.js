"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AppConfigController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigController = void 0;
const common_1 = require("@nestjs/common");
const app_config_service_1 = require("../../services/app-config.service");
const firebase_auth_guard_1 = require("../../auth/firebase-auth.guard");
const api_token_guard_1 = require("../../auth/api-token.guard");
const app_config_dto_1 = require("../dto/app-config.dto");
let AppConfigController = AppConfigController_1 = class AppConfigController {
    appConfigService;
    logger = new common_1.Logger(AppConfigController_1.name);
    constructor(appConfigService) {
        this.appConfigService = appConfigService;
    }
    async createAppConfig(createDto) {
        this.logger.log(`Received create request with data: ${JSON.stringify(createDto)}`);
        try {
            if (!createDto.paramKey) {
                throw new common_1.BadRequestException('Parameter key is required');
            }
            if (!createDto.value) {
                throw new common_1.BadRequestException('Parameter value is required');
            }
            const configData = {
                paramKey: createDto.paramKey.trim(),
                value: createDto.value.trim(),
                description: createDto.description?.trim() || '',
            };
            this.logger.log(`Creating config with sanitized data: ${JSON.stringify(configData)}`);
            return this.appConfigService.createAppConfig(configData);
        }
        catch (error) {
            this.logger.error(`Error creating config: ${error.message}`, error.stack);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to create parameter configuration');
        }
    }
    async updateAppConfig(id, updateDto) {
        this.logger.log(`Received update request for id ${id} with data: ${JSON.stringify(updateDto)}`);
        try {
            if (Object.keys(updateDto).length === 0) {
                throw new common_1.BadRequestException('No update data provided');
            }
            const sanitizedData = {};
            if (updateDto.paramKey !== undefined) {
                if (!updateDto.paramKey.trim()) {
                    throw new common_1.BadRequestException('Parameter key cannot be empty');
                }
                sanitizedData.paramKey = updateDto.paramKey.trim();
            }
            if (updateDto.value !== undefined) {
                if (!updateDto.value.trim()) {
                    throw new common_1.BadRequestException('Parameter value cannot be empty');
                }
                sanitizedData.value = updateDto.value.trim();
            }
            if (updateDto.description !== undefined) {
                sanitizedData.description = updateDto.description.trim();
            }
            this.logger.log(`Updating config with sanitized data: ${JSON.stringify(sanitizedData)}`);
            const updatedConfig = await this.appConfigService.updateAppConfig(id, sanitizedData);
            if (!updatedConfig) {
                throw new common_1.NotFoundException(`Parameter configuration with ID ${id} not found`);
            }
            return updatedConfig;
        }
        catch (error) {
            this.logger.error(`Error updating config: ${error.message}`, error.stack);
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to update parameter configuration');
        }
    }
    async deleteAppConfig(id) {
        try {
            const success = await this.appConfigService.deleteAppConfig(id);
            if (!success) {
                throw new common_1.NotFoundException(`Parameter configuration with ID ${id} not found`);
            }
            return { success };
        }
        catch (error) {
            this.logger.error(`Error deleting config: ${error.message}`, error.stack);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to delete parameter configuration');
        }
    }
    async getAllAppConfigs() {
        try {
            return this.appConfigService.getAllAppConfigs();
        }
        catch (error) {
            this.logger.error(`Error fetching all configs: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Failed to fetch parameter configurations');
        }
    }
    async getAppConfigForAdmin(id) {
        try {
            const config = await this.appConfigService.getAppConfig(id);
            if (!config) {
                throw new common_1.NotFoundException(`Parameter configuration with ID ${id} not found`);
            }
            return config;
        }
        catch (error) {
            this.logger.error(`Error fetching config: ${error.message}`, error.stack);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to fetch parameter configuration');
        }
    }
    async getAppConfig(id) {
        try {
            const config = await this.appConfigService.getAppConfig(id);
            if (!config) {
                throw new common_1.NotFoundException(`Parameter configuration with ID ${id} not found`);
            }
            return config;
        }
        catch (error) {
            this.logger.error(`Error fetching config: ${error.message}`, error.stack);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to fetch parameter configuration');
        }
    }
};
exports.AppConfigController = AppConfigController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [app_config_dto_1.CreateAppConfigDto]),
    __metadata("design:returntype", Promise)
], AppConfigController.prototype, "createAppConfig", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, app_config_dto_1.UpdateAppConfigDto]),
    __metadata("design:returntype", Promise)
], AppConfigController.prototype, "updateAppConfig", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppConfigController.prototype, "deleteAppConfig", null);
__decorate([
    (0, common_1.Get)('admin'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppConfigController.prototype, "getAllAppConfigs", null);
__decorate([
    (0, common_1.Get)('admin/:id'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppConfigController.prototype, "getAppConfigForAdmin", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(api_token_guard_1.ApiTokenGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppConfigController.prototype, "getAppConfig", null);
exports.AppConfigController = AppConfigController = AppConfigController_1 = __decorate([
    (0, common_1.Controller)('app-config'),
    __metadata("design:paramtypes", [app_config_service_1.AppConfigService])
], AppConfigController);
//# sourceMappingURL=app-config.controller.js.map