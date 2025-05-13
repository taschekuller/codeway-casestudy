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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_module_1 = require("./config/config.module");
const auth_module_1 = require("./auth/auth.module");
const app_config_controller_1 = require("./controllers/app-config.controller");
const app_config_service_1 = require("./services/app-config.service");
const config_1 = require("@nestjs/config");
const firebase_config_1 = require("./firebase-config");
let AppModule = class AppModule {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        (0, firebase_config_1.initializeFirebase)(this.configService);
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [config_module_1.ConfigModule, auth_module_1.AuthModule],
        controllers: [app_controller_1.AppController, app_config_controller_1.AppConfigController],
        providers: [app_service_1.AppService, app_config_service_1.AppConfigService],
    }),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppModule);
//# sourceMappingURL=app.module.js.map