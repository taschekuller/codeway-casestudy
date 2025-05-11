import { IsNotEmpty, IsString, IsBoolean, IsObject, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class FeaturesDto {
  [key: string]: boolean;
}

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
  @ValidateNested()
  @Type(() => FeaturesDto)
  features: FeaturesDto;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => RemoteConfigDto)
  remoteConfig: RemoteConfigDto;
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
  @ValidateNested()
  @Type(() => FeaturesDto)
  features?: FeaturesDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => RemoteConfigDto)
  remoteConfig?: RemoteConfigDto;
}