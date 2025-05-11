import httpClient from './httpClient';

// AppConfig type definition to reflect the simplified structure
interface AppConfig {
  id?: string;
  paramKey: string;
  value: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const appConfigService = {
  async getAllConfigs(): Promise<AppConfig[]> {
    try {
      const response = await httpClient.get('/app-config/admin');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching all configs:', error);
      throw error;
    }
  },

  async getConfigById(id: string): Promise<AppConfig> {
    try {
      const response = await httpClient.get(`/app-config/admin/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching config by ID ${id}:`, error);
      throw error;
    }
  },

  async createConfig(config: Omit<AppConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<AppConfig> {
    try {
      const configToSend = {
        paramKey: config.paramKey || '',
        value: config.value || '',
        description: config.description || ''
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

  async updateConfig(id: string, config: Partial<AppConfig>): Promise<AppConfig> {
    try {
      const configToSend = {
        ...(config.paramKey !== undefined ? { paramKey: String(config.paramKey) } : {}),
        ...(config.value !== undefined ? { value: String(config.value) } : {}),
        ...(config.description !== undefined ? { description: String(config.description) } : {})
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