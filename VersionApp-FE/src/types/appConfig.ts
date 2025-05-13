export interface AppConfig {
  id?: string;
  appVersion: string;
  forceUpdate: boolean;
  minRequiredVersion: string;
  maintenanceMode: boolean;
  features: {
    [key: string]: boolean;
  };
  remoteConfig: {
    [key: string]: any;
  };
  createdAt?: Date;
  updatedAt?: Date;
}