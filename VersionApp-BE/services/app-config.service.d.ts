import { OnModuleInit } from '@nestjs/common';
import { AppConfig } from '../models/app-config.model';
export declare class AppConfigService implements OnModuleInit {
    private firestore;
    private readonly logger;
    private readonly collection;
    onModuleInit(): void;
    private getFirestoreInstance;
    getAppConfig(id: string): Promise<AppConfig | null>;
    getAllAppConfigs(): Promise<AppConfig[]>;
    createAppConfig(config: AppConfig): Promise<AppConfig>;
    updateAppConfig(id: string, config: Partial<AppConfig>): Promise<AppConfig | null>;
    deleteAppConfig(id: string): Promise<boolean>;
}
