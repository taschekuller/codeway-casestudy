import { Injectable, OnModuleInit } from '@nestjs/common';
import { getFirestore } from '../firebase-config';
import { AppConfig } from '../models/app-config.model';

@Injectable()
export class AppConfigService implements OnModuleInit {
  private firestore;

  onModuleInit() {
    // Initialize Firestore when the module is ready
    this.firestore = getFirestore();
  }

  private getFirestoreInstance() {
    if (!this.firestore) {
      this.firestore = getFirestore();
    }
    return this.firestore;
  }

  private readonly collection = 'app-configurations';

  async getAppConfig(id: string): Promise<AppConfig | null> {
    try {
      const doc = await this.getFirestoreInstance().collection(this.collection).doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return { id: doc.id, ...doc.data() } as AppConfig;
    } catch (error) {
      throw new Error(`Failed to get app configuration: ${error.message}`);
    }
  }

  async getAllAppConfigs(): Promise<AppConfig[]> {
    try {
      const snapshot = await this.getFirestoreInstance().collection(this.collection).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as AppConfig);
    } catch (error) {
      throw new Error(`Failed to get app configurations: ${error.message}`);
    }
  }

  async createAppConfig(config: AppConfig): Promise<AppConfig> {
    try {
      const now = new Date();
      const configWithTimestamps = {
        ...config,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await this.getFirestoreInstance().collection(this.collection).add(configWithTimestamps);
      return { id: docRef.id, ...configWithTimestamps };
    } catch (error) {
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
      return { id: updatedDoc.id, ...updatedDoc.data() } as AppConfig;
    } catch (error) {
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
      throw new Error(`Failed to delete app configuration: ${error.message}`);
    }
  }
}