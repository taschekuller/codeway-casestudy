import { IsNotEmpty, IsString, IsBoolean, IsObject, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

// Dynamic object with string keys and boolean values
export class FeaturesDto {
  [key: string]: boolean;
}

// Dynamic object with string keys and any values
export class RemoteConfigDto {
  [key: string]: any;
}

export class CreateAppConfigDto {
  @IsNotEmpty()
  @IsString()
  appVersion: string;

  @IsNotEmpty()
  @IsBoolean()
  forceUpdate: boolean;

  @IsNotEmpty()
  @IsString()
  minRequiredVersion: string;

  @IsNotEmpty()
  @IsBoolean()
  maintenanceMode: boolean;

  @IsNotEmpty()
  @IsObject()
  features: Record<string, boolean>;

  @IsNotEmpty()
  @IsObject()
  remoteConfig: Record<string, any>;
}

export class UpdateAppConfigDto {
  @IsOptional()
  @IsString()
  appVersion?: string;

  @IsOptional()
  @IsBoolean()
  forceUpdate?: boolean;

  @IsOptional()
  @IsString()
  minRequiredVersion?: string;

  @IsOptional()
  @IsBoolean()
  maintenanceMode?: boolean;

  @IsOptional()
  @IsObject()
  features?: Record<string, boolean>;

  @IsOptional()
  @IsObject()
  remoteConfig?: Record<string, any>;
}