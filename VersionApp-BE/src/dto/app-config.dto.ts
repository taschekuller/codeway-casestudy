import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class FeaturesDto {
  [key: string]: boolean;
}

export class RemoteConfigDto {
  [key: string]: any;
}

export class CreateAppConfigDto {
  @IsNotEmpty()
  @IsString()
  paramKey: string;

  @IsNotEmpty()
  @IsString()
  value: string;

  @IsOptional()
  @IsString()
  description: string;
}

export class UpdateAppConfigDto {
  @IsOptional()
  @IsString()
  paramKey?: string;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
