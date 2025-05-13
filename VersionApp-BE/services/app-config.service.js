"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AppConfigService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigService = void 0;
const common_1 = require("@nestjs/common");
const firebase_config_1 = require("../firebase-config");
let AppConfigService = AppConfigService_1 = class AppConfigService {
    firestore;
    logger = new common_1.Logger(AppConfigService_1.name);
    collection = 'app-configurations';
    onModuleInit() {
        try {
            this.firestore = (0, firebase_config_1.getFirestore)();
            this.logger.log('Firestore initialized successfully');
        }
        catch (error) {
            this.logger.error(`Failed to initialize Firestore: ${error.message}`, error.stack);
            throw error;
        }
    }
    getFirestoreInstance() {
        if (!this.firestore) {
            this.firestore = (0, firebase_config_1.getFirestore)();
        }
        return this.firestore;
    }
    async getAppConfig(id) {
        try {
            const doc = await this.getFirestoreInstance().collection(this.collection).doc(id).get();
            if (!doc.exists) {
                return null;
            }
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                paramKey: data.paramKey || '',
                value: data.value || '',
                description: data.description || ''
            };
        }
        catch (error) {
            this.logger.error(`Failed to get app configuration: ${error.message}`, error.stack);
            throw new Error(`Failed to get app configuration: ${error.message}`);
        }
    }
    async getAllAppConfigs() {
        try {
            const snapshot = await this.getFirestoreInstance().collection(this.collection).get();
            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    paramKey: data.paramKey || '',
                    value: data.value || '',
                    description: data.description || ''
                };
            });
        }
        catch (error) {
            this.logger.error(`Failed to get app configurations: ${error.message}`, error.stack);
            throw new Error(`Failed to get app configurations: ${error.message}`);
        }
    }
    async createAppConfig(config) {
        try {
            const now = new Date();
            const configWithTimestamps = {
                paramKey: config.paramKey,
                value: config.value,
                description: config.description || '',
                createdAt: now,
                updatedAt: now,
            };
            const docRef = await this.getFirestoreInstance().collection(this.collection).add(configWithTimestamps);
            return { id: docRef.id, ...configWithTimestamps };
        }
        catch (error) {
            this.logger.error(`Failed to create app configuration: ${error.message}`, error.stack);
            throw new Error(`Failed to create app configuration: ${error.message}`);
        }
    }
    async updateAppConfig(id, config) {
        try {
            const docRef = this.getFirestoreInstance().collection(this.collection).doc(id);
            const doc = await docRef.get();
            if (!doc.exists) {
                return null;
            }
            const updatedConfig = {
                ...config,
                updatedAt: new Date(),
            };
            await docRef.update(updatedConfig);
            const updatedDoc = await docRef.get();
            const data = updatedDoc.data();
            return {
                id: updatedDoc.id,
                ...data,
                paramKey: data.paramKey || '',
                value: data.value || '',
                description: data.description || ''
            };
        }
        catch (error) {
            this.logger.error(`Failed to update app configuration: ${error.message}`, error.stack);
            throw new Error(`Failed to update app configuration: ${error.message}`);
        }
    }
    async deleteAppConfig(id) {
        try {
            const docRef = this.getFirestoreInstance().collection(this.collection).doc(id);
            const doc = await docRef.get();
            if (!doc.exists) {
                return false;
            }
            await docRef.delete();
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to delete app configuration: ${error.message}`, error.stack);
            throw new Error(`Failed to delete app configuration: ${error.message}`);
        }
    }
};
exports.AppConfigService = AppConfigService;
exports.AppConfigService = AppConfigService = AppConfigService_1 = __decorate([
    (0, common_1.Injectable)()
], AppConfigService);
//# sourceMappingURL=app-config.service.js.map