import httpClient from './httpClient';

// AppConfig type definition to resolve the import error
interface AppConfig {
  id?: string;
  appVersion: string;
  forceUpdate: boolean;
  minRequiredVersion: string;
  maintenanceMode: boolean;
  features: Record<string, boolean>;
  remoteConfig: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export const appConfigService = {
  // Get all app configurations (requires Firebase authentication)
  async getAllConfigs(): Promise<AppConfig[]> {
    try {
      const response = await httpClient.get('/app-config/admin');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching all configs:', error);
      throw error;
    }
  },

  // Get a specific configuration by ID (requires Firebase authentication)
  async getConfigById(id: string): Promise<AppConfig> {
    try {
      const response = await httpClient.get(`/app-config/admin/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching config by ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new configuration (requires Firebase authentication)
  async createConfig(config: Omit<AppConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<AppConfig> {
    try {
      const configToSend = {
        appVersion: config.appVersion || '',
        minRequiredVersion: config.minRequiredVersion || '',
        forceUpdate: Boolean(config.forceUpdate),
        maintenanceMode: Boolean(config.maintenanceMode),
        features: config.features || {},
        remoteConfig: config.remoteConfig || {}
      };

      console.log('Sending create config request with:', JSON.stringify(configToSend));
      const response = await httpClient.post('/app-config', configToSend);
      console.log('Create config response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating config:', error);
      if (error.response) {
        console.error('Response error data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  },

  // Update an existing configuration (requires Firebase authentication)
  async updateConfig(id: string, config: Partial<AppConfig>): Promise<AppConfig> {
    try {
      const configToSend = {
        ...(config.appVersion !== undefined ? { appVersion: String(config.appVersion) } : {}),
        ...(config.minRequiredVersion !== undefined ? { minRequiredVersion: String(config.minRequiredVersion) } : {}),
        ...(config.forceUpdate !== undefined ? { forceUpdate: Boolean(config.forceUpdate) } : {}),
        ...(config.maintenanceMode !== undefined ? { maintenanceMode: Boolean(config.maintenanceMode) } : {}),
        ...(config.features !== undefined ? { features: config.features } : {}),
        ...(config.remoteConfig !== undefined ? { remoteConfig: config.remoteConfig } : {})
      };

      console.log(`Sending update config request for ID ${id} with:`, JSON.stringify(configToSend));
      const response = await httpClient.put(`/app-config/${id}`, configToSend);
      console.log('Update config response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error updating config ${id}:`, error);
      if (error.response) {
        console.error('Response error data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  },

  // Delete a configuration (requires Firebase authentication)
  async deleteConfig(id: string): Promise<{ success: boolean }> {
    try {
      const response = await httpClient.delete(`/app-config/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error deleting config ${id}:`, error);
      throw error;
    }
  }
};