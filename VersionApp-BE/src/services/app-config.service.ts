import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { getFirestore } from '../firebase-config';
import { AppConfig } from '../models/app-config.model';

@Injectable()
export class AppConfigService implements OnModuleInit {
  private firestore;
  private readonly logger = new Logger(AppConfigService.name);
  private readonly collection = 'app-configurations';

  onModuleInit() {
    try {
      this.firestore = getFirestore();
      this.logger.log('Firestore initialized successfully');
    } catch (error) {
      this.logger.error(`Failed to initialize Firestore: ${error.message}`, error.stack);
      throw error;
    }
  }

  private getFirestoreInstance() {
    if (!this.firestore) {
      this.firestore = getFirestore();
    }
    return this.firestore;
  }

  async getAppConfig(id: string): Promise<AppConfig | null> {
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
      } as AppConfig;
    } catch (error) {
      this.logger.error(`Failed to get app configuration: ${error.message}`, error.stack);
      throw new Error(`Failed to get app configuration: ${error.message}`);
    }
  }

  async getAllAppConfigs(): Promise<AppConfig[]> {
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
        } as AppConfig;
      });
    } catch (error) {
      this.logger.error(`Failed to get app configurations: ${error.message}`, error.stack);
      throw new Error(`Failed to get app configurations: ${error.message}`);
    }
  }

  async createAppConfig(config: AppConfig): Promise<AppConfig> {
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
    } catch (error) {
      this.logger.error(`Failed to create app configuration: ${error.message}`, error.stack);
      throw new Error(`Failed to create app configuration: ${error.message}`);
    }
  }

  async updateAppConfig(id: string, config: Partial<AppConfig>): Promise<AppConfig | null> {
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
      } as AppConfig;
    } catch (error) {
      this.logger.error(`Failed to update app configuration: ${error.message}`, error.stack);
      throw new Error(`Failed to update app configuration: ${error.message}`);
    }
  }

  async deleteAppConfig(id: string): Promise<boolean> {
    try {
      const docRef = this.getFirestoreInstance().collection(this.collection).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return false;
      }

      await docRef.delete();
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete app configuration: ${error.message}`, error.stack);
      throw new Error(`Failed to delete app configuration: ${error.message}`);
    }
  }
}